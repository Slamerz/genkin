import type { Calculator } from './calculator.js';
import type { Currency, CurrencyCode, RoundingMode } from './currency.js';
import type { GenkinInstance, GenkinOptions, GenkinFactory, CreateGenkinOptions } from './types.js';
import { getCurrencyConfig, createCurrency, RoundingMode as RoundingModeEnum } from './currency.js';
import { ComparisonOperator } from './calculator.js';

/**
 * Generic Genkin implementation that works with any numeric type
 */
class GenericGenkin<T> implements GenkinInstance<T> {
  private readonly _amount: T; // stored in minor units
  private readonly _currency: Currency;
  private readonly _precision: number;
  private readonly _rounding: RoundingMode;
  private readonly _calculator: Calculator<T>;

  constructor(
    amount: T,
    calculator: Calculator<T>,
    options: GenkinOptions<T> = {}
  ) {
    this._calculator = calculator;

    // Default to USD if no currency provided
    const defaultUSDConfig = getCurrencyConfig('USD');
    const defaultUSD: Currency = {
      ...defaultUSDConfig,
      format: (amount: number) => `$${amount.toFixed(defaultUSDConfig.precision)}`,
      parse: (value: string) => parseFloat(value.replace(/[$,]/g, '')) || 0,
    };

    // Handle both string currency codes and currency objects
    let currency: Currency;
    if (typeof options.currency === 'string') {
      currency = createCurrency(getCurrencyConfig(options.currency));
    } else {
      currency = options.currency || defaultUSD;
    }

    this._currency = currency;
    // Ensure precision is always a number (handles BigInt, Big.js, etc.)
    const rawPrecision = options.precision ?? this._currency.precision;
    this._precision = typeof rawPrecision === 'number' ? rawPrecision : Number(rawPrecision);
    this._rounding = options.rounding ?? RoundingModeEnum.ROUND_HALF_EVEN;

    // Store as minor units or convert
    if (options.isMinorUnits) {
      this._amount = amount;
    } else {
      // Convert to minor units using calculator
      this._amount = this._toMinorUnits(amount, this._precision);
    }
  }

  /**
   * Convert amount to minor units using the calculator
   */
  private _toMinorUnits(amount: T, precision: number): T {
    const base = this._intFromNumber(10);
    const factor = this._calculator.power(base, this._intFromNumber(precision));
    return this._calculator.multiply(amount, factor);
  }

  /**
   * Convert minor units to major units using the calculator
   */
  private _fromMinorUnits(units: T, precision: number): T {
    const base = this._intFromNumber(10);
    const factor = this._calculator.power(base, this._intFromNumber(precision));
    return this._calculator.integerDivide(units, factor);
  }

  /**
   * Helper to convert a number to the calculator's type
   * This is used for constants like 10 (base) and precision values
   */
  private _intFromNumber(n: number): T {
    let result = this._calculator.zero();
    for (let i = 0; i < n; i++) {
      result = this._calculator.increment(result);
    }
    return result;
  }

  get amount(): T {
    return this._fromMinorUnits(this._amount, this._precision);
  }

  get minorUnits(): T {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  get currencyCode(): CurrencyCode {
    return this._currency.code;
  }

  get precision(): number {
    return this._precision;
  }

  get rounding(): RoundingMode {
    return this._rounding;
  }

  get currencyConfig() {
    return this._currency;
  }

  get calculator(): Calculator<T> {
    return this._calculator;
  }

  hasSameCurrency(other: GenkinInstance<T>): boolean {
    return this._currency.code === other.currency.code;
  }

  hasSamePrecision(other: GenkinInstance<T>): boolean {
    return this._precision === other.precision;
  }

  withAmount(amount: T): GenkinInstance<T> {
    return new GenericGenkin(amount, this._calculator, {
      currency: this._currency,
      precision: this._precision,
      rounding: this._rounding,
    });
  }

  withCurrency(currency: Currency): GenkinInstance<T> {
    return new GenericGenkin(this.amount, this._calculator, {
      currency,
      precision: this._precision,
      rounding: this._rounding,
    });
  }

  convertPrecision(newPrecision: number, rounding?: RoundingMode): GenkinInstance<T> {
    if (newPrecision < 0 || !Number.isInteger(newPrecision)) {
      throw new Error('[Genkin] Precision must be a non-negative integer');
    }

    const currentPrecision = this._precision;

    if (newPrecision === currentPrecision) {
      return this;
    }

    let newAmount: T;
    const base = this._intFromNumber(10);

    if (newPrecision > currentPrecision) {
      // Increasing precision - multiply by power of 10
      const scaleFactor = this._calculator.power(base, this._intFromNumber(newPrecision - currentPrecision));
      newAmount = this._calculator.multiply(this._amount, scaleFactor);
    } else {
      // Decreasing precision - divide by power of 10
      const scaleFactor = this._calculator.power(base, this._intFromNumber(currentPrecision - newPrecision));
      newAmount = this._calculator.integerDivide(this._amount, scaleFactor);
    }

    return new GenericGenkin(newAmount, this._calculator, {
      currency: this._currency,
      precision: newPrecision,
      rounding: rounding ?? this._rounding,
      isMinorUnits: true,
    });
  }

  toObject(): { amount: T; currency: CurrencyCode; precision: number } {
    return {
      amount: this.amount,
      currency: this._currency.code,
      precision: this._precision,
    };
  }

  toJSON(): { amount: T; currency: CurrencyCode; precision: number } {
    return this.toObject();
  }

  toString(): string {
    const config = this.currencyConfig;
    // Note: toString is tricky for generic types - we convert to string representation
    const amountStr = String(this.amount);

    if (config.symbol && config.symbol !== config.code) {
      return `${config.symbol}${amountStr}`;
    } else {
      return `${amountStr} ${this._currency.code}`;
    }
  }
}

/**
 * Create a Genkin factory for a specific numeric type
 * 
 * @param calculator - The calculator implementation for the numeric type
 * @returns A factory function that creates Genkin instances of that type
 * 
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator } from 'genkin';
 * 
 * const bigintGenkin = createGenkin(bigintCalculator);
 * const price = bigintGenkin(1099n, { currency: 'USD', precision: 2 });
 * ```
 */
export function createGenkin<T>(calculator: Calculator<T>): GenkinFactory<T>;
export function createGenkin<T>(options: CreateGenkinOptions<T>): GenkinFactory<T>;
export function createGenkin<T>(
  calculatorOrOptions: Calculator<T> | CreateGenkinOptions<T>
): GenkinFactory<T> {
  const calculator = 'calculator' in calculatorOrOptions 
    ? calculatorOrOptions.calculator 
    : calculatorOrOptions;
  const onCreate = 'onCreate' in calculatorOrOptions 
    ? calculatorOrOptions.onCreate 
    : undefined;

  return (amount: T, options?: GenkinOptions<T>): GenkinInstance<T> => {
    if (onCreate) {
      onCreate(options ?? {});
    }
    return new GenericGenkin(amount, calculator, options);
  };
}

// Export the GenericGenkin class for internal use
export { GenericGenkin };

