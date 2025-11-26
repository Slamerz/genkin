// Dinero.js v1 compatibility layer
// This module provides a Dinero.js v1-compatible API that internally uses Genkin

import { Genkin, genkin } from '../core/genkin.js';
import { CurrencyCode, Currency, getCurrencyConfig, createCurrency } from '../core/currency.js';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate, percentage as genkinPercentage } from '../operations/arithmetic.js';
import { equals as genkinEquals, lessThan as genkinLessThan, lessThanOrEqual as genkinLessThanOrEqual, greaterThan as genkinGreaterThan, greaterThanOrEqual as genkinGreaterThanOrEqual, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative } from '../operations/comparison.js';
import type { AllocationRatio } from '../operations/arithmetic.js';

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

  // Utility
  hasSubUnits(): boolean;
  hasSameCurrency(comparate: DineroV1Instance): boolean;
  hasSameAmount(comparate: DineroV1Instance): boolean;
}

/**
 * Dinero v1 compatible wrapper class that provides instance methods
 */
class DineroV1Wrapper implements DineroV1Instance {
  private _genkin: Genkin;
  private _localeValue: string = 'en-US';

  constructor(genkin: Genkin) {
    this._genkin = genkin;
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
    
    // Check that all ratios are positive numbers
    for (const ratio of ratios) {
      if (typeof ratio !== 'number' || ratio <= 0) {
        throw new TypeError('You must provide a non-empty array of numeric values greater than 0.');
      }
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

  toString(): string {
    return this._genkin.toString();
  }

  toFormat(format?: string, rounding?: RoundingMode): string {
    // Basic formatting - in a full implementation, you'd support more format strings
    if (format) {
      // Simple placeholder implementation - could be enhanced
      return this._genkin.toString();
    }
    return this._genkin.toString();
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
    
    const currentPrecision = this._genkin.precision;
    const currentAmount = this._genkin.minorUnits;
    
    let newAmount: number;
    
    if (precision === currentPrecision) {
      // No conversion needed
      newAmount = currentAmount;
    } else if (precision > currentPrecision) {
      // Increasing precision - multiply by power of 10
      const scaleFactor = Math.pow(10, precision - currentPrecision);
      newAmount = currentAmount * scaleFactor;
    } else {
      // Decreasing precision - divide and potentially round
      const scaleFactor = Math.pow(10, currentPrecision - precision);
      const unrounded = currentAmount / scaleFactor;
      
      // Apply rounding
      switch (rounding) {
        case 'HALF_UP':
          newAmount = Math.round(unrounded + Number.EPSILON);
          break;
        case 'HALF_DOWN':
          // HALF_DOWN: when exactly halfway, round towards negative infinity
          const decimal = unrounded - Math.floor(unrounded);
          if (Math.abs(decimal - 0.5) < Number.EPSILON) {
            newAmount = Math.floor(unrounded);
          } else {
            newAmount = Math.round(unrounded);
          }
          break;
        case 'HALF_EVEN':
          const truncated = Math.trunc(unrounded);
          const fractional = unrounded - truncated;
          if (Math.abs(fractional) === 0.5) {
            newAmount = truncated % 2 === 0 ? truncated : truncated + 1;
          } else {
            newAmount = Math.round(unrounded);
          }
          break;
        case 'HALF_ODD':
          const truncatedOdd = Math.trunc(unrounded);
          const fractionalOdd = unrounded - truncatedOdd;
          if (Math.abs(fractionalOdd) === 0.5) {
            const isOdd = Math.abs(truncatedOdd) % 2 === 1;
            if (isOdd) {
              newAmount = truncatedOdd;
            } else {
              newAmount = unrounded >= 0 ? truncatedOdd + 1 : truncatedOdd - 1;
            }
          } else {
            newAmount = Math.round(unrounded);
          }
          break;
        case 'HALF_TOWARDS_ZERO':
          const truncatedTowardsZero = Math.trunc(unrounded);
          const fractionalTowardsZero = Math.abs(unrounded - truncatedTowardsZero);
          if (fractionalTowardsZero === 0.5) {
            newAmount = unrounded >= 0 ? Math.floor(unrounded) : Math.ceil(unrounded);
          } else {
            newAmount = Math.round(unrounded);
          }
          break;
        case 'UP':
          // Original library throws for UP mode in convertPrecision
          throw new TypeError(`roundingModes[${rounding}] is not a function`);
        case 'DOWN':
          newAmount = Math.floor(unrounded);
          break;
        case 'TOWARDS_ZERO':
          // Original library throws for TOWARDS_ZERO mode in convertPrecision
          throw new TypeError(`roundingModes[${rounding}] is not a function`);
        case 'AWAY_FROM_ZERO':
          // Original library throws for AWAY_FROM_ZERO mode in convertPrecision
          throw new TypeError(`roundingModes[${rounding}] is not a function`);
        case 'HALF_AWAY_FROM_ZERO':
        default:
          // Default rounding mode - HALF_AWAY_FROM_ZERO
          newAmount = unrounded >= 0 ? Math.round(unrounded) : Math.floor(unrounded);
          break;
      }
    }
    
    return Dinero({
      amount: newAmount,
      currency: this._genkin.currencyCode,
      precision: precision,
    });
  }

  // Utility methods
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
    const normalized = DineroStatic.normalizePrecision([this, comparate]);
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
export const DineroStatic = {
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

// Export the main Dinero function as default for v1 compatibility
export default Dinero;
