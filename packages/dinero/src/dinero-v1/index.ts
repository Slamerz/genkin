// Dinero.js v1 compatibility layer
// This module provides a Dinero.js v1-compatible API that internally uses Genkin

import { Genkin, genkin } from '@genkin/core';
import { CurrencyCode, Currency, getCurrencyConfig, createCurrency, RoundingMode as CoreRoundingMode } from '@genkin/core';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate, percentage as genkinPercentage } from '@genkin/core';
import { equals as genkinEquals, lessThan as genkinLessThan, lessThanOrEqual as genkinLessThanOrEqual, greaterThan as genkinGreaterThan, greaterThanOrEqual as genkinGreaterThanOrEqual, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative } from '@genkin/core';
import type { AllocationRatio } from '@genkin/core';

/**
 * Global exchange rates API configuration
 */
export interface GlobalExchangeRatesApi {
  endpoint?: string | Promise<any>;
  propertyPath?: string;
  headers?: Record<string, string>;
}

/**
 * Default values for all Dinero objects.
 *
 * You can override default values for all subsequent Dinero objects by changing them directly on the global `Dinero` object.
 * Existing instances won't be affected.
 */
export const Defaults = {
  defaultAmount: 0,
  defaultCurrency: 'USD',
  defaultPrecision: 2
};

/**
 * Global settings for all Dinero objects.
 *
 * You can override global values for all subsequent Dinero objects by changing them directly on the global `Dinero` object.
 * Existing instances won't be affected.
 */
export const Globals = {
  globalLocale: 'en-US',
  globalFormat: '$0,0.00',
  globalRoundingMode: 'HALF_EVEN' as RoundingMode,
  globalFormatRoundingMode: 'HALF_AWAY_FROM_ZERO' as RoundingMode,
  globalExchangeRatesApi: {} as GlobalExchangeRatesApi
};

// Reference to the Dinero function for accessing current global values
let dineroRef: any = null;

/**
 * HTTP client function for fetching JSON data
 * This can be mocked in tests
 */
let getJSON = (url: string, options?: { headers?: Record<string, string> }) => {
  return fetch(url, {
    headers: options?.headers,
    ...options
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};

/**
 * Get the current global locale value
 */
function getGlobalLocale(): string {
  return dineroRef?.globalLocale ?? Globals.globalLocale;
}

/**
 * Get the current global format value
 */
function getGlobalFormat(): string {
  return dineroRef?.globalFormat ?? Globals.globalFormat;
}

/**
 * Get the current global format rounding mode value
 */
function getGlobalFormatRoundingMode(): RoundingMode {
  return dineroRef?.globalFormatRoundingMode ?? Globals.globalFormatRoundingMode;
}

/**
 * Get the current global rounding mode value
 */
function getGlobalRoundingMode(): RoundingMode {
  return dineroRef?.globalRoundingMode ?? Globals.globalRoundingMode;
}

/**
 * Get the current global exchange rates API value
 */
function getGlobalExchangeRatesApi(): GlobalExchangeRatesApi {
  return dineroRef?.globalExchangeRatesApi ?? Globals.globalExchangeRatesApi;
}

/**
 * Format parser class for toFormat method
 */
class Format {
  private formatString: string;

  constructor(format: string) {
    this.formatString = format;
  }

  getMinimumFractionDigits(): number {
    // Count decimal places in format string (e.g., '$0,0.00' has 2)
    const decimalMatch = this.formatString.match(/\.([0-9]+)/);
    return decimalMatch ? decimalMatch[1].length : 0;
  }

  getCurrencyDisplay(): 'symbol' | 'code' | 'name' {
    // Check if format starts with currency code (like 'USD0,0.00')
    if (/^[A-Z]{3}/.test(this.formatString)) {
      return 'code';
    }
    // Default to symbol for formats like '$0,0.00'
    return 'symbol';
  }

  getUseGrouping(): boolean {
    // Check if format includes comma for grouping (like '$0,0.00')
    return this.formatString.includes(',');
  }

  getStyle(): 'currency' | 'decimal' {
    // If format includes currency symbol or code, use currency style
    if (this.formatString.includes('$') || /^[A-Z]{3}/.test(this.formatString)) {
      return 'currency';
    }
    return 'decimal';
  }
}

/**
 * Flatten a nested object into a single-level object with dot notation keys
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

/**
 * Assert utility function
 */
function assert(condition: boolean, message: string, ErrorType: typeof Error = Error): void {
  if (!condition) {
    throw new ErrorType(message);
  }
}

/**
 * CurrencyConverter class for handling exchange rate operations
 */
function CurrencyConverter(options: {
  endpoint?: string | Promise<any>;
  propertyPath: string;
  headers?: Record<string, string>;
}) {
  const mergeTags = (string = '', tags: Record<string, string>) => {
    for (const tag in tags) {
      string = string.replace(new RegExp(`{{${tag}}}`, 'g'), tags[tag]);
    }
    return string;
  };

  const getRatesFromRestApi = (from: string, to: string) => {
    if (typeof options.endpoint !== 'string') {
      throw new Error('Endpoint must be a string for REST API calls');
    }
    return getJSON(mergeTags(options.endpoint, { from, to }), {
      headers: options.headers
    });
  };

  return {
    getExchangeRate(from: string, to: string) {
      let ratesPromise: Promise<any>;

      if (typeof options.endpoint === 'string') {
        ratesPromise = getRatesFromRestApi(from, to).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        });
      } else if (options.endpoint) {
        // It's a promise
        ratesPromise = options.endpoint;
      } else {
        // No endpoint provided
        return Promise.reject(new Error('No endpoint provided for currency conversion'));
      }

      return ratesPromise.then(data =>
        flattenObject(data)[mergeTags(options.propertyPath, { from, to })]
      );
    }
  };
}

/**
 * Dinero v1 compatible currency interface
 */
export interface DineroV1Currency {
  code: CurrencyCode;
  precision?: number;
}

/**
 * Dinero v1 compatible options for creating a dinero instance
 */
export interface DineroV1Options {
  amount?: number;
  currency?: DineroV1Currency | CurrencyCode;
  precision?: number;
  locale?: string;
}

export type RoundingMode = 'HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'HALF_ODD' | 'UP' | 'DOWN' | 'TOWARDS_ZERO' | 'AWAY_FROM_ZERO' | 'HALF_TOWARDS_ZERO' | 'HALF_AWAY_FROM_ZERO';

/**
 * Convert wrapper RoundingMode to core RoundingMode
 */
function toCoreRoundingMode(mode: RoundingMode): CoreRoundingMode {
  switch (mode) {
    case 'HALF_UP': return CoreRoundingMode.ROUND_HALF_UP;
    case 'HALF_DOWN': return CoreRoundingMode.ROUND_HALF_DOWN;
    case 'HALF_EVEN': return CoreRoundingMode.ROUND_HALF_EVEN;
    case 'HALF_ODD': return CoreRoundingMode.ROUND_HALF_ODD;
    case 'HALF_TOWARDS_ZERO': return CoreRoundingMode.ROUND_HALF_TOWARDS_ZERO;
    case 'HALF_AWAY_FROM_ZERO': return CoreRoundingMode.ROUND_HALF_AWAY_FROM_ZERO;
    case 'UP': return CoreRoundingMode.ROUND_UP;
    case 'DOWN': return CoreRoundingMode.ROUND_DOWN;
    case 'TOWARDS_ZERO': return CoreRoundingMode.ROUND_TOWARDS_ZERO;
    case 'AWAY_FROM_ZERO': return CoreRoundingMode.ROUND_AWAY_FROM_ZERO;
    default: return CoreRoundingMode.ROUND_HALF_AWAY_FROM_ZERO;
  }
}

/**
 * Dinero v1 compatible instance interface
 */
export interface DineroV1Instance {
  // Core properties
  getAmount(): number;
  getCurrency(): CurrencyCode;
  getPrecision(): number;
  getLocale(): string | undefined;
  setLocale(locale: string): DineroV1Instance;

  // Arithmetic operations (returning new instances)
  add(addend: DineroV1Instance): DineroV1Instance;
  subtract(subtrahend: DineroV1Instance): DineroV1Instance;
  multiply(multiplier: number, rounding?: RoundingMode): DineroV1Instance;
  divide(divisor: number, rounding?: RoundingMode): DineroV1Instance;
  percentage(percentage: number, rounding?: RoundingMode): DineroV1Instance;

  // Comparison operations
  equalsTo(comparate: DineroV1Instance): boolean;
  lessThan(comparate: DineroV1Instance): boolean;
  lessThanOrEqual(comparate: DineroV1Instance): boolean;
  greaterThan(comparate: DineroV1Instance): boolean;
  greaterThanOrEqual(comparate: DineroV1Instance): boolean;
  isZero(): boolean;
  isPositive(): boolean;
  isNegative(): boolean;

  // Allocation
  allocate(ratios: number[]): DineroV1Instance[];

  // Conversion
  toObject(): { amount: number; currency: CurrencyCode; precision: number };
  toJSON(): { amount: number; currency: CurrencyCode; precision: number };
  toString(): string;
  toFormat(format?: string, rounding?: RoundingMode): string;
  toNumber(): number;
  toUnit(): number;
  toRoundedUnit(digits: number, rounding?: RoundingMode): number;
  convertPrecision(precision: number, rounding?: RoundingMode): DineroV1Instance;
  convert(currency: string, options?: { endpoint: string | Promise<any>, propertyPath?: string, headers?: Record<string, string>, roundingMode?: RoundingMode }): Promise<DineroV1Instance>;

  // Utility
  hasCents(): boolean;
  hasSubUnits(): boolean;
  hasSameCurrency(comparate: DineroV1Instance): boolean;
  hasSameAmount(comparate: DineroV1Instance): boolean;
}

/**
 * Dinero v1 compatible wrapper class that provides instance methods
 */
class DineroV1Wrapper implements DineroV1Instance {
  private _genkin: Genkin;
  private _localeValue?: string;

  constructor(genkin: Genkin) {
    this._genkin = genkin;
    // Capture the current global locale when instance is created
    this._localeValue = getGlobalLocale();
  }

  // Core properties
  getAmount(): number {
    return this._genkin.minorUnits;
  }

  getCurrency(): CurrencyCode {
    return this._genkin.currencyCode;
  }

  getPrecision(): number {
    return this._genkin.precision;
  }

  getLocale(): string | undefined {
    return this._localeValue;
  }

  setLocale(locale: string): DineroV1Instance {
    const newWrapper = new DineroV1Wrapper(this._genkin);
    newWrapper._localeValue = locale;
    return newWrapper;
  }

  // Arithmetic operations
  add(addend: DineroV1Instance): DineroV1Instance {
    if (!(addend instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    const result = genkinAdd(this._genkin, addend._genkin);
    const wrapper = new DineroV1Wrapper(result);
    wrapper._localeValue = this._localeValue; // Preserve locale
    return wrapper;
  }

  subtract(subtrahend: DineroV1Instance): DineroV1Instance {
    if (!(subtrahend instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    const result = genkinSubtract(this._genkin, subtrahend._genkin);
    const wrapper = new DineroV1Wrapper(result);
    wrapper._localeValue = this._localeValue; // Preserve locale
    return wrapper;
  }

  multiply(multiplier: number, rounding?: RoundingMode): DineroV1Instance {
    // For multiplication, we may need to round the result if it's not a whole number
    const rawResult = this.getAmount() * multiplier;
    const roundedAmount = this.applyRounding(rawResult, rounding || 'HALF_AWAY_FROM_ZERO');
    
    // Create new Dinero instance with rounded amount
    const newInstance = Dinero({
      amount: roundedAmount,
      currency: this.getCurrency(),
      precision: this.getPrecision()
    });
    
    const wrapper = newInstance as DineroV1Wrapper;
    wrapper._localeValue = this._localeValue; // Preserve locale
    return wrapper;
  }

  divide(divisor: number, rounding?: RoundingMode): DineroV1Instance {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    
    // For division, we may need to round the result if it's not a whole number
    const rawResult = this.getAmount() / divisor;
    const roundedAmount = this.applyRounding(rawResult, rounding || 'HALF_AWAY_FROM_ZERO');
    
    // Create new Dinero instance with rounded amount
    const newInstance = Dinero({
      amount: roundedAmount,
      currency: this.getCurrency(),
      precision: this.getPrecision()
    });
    
    const wrapper = newInstance as DineroV1Wrapper;
    wrapper._localeValue = this._localeValue; // Preserve locale
    return wrapper;
  }

  percentage(percentage: number, rounding?: RoundingMode): DineroV1Instance {
    // Original Dinero.js validates percentage to be between 0-100
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      throw new RangeError('You must provide a numeric value between 0 and 100.');
    }
    
    // Calculate percentage and apply rounding if needed
    const rawResult = (this.getAmount() * percentage) / 100;
    const roundedAmount = this.applyRounding(rawResult, rounding || 'HALF_AWAY_FROM_ZERO');
    
    // Create new Dinero instance with rounded amount
    const newInstance = Dinero({
      amount: roundedAmount,
      currency: this.getCurrency(),
      precision: this.getPrecision()
    });
    
    const wrapper = newInstance as DineroV1Wrapper;
    wrapper._localeValue = this._localeValue; // Preserve locale
    return wrapper;
  }

  // Comparison operations
  equalsTo(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    return genkinEquals(this._genkin, comparate._genkin);
  }

  lessThan(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    return genkinLessThan(this._genkin, comparate._genkin);
  }

  greaterThan(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    return genkinGreaterThan(this._genkin, comparate._genkin);
  }

  lessThanOrEqual(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    return genkinLessThanOrEqual(this._genkin, comparate._genkin);
  }

  greaterThanOrEqual(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    return genkinGreaterThanOrEqual(this._genkin, comparate._genkin);
  }

  isZero(): boolean {
    return genkinIsZero(this._genkin);
  }

  isPositive(): boolean {
    return genkinIsPositive(this._genkin);
  }

  isNegative(): boolean {
    return genkinIsNegative(this._genkin);
  }

  // Allocation
  allocate(ratios: number[]): DineroV1Instance[] {
    // Original Dinero.js validates ratios
    if (!Array.isArray(ratios) || ratios.length === 0) {
      throw new TypeError('You must provide a non-empty array of numeric values greater than 0.');
    }

    // Check that all ratios are numbers and none are negative
    const hasNonNumber = ratios.some(ratio => typeof ratio !== 'number' || !Number.isFinite(ratio));
    if (hasNonNumber) {
      throw new TypeError('You must provide a non-empty array of numeric values greater than 0.');
    }

    // Check for negative ratios
    const hasNegative = ratios.some(ratio => ratio < 0);
    if (hasNegative) {
      throw new TypeError('You must provide a non-empty array of numeric values greater than 0.');
    }

    // Check that not all ratios are zero
    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
    if (totalRatio === 0) {
      throw new TypeError('You must provide a non-empty array of numeric values greater than 0.');
    }

    const results = genkinAllocate(this._genkin, ratios);
    return results.map(result => new DineroV1Wrapper(result));
  }

  // Conversion methods
  toObject(): { amount: number; currency: CurrencyCode; precision: number } {
    return {
      amount: this._genkin.minorUnits,
      currency: this._genkin.currencyCode,
      precision: this._genkin.precision,
    };
  }

  toJSON(): { amount: number; currency: CurrencyCode; precision: number } {
    return this.toObject();
  }

  /**
   * Returns this object formatted as a string.
   *
   * The format is a mask which defines how the output string will be formatted.
   * It defines whether to display a currency, in what format, how many fraction digits to display and whether to use grouping separators.
   * The output is formatted according to the applying locale.
   *
   * Object                       | Format            | String
   * :--------------------------- | :---------------- | :---
   * `Dinero({ amount: 500050 })` | `'$0,0.00'`       | $5,000.50
   * `Dinero({ amount: 500050 })` | `'$0,0'`          | $5,001
   * `Dinero({ amount: 500050 })` | `'$0'`            | $5001
   * `Dinero({ amount: 500050 })` | `'$0.0'`          | $5000.5
   * `Dinero({ amount: 500050 })` | `'USD0,0.0'`      | USD5,000.5
   * `Dinero({ amount: 500050 })` | `'0,0.0 dollar'`  | 5,000.5 dollars
   *
   * Don't try to substitute the `$` sign or the `USD` code with your target currency, nor adapt the format string to the exact format you want.
   * The format is a mask which defines a pattern and returns a valid, localized currency string.
   * If you want to display the object in a custom way, either use {@link module:Dinero~getAmount getAmount}, {@link module:Dinero~toUnit toUnit} or {@link module:Dinero~toRoundedUnit toRoundedUnit} and manipulate the output string as you wish.
   *
   * {@link module:Dinero~toFormat toFormat} wraps around `Number.prototype.toLocaleString`. For that reason, **format will vary depending on how it's implemented in the end user's environment**.
   *
   * You can also use `toLocaleString` directly:
   * `Dinero().toRoundedUnit(digits, roundingMode).toLocaleString(locale, options)`.
   *
   * By default, amounts are rounded using the **half away from zero** rule ([commercial rounding](https://en.wikipedia.org/wiki/Rounding#Round_half_away_from_zero)).
   * You can also specify a different `roundingMode` to better fit your needs.
   *
   * @param  {String} [format='$0,0.00'] - The format mask to format to.
   * @param  {String} [roundingMode='HALF_AWAY_FROM_ZERO'] - The rounding mode to use: `'HALF_ODD'`, `'HALF_EVEN'`, `'HALF_UP'`, `'HALF_DOWN'`, `'HALF_TOWARDS_ZERO'`, `'HALF_AWAY_FROM_ZERO'` or `'DOWN'`.
   *
   * @example
   * // returns $2,000
   * Dinero({ amount: 200000 }).toFormat('$0,0')
   * @example
   * // returns €50.5
   * Dinero({ amount: 5050, currency: 'EUR' }).toFormat('$0,0.0')
   * @example
   * // returns 100 euros
   * Dinero({ amount: 10000, currency: 'EUR' }).setLocale('fr-FR').toFormat('0,0 dollar')
   * @example
   * // returns 2000
   * Dinero({ amount: 200000, currency: 'EUR' }).toFormat()
   * @example
   * // returns $10
   * Dinero({ amount: 1050 }).toFormat('$0', 'HALF_EVEN')
   *
   * @return {String}
   */
  toFormat(format = getGlobalFormat(), roundingMode = getGlobalFormatRoundingMode()): string {
    const formatter = new Format(format);

    return this.toRoundedUnit(
      formatter.getMinimumFractionDigits(),
      roundingMode
    ).toLocaleString(this.getLocale(), {
      currencyDisplay: formatter.getCurrencyDisplay(),
      useGrouping: formatter.getUseGrouping(),
      minimumFractionDigits: formatter.getMinimumFractionDigits(),
      style: formatter.getStyle(),
      currency: this.getCurrency()
    });
  }

  toNumber(): number {
    return this._genkin.amount;
  }

  toUnit(): number {
    return this._genkin.minorUnits / Math.pow(10, this._genkin.precision);
  }

  toRoundedUnit(digits: number, rounding: RoundingMode = 'HALF_AWAY_FROM_ZERO'): number {
    const factor = Math.pow(10, digits);
    const unitValue = this.toUnit();
    
    // Apply rounding based on the specified mode
    let rounded: number;
    switch (rounding) {
      case 'HALF_UP':
        rounded = Math.round(unitValue * factor + Number.EPSILON) / factor;
        break;
      case 'HALF_DOWN':
        // HALF_DOWN: round towards negative infinity when tied (0.5 rounds down)
        const shiftedDown = unitValue * factor;
        if (Math.abs(shiftedDown - Math.round(shiftedDown)) === 0.5) {
          // It's exactly half-way, round down
          rounded = Math.floor(shiftedDown) / factor;
        } else {
          // Not half-way, use normal rounding
          rounded = Math.round(shiftedDown) / factor;
        }
        break;
      case 'HALF_EVEN':
        // Banker's rounding
        const shifted = unitValue * factor;
        const truncated = Math.trunc(shifted);
        const fractional = shifted - truncated;
        if (fractional === 0.5) {
          rounded = (truncated % 2 === 0 ? truncated : truncated + 1) / factor;
        } else {
          rounded = Math.round(shifted) / factor;
        }
        break;
      case 'HALF_ODD':
        // Round to odd number on tie
        const shiftedOdd = unitValue * factor;
        const truncatedOdd = Math.trunc(shiftedOdd);
        const fractionalOdd = shiftedOdd - truncatedOdd;
        if (fractionalOdd === 0.5) {
          rounded = (truncatedOdd % 2 === 1 ? truncatedOdd : truncatedOdd + 1) / factor;
        } else {
          rounded = Math.round(shiftedOdd) / factor;
        }
        break;
      case 'HALF_TOWARDS_ZERO':
        rounded = unitValue >= 0 
          ? Math.floor(unitValue * factor + 0.5) / factor
          : Math.ceil(unitValue * factor - 0.5) / factor;
        break;
      case 'UP':
        rounded = Math.ceil(unitValue * factor) / factor;
        break;
      case 'DOWN':
        rounded = Math.floor(unitValue * factor) / factor;
        break;
      case 'TOWARDS_ZERO':
        rounded = Math.trunc(unitValue * factor) / factor;
        break;
      case 'AWAY_FROM_ZERO':
      case 'HALF_AWAY_FROM_ZERO':
      default:
        // Round away from zero
        if (unitValue >= 0) {
          rounded = Math.ceil(unitValue * factor) / factor;
        } else {
          rounded = Math.floor(unitValue * factor) / factor;
        }
        break;
    }
    
    return rounded;
  }

  convertPrecision(precision: number, rounding: RoundingMode = 'HALF_EVEN'): DineroV1Instance {
    if (precision < 0 || !Number.isInteger(precision)) {
      throw new Error('Precision must be a non-negative integer');
    }

    // Handle unsupported rounding modes that should throw
    if (rounding === 'UP' || rounding === 'TOWARDS_ZERO' || rounding === 'AWAY_FROM_ZERO') {
      throw new TypeError(`roundingModes[${rounding}] is not a function`);
    }

    const coreRoundingMode = toCoreRoundingMode(rounding);
    const convertedGenkin = this._genkin.convertPrecision(precision, coreRoundingMode);

    const wrapper = new DineroV1Wrapper(convertedGenkin);
    wrapper._localeValue = this._localeValue; // Preserve locale
    return wrapper;
  }

  convert(currency: string, options: { endpoint?: string | Promise<any>, propertyPath?: string, headers?: Record<string, string>, roundingMode?: RoundingMode } = {}): Promise<DineroV1Instance> {
    const {
      endpoint = getGlobalExchangeRatesApi().endpoint,
      propertyPath = getGlobalExchangeRatesApi().propertyPath || 'rates.{{to}}',
      headers = getGlobalExchangeRatesApi().headers,
      roundingMode = getGlobalRoundingMode()
    } = options;

    const finalOptions = Object.assign(
      {},
      {
        endpoint,
        propertyPath,
        headers,
        roundingMode
      }
    );

    return CurrencyConverter(finalOptions)
      .getExchangeRate(this.getCurrency(), currency)
      .then(rate => {
        assert(
          rate !== undefined,
          `No rate was found for the destination currency "${currency}".`,
          TypeError
        );

        return Dinero({
          amount: Math.round(this.getAmount() * parseFloat(rate)),
          currency,
          precision: this.getPrecision()
        });
      });
  }

  // Utility methods
  hasCents(): boolean {
    return this._genkin.minorUnits % Math.pow(10, this._genkin.precision) !== 0;
  }

  hasSubUnits(): boolean {
    return this._genkin.minorUnits % Math.pow(10, this._genkin.precision) !== 0;
  }

  hasSameCurrency(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    return this._genkin.currencyCode === comparate._genkin.currencyCode;
  }

  hasSameAmount(comparate: DineroV1Instance): boolean {
    if (!(comparate instanceof DineroV1Wrapper)) {
      throw new Error('Invalid dinero instance');
    }
    
    // Original Dinero.js compares amounts regardless of currency!
    // Normalize precision and compare amounts
    const normalized = Static.normalizePrecision([this, comparate]);
    return normalized[0].getAmount() === normalized[1].getAmount();
  }

  // Helper method to apply rounding modes
  private applyRounding(value: number, rounding: RoundingMode): number {
    switch (rounding) {
      case 'HALF_UP':
        return Math.round(value + Number.EPSILON);
      case 'HALF_DOWN':
        // HALF_DOWN: when exactly halfway, round towards negative infinity
        const decimal = value - Math.floor(value);
        if (Math.abs(decimal - 0.5) < Number.EPSILON) {
          return Math.floor(value);
        } else {
          return Math.round(value);
        }
      case 'HALF_EVEN':
        // Banker's rounding
        const truncated = Math.trunc(value);
        const fractional = value - truncated;
        if (Math.abs(fractional) === 0.5) {
          return truncated % 2 === 0 ? truncated : truncated + Math.sign(value);
        } else {
          return Math.round(value);
        }
      case 'HALF_ODD':
        const truncatedOdd = Math.trunc(value);
        const fractionalOdd = value - truncatedOdd;
        if (Math.abs(fractionalOdd) === 0.5) {
          return truncatedOdd % 2 === 1 ? truncatedOdd : truncatedOdd + Math.sign(value);
        } else {
          return Math.round(value);
        }
      case 'HALF_TOWARDS_ZERO':
        if (value >= 0) {
          return Math.floor(value + 0.5);
        } else {
          return Math.ceil(value - 0.5);
        }
      case 'UP':
        return Math.ceil(value);
      case 'DOWN':
        return Math.floor(value);
      case 'TOWARDS_ZERO':
        return Math.trunc(value);
      case 'AWAY_FROM_ZERO':
        if (value >= 0) {
          return Math.ceil(value);
        } else {
          return Math.floor(value);
        }
      case 'HALF_AWAY_FROM_ZERO':
      default:
        // Default rounding mode
        if (value >= 0) {
          return Math.ceil(value - 0.5 + Number.EPSILON);
        } else {
          return Math.floor(value + 0.5 - Number.EPSILON);
        }
    }
  }

  // Expose internal Genkin for testing/debugging
  get _internal(): Genkin {
    return this._genkin;
  }

}

/**
 * Create a dinero instance (Dinero v1 compatible)
 */
export function Dinero(options: DineroV1Options = {}): DineroV1Instance {
  const { amount = 0, currency = 'USD', precision } = options;

  // Validate inputs
  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a finite number');
  }
  
  if (precision !== undefined && (!Number.isInteger(precision) || precision < 0)) {
    throw new Error('Precision must be a non-negative integer');
  }

  // For compatibility with original Dinero.js, we need to throw error if amount is a float
  if (typeof amount === 'number' && !Number.isInteger(amount)) {
    throw new Error('Amount must be an integer');
  }

  // Handle currency parameter
  let genkinCurrency: Currency;
  let currencyCode: CurrencyCode;

  if (typeof currency === 'string') {
    currencyCode = currency;
    try {
      genkinCurrency = createCurrency(getCurrencyConfig(currency));
    } catch {
      // If currency is not found, create a basic one
      genkinCurrency = createCurrency({
        code: currency,
        numeric: 999, // Use placeholder numeric code for unknown currencies
        precision: precision ?? 2,
        symbol: currency,
        name: currency,
      });
    }
  } else {
    currencyCode = currency.code;
    try {
      genkinCurrency = createCurrency(getCurrencyConfig(currency.code));
      // Override precision if specified in the currency object or function parameter
      if (precision !== undefined || currency.precision !== undefined) {
        genkinCurrency = createCurrency({
          ...getCurrencyConfig(currency.code),
          precision: precision ?? currency.precision ?? genkinCurrency.precision,
        });
      }
    } catch {
      // If currency is not found, create a basic one
      genkinCurrency = createCurrency({
        code: currency.code,
        numeric: 999, // Use placeholder numeric code for unknown currencies
        precision: precision ?? currency.precision ?? 2,
        symbol: currency.code,
        name: currency.code,
      });
    }
  }

  // Create Genkin instance - Dinero v1 typically uses minor units for amount
  const genkinInstance = new Genkin(amount, {
    currency: genkinCurrency,
    precision: precision ?? genkinCurrency.precision,
    isMinorUnits: true, // Dinero v1 amount is typically in minor units
  });

  return new DineroV1Wrapper(genkinInstance);
}

/**
 * Static utility functions for Dinero v1 compatibility
 */
export const Static = {
  /**
   * Normalize precision across multiple dinero instances
   */
  normalizePrecision(dineros: DineroV1Instance[]): DineroV1Instance[] {
    if (!Array.isArray(dineros) || dineros.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }

    // Find the highest precision
    const maxPrecision = Math.max(...dineros.map(d => d.getPrecision()));

    // Convert all instances to use the highest precision
    return dineros.map(dinero => {
      if (dinero.getPrecision() === maxPrecision) {
        return dinero;
      }
      
      // Create new instance with higher precision
      const currentAmount = dinero.getAmount();
      const currentPrecision = dinero.getPrecision();
      const scaleFactor = Math.pow(10, maxPrecision - currentPrecision);
      const newAmount = currentAmount * scaleFactor;

      return Dinero({
        amount: newAmount,
        currency: dinero.getCurrency(),
        precision: maxPrecision,
      });
    });
  },

  /**
   * Find minimum value among dinero instances
   */
  minimum(dineros: DineroV1Instance[]): DineroV1Instance {
    if (dineros.length === 0) {
      throw new Error('Cannot find minimum of empty array');
    }

    // Check that all currencies are the same
    const firstCurrency = dineros[0].getCurrency();
    for (let i = 1; i < dineros.length; i++) {
      if (dineros[i].getCurrency() !== firstCurrency) {
        throw new Error('All dinero instances must have the same currency');
      }
    }

    let min = dineros[0];
    for (let i = 1; i < dineros.length; i++) {
      if (dineros[i].lessThan(min)) {
        min = dineros[i];
      }
    }
    return min;
  },

  /**
   * Find maximum value among dinero instances
   */
  maximum(dineros: DineroV1Instance[]): DineroV1Instance {
    if (dineros.length === 0) {
      throw new Error('Cannot find maximum of empty array');
    }

    // Check that all currencies are the same
    const firstCurrency = dineros[0].getCurrency();
    for (let i = 1; i < dineros.length; i++) {
      if (dineros[i].getCurrency() !== firstCurrency) {
        throw new Error('All dinero instances must have the same currency');
      }
    }

    let max = dineros[0];
    for (let i = 1; i < dineros.length; i++) {
      if (dineros[i].greaterThan(max)) {
        max = dineros[i];
      }
    }
    return max;
  },
};

// Create the final Dinero object with all properties
const FinalDinero = Object.assign(Dinero, Defaults, Globals, Static);

// Set the reference for global access
dineroRef = FinalDinero;

// Export getJSON for testing purposes (can be mocked)
export { getJSON };

// Make getJSON available globally for testing (original Dinero.js behavior)
if (typeof globalThis !== 'undefined') {
  (globalThis as any).getJSON = getJSON;
}

// Export the main Dinero function as default for v1 compatibility
export default FinalDinero;
