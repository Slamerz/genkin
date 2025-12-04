import type { Currency, CurrencyCode, CurrencyConfig, RoundingMode } from './currency.js';
import type { Calculator } from './calculator.js';

/**
 * Generic options for creating a Genkin instance
 */
export interface GenkinOptions<T> {
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
 * Generic Genkin instance interface
 * Represents a precise monetary amount with a specific numeric type
 */
export interface GenkinInstance<T> {
  /** Get the amount in major units (e.g., dollars) */
  readonly amount: T;
  /** Get the amount in minor units (e.g., cents) */
  readonly minorUnits: T;
  /** Get the currency object */
  readonly currency: Currency;
  /** Get the currency code */
  readonly currencyCode: CurrencyCode;
  /** Get the precision (decimal places) */
  readonly precision: number;
  /** Get the rounding mode */
  readonly rounding: RoundingMode;
  /** Get currency configuration */
  readonly currencyConfig: CurrencyConfig;
  /** Get the calculator used for this instance */
  readonly calculator: Calculator<T>;

  /**
   * Check if this Genkin has the same currency as another
   */
  hasSameCurrency(other: GenkinInstance<T>): boolean;

  /**
   * Check if this Genkin has the same precision as another
   */
  hasSamePrecision(other: GenkinInstance<T>): boolean;

  /**
   * Create a new Genkin with the same currency and precision
   */
  withAmount(amount: T): GenkinInstance<T>;

  /**
   * Create a new Genkin with a different currency
   */
  withCurrency(currency: Currency): GenkinInstance<T>;

  /**
   * Convert to a different precision with optional rounding
   */
  convertPrecision(newPrecision: number, rounding?: RoundingMode): GenkinInstance<T>;

  /**
   * Convert to a plain object
   */
  toObject(): { amount: T; currency: CurrencyCode; precision: number };

  /**
   * Convert to JSON (same as toObject)
   */
  toJSON(): { amount: T; currency: CurrencyCode; precision: number };

  /**
   * Convert to string representation
   */
  toString(): string;
}

/**
 * Factory function type for creating Genkin instances
 */
export type GenkinFactory<T> = (amount: T, options?: GenkinOptions<T>) => GenkinInstance<T>;

/**
 * Options for creating a Genkin factory
 */
export interface CreateGenkinOptions<T> {
  /** The calculator to use for numeric operations */
  calculator: Calculator<T>;
  /** Optional callback when creating instances */
  onCreate?: (options: GenkinOptions<T>) => void;
}

/**
 * Represents a scaled ratio for allocation (generic version)
 */
export interface GenericScaledRatio<T> {
  amount: T;
  scale: number;
}

/**
 * Union type for allocation ratios - can be simple values or scaled ratios
 */
export type GenericAllocationRatio<T> = T | GenericScaledRatio<T>;

// Re-export types from currency for convenience
export type { Currency, CurrencyCode, CurrencyConfig, RoundingMode } from './currency.js';
export type { Calculator, BinaryOperation, UnaryOperation } from './calculator.js';
export { ComparisonOperator } from './calculator.js';

