import type { Calculator } from "./calculator.js";
import type {
	Currency,
	CurrencyCode,
	CurrencyConfig,
	RoundingMode,
} from "./currency.js";

/**
 * Generic options for creating a Genkin instance.
 *
 * Configuration options that control how a generic Genkin monetary amount is
 * created and behaves. These options work with any numeric type T through the
 * Calculator abstraction.
 *
 * @interface GenkinOptions
 * @template T - The numeric type (e.g., number, bigint, Big)
 *
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator } from '@genkin/core';
 *
 * const bigintGenkin = createGenkin(bigintCalculator);
 *
 * const options: GenkinOptions<bigint> = {
 *   currency: 'USD',
 *   precision: 2,
 *   rounding: RoundingMode.ROUND_HALF_EVEN,
 *   isMinorUnits: true
 * };
 *
 * const amount = bigintGenkin(1050n, options);
 * ```
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
 * Generic Genkin instance interface.
 *
 * Represents a precise monetary amount with a specific numeric type. This interface
 * defines the contract for all Genkin instances regardless of the underlying numeric
 * type (number, bigint, Big.js, etc.). It provides immutable operations and accessors
 * for monetary calculations.
 *
 * @interface GenkinInstance
 * @template T - The numeric type (e.g., number, bigint, Big)
 *
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator, GenkinInstance } from '@genkin/core';
 *
 * const bigintGenkin = createGenkin(bigintCalculator);
 * const amount: GenkinInstance<bigint> = bigintGenkin(1050n, {
 *   currency: 'USD',
 *   precision: 2,
 *   isMinorUnits: true
 * });
 *
 * console.log(amount.amount); // 10n
 * console.log(amount.currencyCode); // "USD"
 * ```
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
	convertPrecision(
		newPrecision: number,
		rounding?: RoundingMode,
	): GenkinInstance<T>;

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
 * Factory function type for creating Genkin instances.
 *
 * A function that creates GenkinInstance objects with a specific numeric type.
 * The factory is created using the createGenkin function with a Calculator.
 *
 * @template T - The numeric type
 * @param {T} amount - The monetary amount
 * @param {GenkinOptions<T>} [options] - Configuration options
 * @returns {GenkinInstance<T>} A new Genkin instance
 *
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator, GenkinFactory } from '@genkin/core';
 *
 * const factory: GenkinFactory<bigint> = createGenkin(bigintCalculator);
 * const amount = factory(1050n, { currency: 'USD', precision: 2, isMinorUnits: true });
 * ```
 */
export type GenkinFactory<T> = (
	amount: T,
	options?: GenkinOptions<T>,
) => GenkinInstance<T>;

/**
 * Options for creating a Genkin factory.
 *
 * Configuration object passed to createGenkin to set up a factory function
 * with a specific calculator and optional lifecycle hooks.
 *
 * @interface CreateGenkinOptions
 * @template T - The numeric type
 *
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator, CreateGenkinOptions } from '@genkin/core';
 *
 * const options: CreateGenkinOptions<bigint> = {
 *   calculator: bigintCalculator,
 *   onCreate: (opts) => {
 *     console.log('Creating Genkin with:', opts);
 *   }
 * };
 *
 * const factory = createGenkin(options);
 * ```
 */
export interface CreateGenkinOptions<T> {
	/** The calculator to use for numeric operations */
	calculator: Calculator<T>;
	/** Optional callback when creating instances */
	onCreate?: (options: GenkinOptions<T>) => void;
}

/**
 * Represents a scaled ratio for allocation (generic version).
 *
 * Similar to ScaledRatio but works with generic numeric types. Allows precise
 * specification of allocation percentages using an amount and scale factor.
 *
 * @interface GenericScaledRatio
 * @template T - The numeric type
 *
 * @example
 * ```typescript
 * // For bigint: 50.5% as a scaled ratio
 * const ratio: GenericScaledRatio<bigint> = {
 *   amount: 505n,
 *   scale: 1
 * };
 * ```
 */
export interface GenericScaledRatio<T> {
	/** The numerator of the ratio */
	amount: T;
	/** The scale factor (power of 10 divisor) */
	scale: number;
}

/**
 * Union type for generic allocation ratios.
 *
 * Can be either a simple value of type T or a GenericScaledRatio<T> for
 * precise decimal ratios.
 *
 * @template T - The numeric type
 *
 * @example
 * ```typescript
 * // Simple bigint ratios
 * const ratios: GenericAllocationRatio<bigint>[] = [25n, 75n];
 *
 * // Scaled bigint ratios
 * const preciseRatios: GenericAllocationRatio<bigint>[] = [
 *   { amount: 505n, scale: 1 },
 *   { amount: 495n, scale: 1 }
 * ];
 * ```
 */
export type GenericAllocationRatio<T> = T | GenericScaledRatio<T>;

export type {
	BinaryOperation,
	Calculator,
	UnaryOperation,
} from "./calculator.js";
export { ComparisonOperator } from "./calculator.js";
// Re-export types from currency for convenience
export type {
	Currency,
	CurrencyCode,
	CurrencyConfig,
	RoundingMode,
} from "./currency.js";
