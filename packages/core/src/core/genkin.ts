import { CurrencyCode, CurrencyConfig, Currency, RoundingMode, getCurrencyConfig, createCurrency } from './currency.js';
import { toMinorUnits, fromMinorUnits, applyRounding } from './precision.js';

/**
 * Configuration options for creating a Genkin monetary amount instance.
 *
 * Provides comprehensive control over how monetary values are handled, including
 * currency specification, decimal precision, rounding behavior, and input format.
 *
 * @interface GenkinOptions
 *
 * @example
 * ```typescript
 * // Basic usage with currency code
 * const options: GenkinOptions = {
 *   currency: 'USD',
 *   precision: 2
 * };
 *
 * @example
 * ```typescript
 * // Advanced usage with custom currency object
 * const options: GenkinOptions = {
 *   currency: {
 *     code: 'BTC',
 *     name: 'Bitcoin',
 *     symbol: '₿',
 *     precision: 8,
 *     base: 10
 *   },
 *   rounding: RoundingMode.ROUND_DOWN,
 *   isMinorUnits: false
 * };
 * ```
 */
export interface GenkinOptions {
  /**
   * The currency for this monetary amount.
   *
   * Can be either a currency code string (e.g., 'USD', 'EUR', 'JPY') or a complete
   * Currency object with custom formatting and parsing rules. If not provided,
   * defaults to USD.
   *
   * @type {Currency | CurrencyCode}
   * @default 'USD'
   *
   * @example
   * ```typescript
   * // Using currency code
   * { currency: 'EUR' }
   *
   * // Using currency object
   * { currency: { code: 'XBT', name: 'Bitcoin', symbol: '₿', precision: 8 } }
   * ```
   */
  currency?: Currency | CurrencyCode;

  /**
   * Decimal precision for this monetary amount.
   *
   * Specifies the number of decimal places to maintain for calculations. This
   * overrides the currency's default precision. Must be a non-negative integer.
   * Higher precision reduces rounding errors but increases computational overhead.
   *
   * @type {number}
   * @default Currency's default precision
   *
   * @example
   * ```typescript
   * // Standard currency precision
   * { precision: 2 } // For USD, EUR (cents)
   *
   * // High precision for cryptocurrencies
   * { precision: 8 } // For BTC (satoshis)
   *
   * // Zero precision for whole units only
   * { precision: 0 } // For JPY (no sub-units)
   * ```
   */
  precision?: number;

  /**
   * Rounding strategy for arithmetic operations and precision conversions.
   *
   * Determines how fractional amounts are rounded when they cannot be precisely
   * represented. Different rounding modes are appropriate for different financial
   * contexts (e.g., ROUND_HALF_EVEN for general accounting, ROUND_DOWN for discounts).
   *
   * @type {RoundingMode}
   * @default RoundingMode.ROUND_HALF_EVEN
   *
   * @example
   * ```typescript
   * { rounding: RoundingMode.ROUND_HALF_UP }     // Standard rounding
   * { rounding: RoundingMode.ROUND_DOWN }        // Always round down (floor)
   * { rounding: RoundingMode.ROUND_HALF_EVEN }  // Banker's rounding (default)
   * ```
   */
  rounding?: RoundingMode;

  /**
   * Whether the input amount is already in minor currency units.
   *
   * When true, the amount parameter is treated as already being in the currency's
   * minor units (e.g., cents for USD, satoshis for BTC). When false, the amount
   * is converted from major units to minor units during construction.
   *
   * @type {boolean}
   * @default false
   *
   * @example
   * ```typescript
   * // Major units (dollars)
   * new Genkin(10.50, { currency: 'USD' }) // $10.50
   *
   * // Minor units (cents) - requires isMinorUnits: true
   * new Genkin(1050, { currency: 'USD', isMinorUnits: true }) // $10.50
   *
   * // Cryptocurrency in minor units (satoshis)
   * new Genkin(50000000, { currency: 'BTC', isMinorUnits: true }) // 0.5 BTC
   * ```
   */
  isMinorUnits?: boolean;
}

/**
 * Genkin - A precise monetary amount representation with built-in currency support.
 *
 * Provides immutable, type-safe monetary arithmetic with automatic precision handling
 * and currency-aware operations. All amounts are stored internally in minor currency
 * units (e.g., cents, satoshis) to avoid floating-point precision issues.
 *
 * Key features:
 * - Immutable operations (all methods return new instances)
 * - Currency-aware calculations and conversions
 * - Configurable precision and rounding modes
 * - Type-safe currency operations
 * - Automatic minor/major unit conversions
 *
 * @class Genkin
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Basic usage
 * const price = new Genkin(29.99, { currency: 'USD' });
 * console.log(price.toString()); // "$29.99"
 *
 * @example
 * ```typescript
 * // With custom precision
 * const crypto = new Genkin(0.5, { currency: 'BTC', precision: 8 });
 * console.log(crypto.amount); // 0.5
 * console.log(crypto.minorUnits); // 50000000 (satoshis)
 *
 * @example
 * ```typescript
 * // Working with minor units directly
 * const cents = new Genkin(199, { currency: 'USD', isMinorUnits: true });
 * console.log(cents.amount); // 1.99
 * ```
 */
export class Genkin {
  /** Internal amount stored in minor currency units to avoid floating-point issues */
  private readonly _amount: number;
  /** Currency configuration for this monetary amount */
  private readonly _currency: Currency;
  /** Decimal precision for calculations and display */
  private readonly _precision: number;
  /** Rounding mode for arithmetic operations */
  private readonly _rounding: RoundingMode;

  /**
   * Creates a new Genkin monetary amount instance.
   *
   * @param {number | string} amount - The monetary amount to represent. Can be a number or numeric string.
   * @param {GenkinOptions} [options={}] - Configuration options for the monetary amount.
   *
   * @throws {Error} When amount is not a finite number (NaN, Infinity, or non-numeric string).
   * @throws {Error} When precision in options is not a non-negative integer (handled by convertPrecision).
   *
   * @example
   * ```typescript
   * // Simple dollar amount
   * const dollars = new Genkin(10.50);
   * // Defaults to USD currency
   *
   * @example
   * ```typescript
   * // Euro amount with explicit currency
   * const euros = new Genkin(25.99, { currency: 'EUR' });
   *
   * @example
   * ```typescript
   * // High-precision cryptocurrency
   * const bitcoin = new Genkin(0.12345678, {
   *   currency: 'BTC',
   *   precision: 8
   * });
   *
   * @example
   * ```typescript
   * // Amount already in minor units
   * const cents = new Genkin(1050, {
   *   currency: 'USD',
   *   isMinorUnits: true  // 1050 cents = $10.50
   * });
   *
   * @example
   * ```typescript
   * // Custom currency with specific rounding
   * const customAmount = new Genkin(10.123456, {
   *   currency: {
   *     code: 'XAU',
   *     name: 'Gold Troy Ounce',
   *     symbol: 'oz',
   *     precision: 4
   *   },
   *   rounding: RoundingMode.ROUND_DOWN
   * });
   * ```
   */
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
      throw new Error('[Genkin] Amount must be a finite number');
    }

    // Store as minor units to avoid floating-point issues
    this._amount = options.isMinorUnits ? numAmount : toMinorUnits(numAmount, this._precision);
  }

  /**
   * Gets the monetary amount in major currency units (e.g., dollars, euros, whole coins).
   *
   * This is the human-readable representation of the amount, converted from the internal
   * minor unit storage. For example, if stored as 1050 cents internally, this returns 10.50.
   *
   * @type {number}
   * @readonly
   *
   * @example
   * ```typescript
   * const price = new Genkin(29.99, { currency: 'USD' });
   * console.log(price.amount); // 29.99
   *
   * @example
   * ```typescript
   * // With cents as minor units
   * const cents = new Genkin(199, { currency: 'USD', isMinorUnits: true });
   * console.log(cents.amount); // 1.99
   *
   * @example
   * ```typescript
   * // High precision cryptocurrency
   * const btc = new Genkin(50000000, { currency: 'BTC', isMinorUnits: true });
   * console.log(btc.amount); // 0.5
   * ```
   */
  get amount(): number {
    return fromMinorUnits(this._amount, this._precision);
  }

  /**
   * Gets the monetary amount in minor currency units (e.g., cents, satoshis, pence).
   *
   * Returns the raw internal representation used for precise calculations. This is the
   * amount as stored internally to avoid floating-point precision issues.
   *
   * @type {number}
   * @readonly
   *
   * @example
   * ```typescript
   * const price = new Genkin(10.50, { currency: 'USD' });
   * console.log(price.minorUnits); // 1050 (cents)
   *
   * @example
   * ```typescript
   * // Already in minor units
   * const cents = new Genkin(199, { currency: 'USD', isMinorUnits: true });
   * console.log(cents.minorUnits); // 199
   *
   * @example
   * ```typescript
   * // Cryptocurrency satoshis
   * const btc = new Genkin(0.5, { currency: 'BTC', precision: 8 });
   * console.log(btc.minorUnits); // 50000000 (satoshis)
   * ```
   */
  get minorUnits(): number {
    return this._amount;
  }

  /**
   * Gets the complete currency configuration object.
   *
   * Returns the full Currency object containing code, name, symbol, precision,
   * and formatting/parsing functions used by this Genkin instance.
   *
   * @type {Currency}
   * @readonly
   *
   * @example
   * ```typescript
   * const amount = new Genkin(100, { currency: 'EUR' });
   * console.log(amount.currency.code);    // "EUR"
   * console.log(amount.currency.name);    // "Euro"
   * console.log(amount.currency.symbol);  // "€"
   * console.log(amount.currency.precision); // 2
   *
   * @example
   * ```typescript
   * // Custom currency object
   * const customAmount = new Genkin(1, {
   *   currency: {
   *     code: 'XBT',
   *     name: 'Bitcoin',
   *     symbol: '₿',
   *     precision: 8,
   *     base: 10
   *   }
   * });
   * console.log(customAmount.currency.symbol); // "₿"
   * ```
   */
  get currency(): Currency {
    return this._currency;
  }

  /**
   * Gets the ISO currency code (e.g., 'USD', 'EUR', 'JPY').
   *
   * Returns the standardized three-letter currency code used to identify the currency.
   * This is a convenience getter that extracts the code from the full currency object.
   *
   * @type {CurrencyCode}
   * @readonly
   *
   * @example
   * ```typescript
   * const usd = new Genkin(100, { currency: 'USD' });
   * console.log(usd.currencyCode); // "USD"
   *
   * @example
   * ```typescript
   * const eur = new Genkin(50, { currency: 'EUR' });
   * console.log(eur.currencyCode); // "EUR"
   *
   * @example
   * ```typescript
   * // Custom currency code
   * const btc = new Genkin(0.001, { currency: 'BTC' });
   * console.log(btc.currencyCode); // "BTC"
   * ```
   */
  get currencyCode(): CurrencyCode {
    return this._currency.code;
  }

  /**
   * Gets the decimal precision used for calculations and display.
   *
   * Returns the number of decimal places maintained for this monetary amount.
   * This affects how amounts are stored internally and formatted for display.
   *
   * @type {number}
   * @readonly
   *
   * @example
   * ```typescript
   * const dollars = new Genkin(10.50, { currency: 'USD' });
   * console.log(dollars.precision); // 2 (cents)
   *
   * @example
   * ```typescript
   * const yen = new Genkin(1000, { currency: 'JPY' });
   * console.log(yen.precision); // 0 (no sub-units)
   *
   * @example
   * ```typescript
   * // High precision cryptocurrency
   * const btc = new Genkin(0.12345678, { currency: 'BTC', precision: 8 });
   * console.log(btc.precision); // 8
   * ```
   */
  get precision(): number {
    return this._precision;
  }

  /**
   * Gets the rounding mode used for arithmetic operations and precision conversions.
   *
   * Returns the RoundingMode enum value that determines how fractional amounts
   * are rounded when they cannot be precisely represented.
   *
   * @type {RoundingMode}
   * @readonly
   *
   * @example
   * ```typescript
   * const amount = new Genkin(10.123, {
   *   currency: 'USD',
   *   rounding: RoundingMode.ROUND_HALF_UP
   * });
   * console.log(amount.rounding); // RoundingMode.ROUND_HALF_UP
   *
   * @example
   * ```typescript
   * // Default rounding (banker's rounding)
   * const defaultAmount = new Genkin(10.123);
   * console.log(defaultAmount.rounding); // RoundingMode.ROUND_HALF_EVEN
   * ```
   */
  get rounding(): RoundingMode {
    return this._rounding;
  }

  /**
   * Gets the currency configuration object (alias for currency getter).
   *
   * Returns the same Currency object as the `currency` getter, but typed as
   * CurrencyConfig. This provides compatibility with interfaces that expect
   * the configuration type specifically.
   *
   * @type {CurrencyConfig}
   * @readonly
   *
   * @example
   * ```typescript
   * const amount = new Genkin(100, { currency: 'USD' });
   * const config = amount.currencyConfig;
   * console.log(config.code);    // "USD"
   * console.log(config.precision); // 2
   *
   * @example
   * ```typescript
   * // Use with functions expecting CurrencyConfig
   * function formatWithConfig(amount: Genkin, config: CurrencyConfig) {
   *   return config.format(amount.amount);
   * }
   *
   * const amount = new Genkin(25.50, { currency: 'EUR' });
   * console.log(formatWithConfig(amount, amount.currencyConfig)); // "€25.50"
   * ```
   */
  get currencyConfig(): CurrencyConfig {
    return this._currency;
  }

  /**
   * Checks if this Genkin instance has the same currency as another Genkin instance.
   *
   * Compares currency codes to determine if two monetary amounts are denominated
   * in the same currency. This is useful for validating operations that require
   * currency compatibility, such as addition or subtraction.
   *
   * @param {Genkin} other - The other Genkin instance to compare currencies with.
   * @returns {boolean} True if both instances have the same currency code, false otherwise.
   *
   * @example
   * ```typescript
   * const usd1 = new Genkin(10, { currency: 'USD' });
   * const usd2 = new Genkin(20, { currency: 'USD' });
   * const eur = new Genkin(15, { currency: 'EUR' });
   *
   * console.log(usd1.hasSameCurrency(usd2)); // true
   * console.log(usd1.hasSameCurrency(eur));  // false
   * ```
   *
   * @example
   * ```typescript
   * // Useful for currency validation before operations
   * function addAmounts(a: Genkin, b: Genkin): Genkin {
   *   if (!a.hasSameCurrency(b)) {
   *     throw new Error('Cannot add amounts with different currencies');
   *   }
   *   // ... addition logic
   * }
   * ```
   */
  hasSameCurrency(other: Genkin): boolean {
    return this._currency.code === other._currency.code;
  }

  /**
   * Checks if this Genkin instance has the same precision as another Genkin instance.
   *
   * Compares decimal precision values to determine if two monetary amounts use
   * the same level of precision for calculations. This is useful for ensuring
   * consistent arithmetic behavior when combining amounts.
   *
   * @param {Genkin} other - The other Genkin instance to compare precision with.
   * @returns {boolean} True if both instances have the same precision, false otherwise.
   *
   * @example
   * ```typescript
   * const lowPrecision = new Genkin(10.123, { precision: 2 });
   * const highPrecision = new Genkin(10.123, { precision: 4 });
   * const samePrecision = new Genkin(20.456, { precision: 2 });
   *
   * console.log(lowPrecision.hasSamePrecision(samePrecision)); // true
   * console.log(lowPrecision.hasSamePrecision(highPrecision)); // false
   * ```
   *
   * @example
   * ```typescript
   * // Precision validation for financial calculations
   * function calculateTotal(items: Genkin[]): Genkin {
   *   const firstItem = items[0];
   *   const mismatched = items.find(item => !item.hasSamePrecision(firstItem));
   *
   *   if (mismatched) {
   *     throw new Error('All items must have the same precision for calculation');
   *   }
   *   // ... calculation logic
   * }
   * ```
   */
  hasSamePrecision(other: Genkin): boolean {
    return this._precision === other._precision;
  }

  /**
   * Creates a new Genkin instance with the same currency, precision, and rounding settings.
   *
   * This immutable operation returns a new Genkin instance with the specified amount
   * while preserving all other properties (currency, precision, rounding mode).
   * Useful for creating variations of the same monetary value or for chaining operations.
   *
   * @param {number} amount - The new monetary amount in major units (e.g., dollars).
   * @returns {Genkin} A new Genkin instance with the specified amount and current settings.
   *
   * @example
   * ```typescript
   * const original = new Genkin(10.50, { currency: 'USD', precision: 2 });
   * const doubled = original.withAmount(21.00);
   *
   * console.log(original.amount);  // 10.5
   * console.log(doubled.amount);   // 21
   * console.log(doubled.currencyCode); // "USD"
   * console.log(doubled.precision);    // 2
   * ```
   *
   * @example
   * ```typescript
   * // Method chaining with amount modifications
   * const basePrice = new Genkin(100, { currency: 'EUR' });
   * const discounted = basePrice.withAmount(basePrice.amount * 0.8);
   * const withTax = discounted.withAmount(discounted.amount * 1.2);
   *
   * console.log(withTax.amount); // 192 (100 * 0.8 * 1.2)
   * ```
   */
  withAmount(amount: number): Genkin {
    return new Genkin(amount, {
      currency: this._currency,
      precision: this._precision,
      rounding: this._rounding,
    });
  }

  /**
   * Creates a new Genkin instance with a different currency while preserving the amount.
   *
   * This immutable operation converts the monetary amount to a new currency, maintaining
   * the same numerical value but changing the currency denomination. The precision and
   * rounding settings are preserved from the original instance.
   *
   * Note: This does not perform currency conversion (exchange rates) - it simply
   * reassigns the currency while keeping the same numerical amount.
   *
   * @param {Currency} currency - The new currency configuration to apply.
   * @returns {Genkin} A new Genkin instance with the same amount but different currency.
   *
   * @example
   * ```typescript
   * const usdAmount = new Genkin(100, { currency: 'USD' });
   * const eurAmount = usdAmount.withCurrency(getCurrencyConfig('EUR'));
   *
   * console.log(usdAmount.currencyCode); // "USD"
   * console.log(usdAmount.amount);       // 100
   * console.log(eurAmount.currencyCode); // "EUR"
   * console.log(eurAmount.amount);       // 100 (same numerical value)
   * ```
   *
   * @example
   * ```typescript
   * // Converting to custom currency
   * const dollarAmount = new Genkin(50, { currency: 'USD' });
   * const cryptoAmount = dollarAmount.withCurrency({
   *   code: 'BTC',
   *   name: 'Bitcoin',
   *   symbol: '₿',
   *   precision: 8,
   *   base: 10
   * });
   *
   * console.log(cryptoAmount.currencyCode); // "BTC"
   * console.log(cryptoAmount.amount);       // 50 (still 50, but now in BTC context)
   * ```
   *
   * @example
   * ```typescript
   * // Note: This does NOT convert exchange rates
   * const priceUSD = new Genkin(100, { currency: 'USD' });
   * const priceEUR = priceUSD.withCurrency(getCurrencyConfig('EUR'));
   * // priceEUR is still numerically 100, not the EUR equivalent of $100
   * ```
   */
  withCurrency(currency: Currency): Genkin {
    return new Genkin(this.amount, {
      currency,
      precision: this._precision,
      rounding: this._rounding,
    });
  }

  /**
   * Converts the Genkin instance to a plain JavaScript object.
   *
   * Returns a serializable object representation containing the essential
   * monetary properties. Useful for JSON serialization, data transfer,
   * or interfacing with systems that don't use Genkin instances.
   *
   * @returns {{ amount: number; currency: CurrencyCode; precision: number }}
   * A plain object with the monetary amount, currency code, and precision.
   *
   * @example
   * ```typescript
   * const price = new Genkin(29.99, { currency: 'USD', precision: 2 });
   * const obj = price.toObject();
   *
   * console.log(obj); // { amount: 29.99, currency: "USD", precision: 2 }
   * ```
   *
   * @example
   * ```typescript
   * // Useful for API responses or data persistence
   * const prices = [
   *   new Genkin(10.99, { currency: 'USD' }),
   *   new Genkin(8.50, { currency: 'EUR' })
   * ];
   *
   * const serialized = prices.map(price => price.toObject());
   * // [{ amount: 10.99, currency: "USD", precision: 2 }, ...]
   * ```
   *
   * @example
   * ```typescript
   * // Can be used to recreate Genkin instances
   * const obj = { amount: 15.75, currency: 'GBP', precision: 2 };
   * const restored = new Genkin(obj.amount, {
   *   currency: obj.currency,
   *   precision: obj.precision
   * });
   * ```
   */
  toObject(): { amount: number; currency: CurrencyCode; precision: number } {
    return {
      amount: this.amount,
      currency: this._currency.code,
      precision: this._precision,
    };
  }

  /**
   * Converts the Genkin instance to a JSON-serializable object.
   *
   * This method is automatically called by `JSON.stringify()` and returns
   * the same object as `toObject()`. Ensures proper serialization of
   * Genkin instances when converting to JSON.
   *
   * @returns {{ amount: number; currency: CurrencyCode; precision: number }}
   * A plain object suitable for JSON serialization.
   *
   * @example
   * ```typescript
   * const price = new Genkin(19.99, { currency: 'USD' });
   *
   * // Automatic JSON serialization
   * const jsonString = JSON.stringify(price);
   * console.log(jsonString); // '{"amount":19.99,"currency":"USD","precision":2}'
   *
   * // Manual method call
   * const jsonObj = price.toJSON();
   * console.log(jsonObj); // { amount: 19.99, currency: "USD", precision: 2 }
   * ```
   *
   * @example
   * ```typescript
   * // Round-trip serialization
   * const original = new Genkin(25.50, { currency: 'EUR', precision: 2 });
   * const serialized = JSON.stringify(original);
   * const parsed = JSON.parse(serialized);
   *
   * // Recreate from parsed data
   * const restored = new Genkin(parsed.amount, {
   *   currency: parsed.currency,
   *   precision: parsed.precision
   * });
   * ```
   */
  toJSON(): { amount: number; currency: CurrencyCode; precision: number } {
    return this.toObject();
  }

  /**
   * Converts the Genkin instance to a human-readable string representation.
   *
   * Formats the monetary amount with appropriate currency symbols or codes,
   * respecting the currency's formatting conventions. Uses the currency symbol
   * (if available and different from the code) or falls back to the currency code.
   *
   * @returns {string} A formatted string representation of the monetary amount.
   *
   * @example
   * ```typescript
   * const usd = new Genkin(29.99, { currency: 'USD' });
   * console.log(usd.toString()); // "$29.99"
   *
   * @example
   * ```typescript
   * const eur = new Genkin(19.50, { currency: 'EUR' });
   * console.log(eur.toString()); // "€19.50"
   *
   * @example
   * ```typescript
   * const jpy = new Genkin(1000, { currency: 'JPY' });
   * console.log(jpy.toString()); // "1000 JPY" (no symbol, uses code)
   *
   * @example
   * ```typescript
   * // High precision formatting
   * const btc = new Genkin(0.12345678, { currency: 'BTC', precision: 8 });
   * console.log(btc.toString()); // "₿0.12345678"
   * ```
   *
   * @example
   * ```typescript
   * // Automatic string conversion
   * const price = new Genkin(15.75, { currency: 'GBP' });
   * console.log(`Price: ${price}`); // "Price: £15.75"
   * console.log(price + '');          // "£15.75"
   * ```
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
   * Converts the Genkin instance to a primitive number value.
   *
   * Returns the monetary amount in major units as a number. This method is
   * automatically called when the Genkin instance is used in numeric contexts,
   * such as mathematical operations or comparisons.
   *
   * @returns {number} The monetary amount in major units.
   *
   * @example
   * ```typescript
   * const price = new Genkin(19.99, { currency: 'USD' });
   * console.log(price.valueOf()); // 19.99
   * console.log(+price);          // 19.99 (unary plus)
   * console.log(Number(price));   // 19.99
   * ```
   *
   * @example
   * ```typescript
   * // Automatic numeric conversion in operations
   * const a = new Genkin(10, { currency: 'USD' });
   * const b = new Genkin(5, { currency: 'USD' });
   *
   * console.log(a > b);           // true (compares 10 > 5)
   * console.log(a + 3);           // 13 (numeric addition)
   * console.log(Math.max(a, b));  // 10 (numeric comparison)
   * ```
   *
   * @example
   * ```typescript
   * // Be careful with currency mixing
   * const usd = new Genkin(100, { currency: 'USD' });
   * const eur = new Genkin(85, { currency: 'EUR' });
   *
   * // This compares numerical values only, ignoring currency differences
   * console.log(usd > eur); // true (100 > 85), but currencies don't match!
   * ```
   */
  valueOf(): number {
    return this.amount;
  }

  /**
   * Converts the Genkin instance to a different decimal precision.
   *
   * Changes the precision (number of decimal places) of the monetary amount,
   * scaling the internal minor unit representation accordingly. When decreasing
   * precision, rounding may occur based on the specified or default rounding mode.
   * When increasing precision, the amount is scaled without loss of information.
   *
   * @param {number} newPrecision - The target decimal precision (must be a non-negative integer).
   * @param {RoundingMode} [rounding] - Optional rounding mode for precision reduction. Uses instance default if not provided.
   * @returns {Genkin} A new Genkin instance with the converted precision.
   *
   * @throws {Error} When newPrecision is not a non-negative integer.
   *
   * @example
   * ```typescript
   * // Increasing precision (no rounding needed)
   * const dollars = new Genkin(10.50, { currency: 'USD', precision: 2 });
   * const highPrecision = dollars.convertPrecision(4);
   * console.log(highPrecision.amount);     // 10.5
   * console.log(highPrecision.precision);  // 4
   * console.log(highPrecision.minorUnits); // 105000 (scaled from 1050)
   * ```
   *
   * @example
   * ```typescript
   * // Decreasing precision with rounding
   * const precise = new Genkin(10.123456, { currency: 'USD', precision: 6 });
   * const rounded = precise.convertPrecision(2);
   * console.log(rounded.amount);    // 10.12 (rounded half-up)
   * console.log(rounded.precision); // 2
   * ```
   *
   * @example
   * ```typescript
   * // Custom rounding mode
   * const amount = new Genkin(10.125, { currency: 'USD', precision: 3 });
   * const bankRound = amount.convertPrecision(2, RoundingMode.ROUND_HALF_EVEN);
   * const alwaysUp = amount.convertPrecision(2, RoundingMode.ROUND_HALF_UP);
   *
   * console.log(bankRound.amount); // 10.12 (banker's rounding: .125 rounds to .12)
   * console.log(alwaysUp.amount);  // 10.13 (always rounds .125 up)
   * ```
   *
   * @example
   * ```typescript
   * // Zero precision (whole units only)
   * const cents = new Genkin(10.99, { currency: 'USD', precision: 2 });
   * const wholeDollars = cents.convertPrecision(0);
   * console.log(wholeDollars.amount); // 11 (rounded up)
   * console.log(wholeDollars.precision); // 0
   * ```
   *
   * @example
   * ```typescript
   * // Same precision returns same instance
   * const original = new Genkin(100, { currency: 'USD', precision: 2 });
   * const same = original.convertPrecision(2);
   * console.log(original === same); // true (optimization for no-op conversion)
   * ```
   */
  convertPrecision(newPrecision: number, rounding?: RoundingMode): Genkin {
    if (newPrecision < 0 || !Number.isInteger(newPrecision)) {
      throw new Error('[Genkin] Precision must be a non-negative integer');
    }

    const currentPrecision = this._precision;

    if (newPrecision === currentPrecision) {
      // No conversion needed
      return this;
    }

    // Use the currency's base for calculations
    const currencyBase = this._currency.base ?? 10;
    let newAmount: number;

    if (newPrecision > currentPrecision) {
      // Increasing precision - multiply by power of currency base
      const scaleFactor = Math.pow(currencyBase, newPrecision - currentPrecision);
      newAmount = this._amount * scaleFactor;
    } else {
      // Decreasing precision - divide by power of currency base and round
      const scaleFactor = Math.pow(currencyBase, currentPrecision - newPrecision);
      const unrounded = this._amount / scaleFactor;

      // Apply rounding
      const roundingMode = rounding ?? this._rounding;
      newAmount = applyRounding(unrounded, roundingMode);
    }

    // Create new Genkin with the converted amount and new precision
    return new Genkin(newAmount, {
      currency: this._currency,
      precision: newPrecision,
      rounding: this._rounding,
      isMinorUnits: true, // The amount is already in minor units
    });
  }
}

/**
 * Factory function to create a new Genkin monetary amount instance.
 *
 * Provides a convenient functional interface for creating Genkin instances
 * without using the `new` keyword. This is the recommended way to create
 * Genkin amounts in most use cases.
 *
 * @param {number | string} amount - The monetary amount to represent.
 * @param {GenkinOptions} [options] - Configuration options for the monetary amount.
 * @returns {Genkin} A new Genkin instance with the specified amount and options.
 *
 * @throws {Error} When amount is not a finite number (NaN, Infinity, or non-numeric string).
 * @throws {Error} When precision in options is not a non-negative integer.
 *
 * @example
 * ```typescript
 * // Basic usage
 * import { genkin } from 'genkin';
 *
 * const price = genkin(29.99);
 * console.log(price.toString()); // "$29.99"
 * ```
 *
 * @example
 * ```typescript
 * // With currency and options
 * const euros = genkin(19.50, {
 *   currency: 'EUR',
 *   precision: 2,
 *   rounding: RoundingMode.ROUND_HALF_UP
 * });
 *
 * console.log(euros.currencyCode); // "EUR"
 * console.log(euros.amount);       // 19.5
 * ```
 *
 * @example
 * ```typescript
 * // Functional programming style
 * const prices = [10.99, 15.49, 8.75];
 * const usdPrices = prices.map(amount => genkin(amount, { currency: 'USD' }));
 *
 * console.log(usdPrices[0].toString()); // "$10.99"
 * ```
 *
 * @example
 * ```typescript
 * // Cryptocurrency with high precision
 * const bitcoin = genkin(0.5, {
 *   currency: 'BTC',
 *   precision: 8
 * });
 *
 * console.log(bitcoin.amount);     // 0.5
 * console.log(bitcoin.precision);  // 8
 * ```
 *
 * @since 1.0.0
 */
export function genkin(amount: number | string, options?: GenkinOptions): Genkin {
  return new Genkin(amount, options);
} 