import { CurrencyCode, CurrencyConfig, Currency, RoundingMode, getCurrencyConfig, createCurrency } from './currency.js';
import { toMinorUnits, fromMinorUnits, applyRounding } from './precision.js';

/**
 * Options for creating a Genkin instance
 */
export interface GenkinOptions {
  /** Currency object or currency code string */
  currency?: Currency | CurrencyCode;
  /** Custom precision (overrides currency default) */
  precision?: number;
  /** Rounding mode for operations */
  rounding?: RoundingMode;
  /** If the amount is already in minor units */
  isMinorUnits?: boolean;
}

/**
 * Genkin - A precise monetary amount representation
 */
export class Genkin {
  private readonly _amount: number; // stored in minor units (e.g., cents)
  private readonly _currency: Currency;
  private readonly _precision: number;
  private readonly _rounding: RoundingMode;


  constructor(amount: number | string, options: GenkinOptions = {}) {
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
    this._precision = options.precision ?? this._currency.precision;
    this._rounding = options.rounding ?? RoundingMode.ROUND_HALF_EVEN;

    // Convert string to number if needed
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (!Number.isFinite(numAmount)) {
      throw new Error('Amount must be a finite number');
    }

    // Store as minor units to avoid floating-point issues
    this._amount = options.isMinorUnits ? numAmount : toMinorUnits(numAmount, this._precision);
  }

  /**
   * Get the amount in major units (e.g., dollars)
   */
  get amount(): number {
    return fromMinorUnits(this._amount, this._precision);
  }

  /**
   * Get the amount in minor units (e.g., cents)
   */
  get minorUnits(): number {
    return this._amount;
  }

  /**
   * Get the currency object
   */
  get currency(): Currency {
    return this._currency;
  }

  /**
   * Get the currency code
   */
  get currencyCode(): CurrencyCode {
    return this._currency.code;
  }

  /**
   * Get the precision (decimal places)
   */
  get precision(): number {
    return this._precision;
  }

  /**
   * Get the rounding mode
   */
  get rounding(): RoundingMode {
    return this._rounding;
  }

  /**
   * Get currency configuration
   */
  get currencyConfig(): CurrencyConfig {
    return this._currency;
  }

  /**
   * Check if this Genkin has the same currency as another
   */
  hasSameCurrency(other: Genkin): boolean {
    return this._currency.code === other._currency.code;
  }

  /**
   * Check if this Genkin has the same precision as another
   */
  hasSamePrecision(other: Genkin): boolean {
    return this._precision === other._precision;
  }

  /**
   * Create a new Genkin with the same currency and precision
   */
  withAmount(amount: number): Genkin {
    return new Genkin(amount, {
      currency: this._currency,
      precision: this._precision,
      rounding: this._rounding,
    });
  }

  /**
   * Create a new Genkin with a different currency
   */
  withCurrency(currency: Currency): Genkin {
    return new Genkin(this.amount, {
      currency,
      precision: this._precision,
      rounding: this._rounding,
    });
  }

  /**
   * Convert to a plain object
   */
  toObject(): { amount: number; currency: CurrencyCode; precision: number } {
    return {
      amount: this.amount,
      currency: this._currency.code,
      precision: this._precision,
    };
  }

  /**
   * Convert to JSON (same as toObject)
   */
  toJSON(): { amount: number; currency: CurrencyCode; precision: number } {
    return this.toObject();
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    const config = this.currencyConfig;
    const formatted = this.amount.toFixed(this._precision);
    
    // If currency has a symbol and it's a known currency, put symbol first
    // Otherwise put currency code after the amount
    if (config.symbol && config.symbol !== config.code) {
      return `${config.symbol}${formatted}`;
    } else {
      return `${formatted} ${this._currency.code}`;
    }
  }

  /**
   * Convert to number (major units)
   */
  valueOf(): number {
    return this.amount;
  }
}

/**
 * Factory function to create a Genkin instance
 */
export function genkin(amount: number | string, options?: GenkinOptions): Genkin {
  return new Genkin(amount, options);
} 