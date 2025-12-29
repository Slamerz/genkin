import type { Calculator } from "./calculator.js";
import { ComparisonOperator } from "./calculator.js";
import type { Currency, CurrencyCode, RoundingMode } from "./currency.js";
import {
	createCurrency,
	getCurrencyConfig,
	RoundingMode as RoundingModeEnum,
} from "./currency.js";
import type {
	CreateGenkinOptions,
	GenkinFactory,
	GenkinInstance,
	GenkinOptions,
} from "./types.js";

/**
 * Generic Genkin implementation that works with any numeric type.
 *
 * This class provides a generic monetary amount representation that can work with
 * different numeric types (number, bigint, Big.js, Decimal.js, etc.) through the
 * Calculator abstraction. It implements the same core functionality as the standard
 * Genkin class but with type-generic operations.
 *
 * @class GenericGenkin
 * @template T - The numeric type (e.g., number, bigint, Big)
 * @implements {GenkinInstance<T>}
 *
 * @example
 * ```typescript
 * import { GenericGenkin, bigintCalculator } from '@genkin/core';
 *
 * // Create a BigInt-based monetary amount
 * const amount = new GenericGenkin(
 *   1050n,
 *   bigintCalculator,
 *   { currency: 'USD', precision: 2, isMinorUnits: true }
 * );
 *
 * console.log(amount.amount); // 10n (in major units)
 * console.log(amount.minorUnits); // 1050n (in minor units)
 * ```
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
		options: GenkinOptions<T> = {},
	) {
		this._calculator = calculator;

		// Default to USD if no currency provided
		const defaultUSDConfig = getCurrencyConfig("USD");
		const defaultUSD: Currency = {
			...defaultUSDConfig,
			format: (amount: number) =>
				`$${amount.toFixed(defaultUSDConfig.precision)}`,
			parse: (value: string) => parseFloat(value.replace(/[$,]/g, "")) || 0,
		};

		// Handle both string currency codes and currency objects
		let currency: Currency;
		if (typeof options.currency === "string") {
			currency = createCurrency(getCurrencyConfig(options.currency));
		} else {
			currency = options.currency || defaultUSD;
		}

		this._currency = currency;
		// Ensure precision is always a number (handles BigInt, Big.js, etc.)
		const rawPrecision = options.precision ?? this._currency.precision;
		this._precision =
			typeof rawPrecision === "number" ? rawPrecision : Number(rawPrecision);
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

	convertPrecision(
		newPrecision: number,
		rounding?: RoundingMode,
	): GenkinInstance<T> {
		if (newPrecision < 0 || !Number.isInteger(newPrecision)) {
			throw new Error("[Genkin] Precision must be a non-negative integer");
		}

		const currentPrecision = this._precision;

		if (newPrecision === currentPrecision) {
			return this;
		}

		let newAmount: T;
		const base = this._intFromNumber(10);

		if (newPrecision > currentPrecision) {
			// Increasing precision - multiply by power of 10
			const scaleFactor = this._calculator.power(
				base,
				this._intFromNumber(newPrecision - currentPrecision),
			);
			newAmount = this._calculator.multiply(this._amount, scaleFactor);
		} else {
			// Decreasing precision - divide by power of 10
			const scaleFactor = this._calculator.power(
				base,
				this._intFromNumber(currentPrecision - newPrecision),
			);
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
 * Create a Genkin factory for a specific numeric type.
 *
 * This factory function allows you to create monetary amounts using custom numeric
 * types (like bigint, Big.js, Decimal.js) instead of the standard JavaScript number
 * type. The factory uses a Calculator implementation to perform arithmetic operations
 * on the custom numeric type.
 *
 * The function has two overloads:
 * 1. Pass a Calculator directly for simple use cases
 * 2. Pass CreateGenkinOptions for advanced use cases with lifecycle hooks
 *
 * @template T - The numeric type (e.g., bigint, Big, Decimal)
 * @param {Calculator<T> | CreateGenkinOptions<T>} calculatorOrOptions - Calculator or options
 * @returns {GenkinFactory<T>} A factory function that creates Genkin instances
 *
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator } from '@genkin/core';
 *
 * // Create a factory for BigInt monetary amounts
 * const bigintGenkin = createGenkin(bigintCalculator);
 *
 * // Use the factory to create amounts
 * const price = bigintGenkin(1099n, {
 *   currency: 'USD',
 *   precision: 2,
 *   isMinorUnits: true
 * });
 *
 * console.log(price.amount); // 10n (in dollars)
 * console.log(price.minorUnits); // 1099n (in cents)
 * ```
 *
 * @example
 * ```typescript
 * // With lifecycle hooks
 * const bigintGenkin = createGenkin({
 *   calculator: bigintCalculator,
 *   onCreate: (options) => {
 *     console.log('Creating Genkin with options:', options);
 *   }
 * });
 *
 * const amount = bigintGenkin(100n, { currency: 'USD' });
 * // Logs: "Creating Genkin with options: { currency: 'USD' }"
 * ```
 *
 * @example
 * ```typescript
 * // Using with Big.js for high precision
 * import Big from 'big.js';
 * import { createGenkin, bigjsCalculator } from '@genkin/core';
 *
 * const bigGenkin = createGenkin(bigjsCalculator);
 *
 * const precise = bigGenkin(new Big('0.1'), {
 *   currency: 'USD',
 *   precision: 2
 * });
 *
 * console.log(precise.amount.toString()); // "0.1"
 * ```
 *
 * @example
 * ```typescript
 * // Create custom calculator for Decimal.js
 * import Decimal from 'decimal.js';
 *
 * const decimalCalculator: Calculator<Decimal> = {
 *   add: (a, b) => a.plus(b),
 *   subtract: (a, b) => a.minus(b),
 *   multiply: (a, b) => a.times(b),
 *   integerDivide: (a, b) => a.dividedToIntegerBy(b),
 *   modulo: (a, b) => a.mod(b),
 *   power: (a, b) => a.pow(b.toNumber()),
 *   compare: (a, b) => a.comparedTo(b) as ComparisonOperator,
 *   increment: (a) => a.plus(1),
 *   decrement: (a) => a.minus(1),
 *   zero: () => new Decimal(0),
 * };
 *
 * const decimalGenkin = createGenkin(decimalCalculator);
 * const amount = decimalGenkin(new Decimal('10.50'), { currency: 'USD' });
 * ```
 */
export function createGenkin<T>(calculator: Calculator<T>): GenkinFactory<T>;
export function createGenkin<T>(
	options: CreateGenkinOptions<T>,
): GenkinFactory<T>;
export function createGenkin<T>(
	calculatorOrOptions: Calculator<T> | CreateGenkinOptions<T>,
): GenkinFactory<T> {
	const calculator =
		"calculator" in calculatorOrOptions
			? calculatorOrOptions.calculator
			: calculatorOrOptions;
	const onCreate =
		"onCreate" in calculatorOrOptions
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
