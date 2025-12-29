import type { Calculator } from "../core/calculator.js";
import { ComparisonOperator } from "../core/calculator.js";
import { createGenkin, GenericGenkin } from "../core/factory.js";
import type {
	GenericAllocationRatio,
	GenericScaledRatio,
	GenkinInstance,
} from "../core/types.js";

/**
 * Assert function for validation.
 *
 * Internal utility function that throws an error if a condition is not met.
 * Used throughout the generic operations for input validation.
 *
 * @param {boolean} condition - The condition to check
 * @param {string} message - Error message to throw if condition is false
 * @throws {Error} When condition is false
 * @internal
 */
function assert(condition: boolean, message: string): void {
	if (!condition) {
		throw new Error(`[Dinero.js] ${message}`);
	}
}

/**
 * Create generic arithmetic operations for a specific numeric type.
 *
 * Factory function that creates a complete set of arithmetic operations (add,
 * subtract, multiply, divide, allocate, etc.) that work with a specific numeric
 * type through the Calculator abstraction. This allows you to perform monetary
 * calculations with BigInt, Big.js, Decimal.js, or any custom numeric type.
 *
 * @template T - The numeric type (e.g., bigint, Big, Decimal)
 * @param {Calculator<T>} calculator - The calculator implementation for type T
 * @returns {Object} Object containing arithmetic operation functions
 *
 * @example
 * ```typescript
 * import { createArithmeticOperations, bigintCalculator } from '@genkin/core';
 *
 * const ops = createArithmeticOperations(bigintCalculator);
 *
 * // Now you can use ops.add, ops.subtract, ops.multiply, etc.
 * // with GenkinInstance<bigint> objects
 * ```
 *
 * @example
 * ```typescript
 * // Use with Big.js
 * import Big from 'big.js';
 * import { createArithmeticOperations, bigjsCalculator, createGenkin } from '@genkin/core';
 *
 * const genkin = createGenkin(bigjsCalculator);
 * const ops = createArithmeticOperations(bigjsCalculator);
 *
 * const a = genkin(new Big('10.50'), { currency: 'USD' });
 * const b = genkin(new Big('5.25'), { currency: 'USD' });
 *
 * const sum = ops.add(a, b);
 * console.log(sum.amount.toString()); // "15.75"
 * ```
 */
export function createArithmeticOperations<T>(calculator: Calculator<T>) {
	const factory = createGenkin(calculator);

	/**
	 * Helper to convert a number to the calculator's type
	 */
	function intFromNumber(n: number): T {
		let result = calculator.zero();
		for (let i = 0; i < n; i++) {
			result = calculator.increment(result);
		}
		return result;
	}

	/**
	 * Normalize amounts to the same precision for comparison/calculation
	 */
	function normalizeToSamePrecision(
		a: GenkinInstance<T>,
		b: GenkinInstance<T>,
	): { aUnits: T; bUnits: T; maxPrecision: number } {
		const maxPrecision = Math.max(a.precision, b.precision);
		// Use the currency's base (default to 10 if not specified)
		const currencyBase = a.currency.base ?? 10;
		const base = intFromNumber(currencyBase);

		const aScale = calculator.power(
			base,
			intFromNumber(maxPrecision - a.precision),
		);
		const bScale = calculator.power(
			base,
			intFromNumber(maxPrecision - b.precision),
		);

		const aUnits = calculator.multiply(a.minorUnits, aScale);
		const bUnits = calculator.multiply(b.minorUnits, bScale);

		return { aUnits, bUnits, maxPrecision };
	}

	/**
	 * Add two Genkin instances
	 */
	function add(a: GenkinInstance<T>, b: GenkinInstance<T>): GenkinInstance<T> {
		assert(a.hasSameCurrency(b), "Objects must have the same currency.");

		const { aUnits, bUnits, maxPrecision } = normalizeToSamePrecision(a, b);
		const resultUnits = calculator.add(aUnits, bUnits);

		return new GenericGenkin(resultUnits, calculator, {
			currency: a.currency,
			precision: maxPrecision,
			rounding: a.rounding,
			isMinorUnits: true,
		});
	}

	/**
	 * Subtract one Genkin instance from another
	 */
	function subtract(
		a: GenkinInstance<T>,
		b: GenkinInstance<T>,
	): GenkinInstance<T> {
		assert(a.hasSameCurrency(b), "Objects must have the same currency.");

		const { aUnits, bUnits, maxPrecision } = normalizeToSamePrecision(a, b);
		const resultUnits = calculator.subtract(aUnits, bUnits);

		return new GenericGenkin(resultUnits, calculator, {
			currency: a.currency,
			precision: maxPrecision,
			rounding: a.rounding,
			isMinorUnits: true,
		});
	}

	/**
	 * Multiply a Genkin instance by a factor
	 */
	function multiply(
		genkin: GenkinInstance<T>,
		multiplier: T | GenericScaledRatio<T>,
	): GenkinInstance<T> {
		if (
			typeof multiplier === "object" &&
			multiplier !== null &&
			"amount" in multiplier
		) {
			// Scaled multiplier: { amount, scale }
			const scaledMultiplier = multiplier as GenericScaledRatio<T>;
			const multiplierAmount = scaledMultiplier.amount;

			// Convert scale to number for precision calculation
			let scaleNum = 0;
			if ("scale" in scaledMultiplier && scaledMultiplier.scale !== undefined) {
				if (typeof scaledMultiplier.scale === "bigint") {
					scaleNum = Number(scaledMultiplier.scale);
				} else if (typeof scaledMultiplier.scale === "number") {
					scaleNum = scaledMultiplier.scale;
				} else if (
					scaledMultiplier.scale &&
					typeof scaledMultiplier.scale === "object"
				) {
					// Handle Big.js or other big number libraries
					if ("toNumber" in scaledMultiplier.scale) {
						scaleNum = (scaledMultiplier.scale as any).toNumber();
					} else {
						// Fallback: try to convert to number
						scaleNum = Number(scaledMultiplier.scale);
					}
				}
			}

			// Calculate new precision: genkin precision + multiplier scale
			const resultPrecision = Math.max(0, genkin.precision + scaleNum);

			// Multiply minor units directly
			const resultUnits = calculator.multiply(
				genkin.minorUnits,
				multiplierAmount,
			);

			return new GenericGenkin(resultUnits, calculator, {
				currency: genkin.currency,
				precision: resultPrecision,
				rounding: genkin.rounding,
				isMinorUnits: true,
			});
		} else {
			// Simple multiplier
			const resultUnits = calculator.multiply(
				genkin.minorUnits,
				multiplier as T,
			);

			return new GenericGenkin(resultUnits, calculator, {
				currency: genkin.currency,
				precision: genkin.precision,
				rounding: genkin.rounding,
				isMinorUnits: true,
			});
		}
	}

	/**
	 * Divide a Genkin instance by a divisor
	 */
	function divide(genkin: GenkinInstance<T>, divisor: T): GenkinInstance<T> {
		const resultUnits = calculator.integerDivide(genkin.minorUnits, divisor);

		return new GenericGenkin(resultUnits, calculator, {
			currency: genkin.currency,
			precision: genkin.precision,
			rounding: genkin.rounding,
			isMinorUnits: true,
		});
	}

	/**
	 * Negate a Genkin instance
	 */
	function negate(genkin: GenkinInstance<T>): GenkinInstance<T> {
		const zero = calculator.zero();
		const negatedUnits = calculator.subtract(zero, genkin.minorUnits);

		return new GenericGenkin(negatedUnits, calculator, {
			currency: genkin.currency,
			precision: genkin.precision,
			rounding: genkin.rounding,
			isMinorUnits: true,
		});
	}

	/**
	 * Get the absolute value of a Genkin instance
	 */
	function abs(genkin: GenkinInstance<T>): GenkinInstance<T> {
		const comparison = calculator.compare(genkin.minorUnits, calculator.zero());
		if (comparison === ComparisonOperator.LT) {
			return negate(genkin);
		}
		return genkin;
	}

	/**
	 * Allocate a Genkin amount across ratios
	 */
	function allocate(
		genkin: GenkinInstance<T>,
		ratios: GenericAllocationRatio<T>[],
	): GenkinInstance<T>[] {
		if (ratios.length === 0) {
			throw new Error("Ratios array cannot be empty");
		}

		// Normalize ratios to simple values
		const normalizedRatios = normalizeRatios(ratios);

		// Calculate total ratio
		let totalRatio = calculator.zero();
		for (const ratio of normalizedRatios) {
			totalRatio = calculator.add(totalRatio, ratio);
		}

		const zeroComparison = calculator.compare(totalRatio, calculator.zero());
		if (zeroComparison === ComparisonOperator.EQ) {
			throw new Error("Total ratio cannot be zero");
		}

		const totalUnits = genkin.minorUnits;
		const allocations: T[] = [];
		let allocatedSum = calculator.zero();

		// Calculate base allocations
		for (const ratio of normalizedRatios) {
			const zeroRatioComparison = calculator.compare(ratio, calculator.zero());
			if (zeroRatioComparison === ComparisonOperator.EQ) {
				allocations.push(calculator.zero());
			} else {
				// allocation = (totalUnits * ratio) / totalRatio
				const numerator = calculator.multiply(totalUnits, ratio);
				const allocation = calculator.integerDivide(numerator, totalRatio);
				allocations.push(allocation);
				allocatedSum = calculator.add(allocatedSum, allocation);
			}
		}

		// Distribute remainder
		let remainder = calculator.subtract(totalUnits, allocatedSum);
		let index = 0;

		// Keep distributing while there's remainder
		while (
			calculator.compare(remainder, calculator.zero()) ===
				ComparisonOperator.GT &&
			index < allocations.length
		) {
			const ratioComparison = calculator.compare(
				normalizedRatios[index],
				calculator.zero(),
			);
			if (ratioComparison !== ComparisonOperator.EQ) {
				allocations[index] = calculator.increment(allocations[index]);
				remainder = calculator.decrement(remainder);
			}
			index++;
		}

		// Convert back to Genkin instances
		return allocations.map(
			(units) =>
				new GenericGenkin(units, calculator, {
					currency: genkin.currency,
					precision: genkin.precision,
					rounding: genkin.rounding,
					isMinorUnits: true,
				}),
		);
	}

	/**
	 * Normalize ratios to simple values
	 */
	function normalizeRatios(ratios: GenericAllocationRatio<T>[]): T[] {
		return ratios.map((ratio) => {
			if (typeof ratio === "object" && ratio !== null && "amount" in ratio) {
				return (ratio as GenericScaledRatio<T>).amount;
			}
			return ratio as T;
		});
	}

	/**
	 * Transform a Genkin instance to a different scale (precision)
	 */
	function transformScale(
		genkin: GenkinInstance<T>,
		targetScale: number,
	): GenkinInstance<T> {
		// Convert targetScale to calculator type
		let scale = calculator.zero();
		for (let i = 0; i < targetScale; i++) {
			scale = calculator.increment(scale);
		}

		const currentPrecision = genkin.precision;

		if (targetScale === currentPrecision) {
			// No conversion needed
			return genkin;
		}

		// Use the currency's base for calculations
		const currencyBase = genkin.currency.base ?? 10;
		const base = intFromNumber(currencyBase);
		let newAmount: T;

		if (targetScale > currentPrecision) {
			// Increasing precision - multiply by power of currency base
			const scaleDiff = targetScale - currentPrecision;
			let scaleFactor = calculator.zero();
			for (let i = 0; i < scaleDiff; i++) {
				scaleFactor = calculator.increment(scaleFactor);
			}
			const multiplier = calculator.power(base, scaleFactor);
			newAmount = calculator.multiply(genkin.minorUnits, multiplier);
		} else {
			// Decreasing precision - divide by power of currency base and round
			const scaleDiff = currentPrecision - targetScale;
			let scaleFactor = calculator.zero();
			for (let i = 0; i < scaleDiff; i++) {
				scaleFactor = calculator.increment(scaleFactor);
			}
			const divisor = calculator.power(base, scaleFactor);
			newAmount = calculator.integerDivide(genkin.minorUnits, divisor);
		}

		// Create new Genkin with the converted amount and target precision
		return new GenericGenkin(newAmount, calculator, {
			currency: genkin.currency,
			precision: targetScale,
			rounding: genkin.rounding,
			isMinorUnits: true, // The amount is already in minor units
		});
	}

	/**
	 * Convert a Genkin instance to a different currency using a rate
	 * @param genkin - The source Genkin instance
	 * @param newCurrency - The target currency configuration
	 * @param rate - The exchange rate (simple value or { amount, scale })
	 */
	function convert(
		genkin: GenkinInstance<T>,
		newCurrency: { code: string; base?: number; precision: number },
		rate: T | { amount: T; scale: number },
	): GenkinInstance<T> {
		const sourceScale = genkin.precision;
		const destExponent = newCurrency.precision;
		// Get the currency's base (default to 10 for decimal currencies)
		const currencyBaseNum = newCurrency.base ?? 10;

		let newAmount: T;
		let newScale: number;

		if (typeof rate === "object" && rate !== null && "amount" in rate) {
			// Scaled rate: { amount, scale }
			const scaledRate = rate as { amount: T; scale: number };
			newAmount = calculator.multiply(genkin.minorUnits, scaledRate.amount);
			newScale = sourceScale + scaledRate.scale;
		} else {
			// Simple rate - use destination currency's exponent as scale
			newScale = destExponent;

			if (newScale > sourceScale) {
				// Scale up the amount
				const scaleDiff = newScale - sourceScale;
				const base = intFromNumber(currencyBaseNum);
				const scaleFactor = calculator.power(base, intFromNumber(scaleDiff));
				newAmount = calculator.multiply(
					calculator.multiply(genkin.minorUnits, rate as T),
					scaleFactor,
				);
			} else {
				// No scale adjustment needed
				newAmount = calculator.multiply(genkin.minorUnits, rate as T);
			}
		}

		// Create a Currency object from the config
		const targetCurrency = {
			code: newCurrency.code,
			numeric: 0,
			precision: newCurrency.precision,
			symbol: newCurrency.code,
			name: newCurrency.code,
			base: newCurrency.base ?? 10,
			format: () => "",
			parse: () => 0,
		};

		return new GenericGenkin(newAmount, calculator, {
			currency: targetCurrency,
			precision: newScale,
			rounding: genkin.rounding,
			isMinorUnits: true,
		});
	}

	/**
	 * Normalize the scale of an array of Genkin instances to the highest scale
	 */
	function normalizeScale(genkins: GenkinInstance<T>[]): GenkinInstance<T>[] {
		if (genkins.length === 0) {
			return [];
		}

		// Find the highest scale (precision)
		const highestScale = genkins.reduce((highest, current) => {
			return Math.max(highest, current.precision);
		}, 0);

		// Convert all instances to the highest scale
		return genkins.map((genkin) => {
			if (genkin.precision === highestScale) {
				return genkin;
			} else {
				return transformScale(genkin, highestScale);
			}
		});
	}

	return {
		add,
		subtract,
		multiply,
		divide,
		negate,
		abs,
		allocate,
		convert,
		transformScale,
		normalizeScale,
	};
}

/**
 * Create generic comparison operations for a specific numeric type.
 *
 * Factory function that creates a complete set of comparison operations (equals,
 * lessThan, greaterThan, min, max, etc.) that work with a specific numeric type
 * through the Calculator abstraction. This allows you to compare monetary amounts
 * using BigInt, Big.js, Decimal.js, or any custom numeric type.
 *
 * @template T - The numeric type (e.g., bigint, Big, Decimal)
 * @param {Calculator<T>} calculator - The calculator implementation for type T
 * @returns {Object} Object containing comparison operation functions
 *
 * @example
 * ```typescript
 * import { createComparisonOperations, bigintCalculator, createGenkin } from '@genkin/core';
 *
 * const genkin = createGenkin(bigintCalculator);
 * const ops = createComparisonOperations(bigintCalculator);
 *
 * const a = genkin(1050n, { currency: 'USD', precision: 2, isMinorUnits: true });
 * const b = genkin(2000n, { currency: 'USD', precision: 2, isMinorUnits: true });
 *
 * console.log(ops.lessThan(a, b)); // true
 * console.log(ops.equals(a, a)); // true
 * ```
 *
 * @example
 * ```typescript
 * // Use with Big.js
 * import Big from 'big.js';
 * import { createComparisonOperations, bigjsCalculator, createGenkin } from '@genkin/core';
 *
 * const genkin = createGenkin(bigjsCalculator);
 * const ops = createComparisonOperations(bigjsCalculator);
 *
 * const amounts = [
 *   genkin(new Big('10.50'), { currency: 'USD' }),
 *   genkin(new Big('5.25'), { currency: 'USD' }),
 *   genkin(new Big('15.75'), { currency: 'USD' })
 * ];
 *
 * const maximum = ops.maximum(amounts);
 * console.log(maximum.amount.toString()); // "15.75"
 * ```
 */
export function createComparisonOperations<T>(calculator: Calculator<T>) {
	/**
	 * Helper to convert a number to the calculator's type
	 */
	function intFromNumber(n: number): T {
		let result = calculator.zero();
		for (let i = 0; i < n; i++) {
			result = calculator.increment(result);
		}
		return result;
	}

	/**
	 * Normalize amounts to the same precision for comparison
	 */
	function normalizeToSamePrecision(
		a: GenkinInstance<T>,
		b: GenkinInstance<T>,
	): { aUnits: T; bUnits: T } {
		const maxPrecision = Math.max(a.precision, b.precision);
		const base = intFromNumber(10);

		const aScale = calculator.power(
			base,
			intFromNumber(maxPrecision - a.precision),
		);
		const bScale = calculator.power(
			base,
			intFromNumber(maxPrecision - b.precision),
		);

		const aUnits = calculator.multiply(a.minorUnits, aScale);
		const bUnits = calculator.multiply(b.minorUnits, bScale);

		return { aUnits, bUnits };
	}

	/**
	 * Compare two Genkin instances
	 */
	function compare(
		a: GenkinInstance<T>,
		b: GenkinInstance<T>,
	): ComparisonOperator {
		assert(a.hasSameCurrency(b), "Objects must have the same currency.");

		const { aUnits, bUnits } = normalizeToSamePrecision(a, b);
		return calculator.compare(aUnits, bUnits);
	}

	/**
	 * Check if two Genkin instances are equal
	 */
	function equals(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
		if (!a.hasSameCurrency(b)) {
			return false;
		}
		return compare(a, b) === ComparisonOperator.EQ;
	}

	/**
	 * Check if the first Genkin is less than the second
	 */
	function lessThan(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
		return compare(a, b) === ComparisonOperator.LT;
	}

	/**
	 * Check if the first Genkin is less than or equal to the second
	 */
	function lessThanOrEqual(
		a: GenkinInstance<T>,
		b: GenkinInstance<T>,
	): boolean {
		const result = compare(a, b);
		return result === ComparisonOperator.LT || result === ComparisonOperator.EQ;
	}

	/**
	 * Check if the first Genkin is greater than the second
	 */
	function greaterThan(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
		return compare(a, b) === ComparisonOperator.GT;
	}

	/**
	 * Check if the first Genkin is greater than or equal to the second
	 */
	function greaterThanOrEqual(
		a: GenkinInstance<T>,
		b: GenkinInstance<T>,
	): boolean {
		const result = compare(a, b);
		return result === ComparisonOperator.GT || result === ComparisonOperator.EQ;
	}

	/**
	 * Check if a Genkin instance is zero
	 */
	function isZero(genkin: GenkinInstance<T>): boolean {
		return (
			calculator.compare(genkin.minorUnits, calculator.zero()) ===
			ComparisonOperator.EQ
		);
	}

	/**
	 * Check if a Genkin instance is positive (>= 0)
	 */
	function isPositive(genkin: GenkinInstance<T>): boolean {
		return (
			calculator.compare(genkin.minorUnits, calculator.zero()) !==
			ComparisonOperator.LT
		);
	}

	/**
	 * Check if a Genkin instance is negative (< 0)
	 */
	function isNegative(genkin: GenkinInstance<T>): boolean {
		return (
			calculator.compare(genkin.minorUnits, calculator.zero()) ===
			ComparisonOperator.LT
		);
	}

	/**
	 * Find the minimum of Genkin instances
	 */
	function min(...genkins: GenkinInstance<T>[]): GenkinInstance<T> {
		if (genkins.length === 0) {
			throw new Error("Cannot find minimum of empty array");
		}
		return genkins.reduce((min, current) =>
			lessThan(current, min) ? current : min,
		);
	}

	/**
	 * Find the maximum of Genkin instances
	 */
	function max(...genkins: GenkinInstance<T>[]): GenkinInstance<T> {
		if (genkins.length === 0) {
			throw new Error("Cannot find maximum of empty array");
		}
		return genkins.reduce((max, current) =>
			greaterThan(current, max) ? current : max,
		);
	}

	/**
	 * Check if a Genkin instance has sub-units (fractional parts)
	 * For decimal currencies, checks if there are fractional parts based on precision
	 * For non-decimal currencies, checks if amount is not a whole unit
	 *
	 * Note: This function works with the Genkin currency format (single base number).
	 * For multi-base currencies, use the wrapper function which has access to the original Dinero currency.
	 */
	function hasSubUnits(genkin: GenkinInstance<T>): boolean {
		const minorUnits = genkin.minorUnits;
		const precision = genkin.precision;
		const currencyBaseNum = genkin.currency.base ?? 10;

		// Convert base to type T
		let currencyBase = calculator.zero();
		for (let i = 0; i < currencyBaseNum; i++) {
			currencyBase = calculator.increment(currencyBase);
		}

		// Calculate base^precision
		let precisionValue = calculator.zero();
		for (let i = 0; i < precision; i++) {
			precisionValue = calculator.increment(precisionValue);
		}
		const divisor = calculator.power(currencyBase, precisionValue);

		// Check if minorUnits is divisible by divisor
		const remainder = calculator.modulo(minorUnits, divisor);
		return (
			calculator.compare(remainder, calculator.zero()) !== ComparisonOperator.EQ
		);
	}

	/**
	 * Find the maximum from an array of Genkin instances
	 * All instances must have the same currency
	 */
	function maximum(genkins: readonly GenkinInstance<T>[]): GenkinInstance<T> {
		if (genkins.length === 0) {
			throw new Error("Cannot find maximum of empty array");
		}

		if (genkins.length === 1) {
			return genkins[0];
		}

		// All must have the same currency
		const firstCurrency = genkins[0].currency.code;
		for (let i = 1; i < genkins.length; i++) {
			if (genkins[i].currency.code !== firstCurrency) {
				throw new Error(
					`Cannot compare different currencies: ${firstCurrency} and ${genkins[i].currency.code}`,
				);
			}
		}

		return genkins.reduce((max, current) =>
			greaterThan(current, max) ? current : max,
		);
	}

	/**
	 * Find the minimum from an array of Genkin instances
	 * All instances must have the same currency
	 */
	function minimum(genkins: readonly GenkinInstance<T>[]): GenkinInstance<T> {
		if (genkins.length === 0) {
			throw new Error("Cannot find minimum of empty array");
		}

		if (genkins.length === 1) {
			return genkins[0];
		}

		// All must have the same currency
		const firstCurrency = genkins[0].currency.code;
		for (let i = 1; i < genkins.length; i++) {
			if (genkins[i].currency.code !== firstCurrency) {
				throw new Error(
					`Cannot compare different currencies: ${firstCurrency} and ${genkins[i].currency.code}`,
				);
			}
		}

		return genkins.reduce((min, current) =>
			lessThan(current, min) ? current : min,
		);
	}

	return {
		compare,
		equals,
		lessThan,
		lessThanOrEqual,
		greaterThan,
		greaterThanOrEqual,
		isZero,
		isPositive,
		isNegative,
		min,
		max,
		hasSubUnits,
		maximum,
		minimum,
	};
}

/**
 * Create all generic operations for a specific numeric type.
 *
 * Convenience function that creates both arithmetic and comparison operations
 * in a single call. Returns an object containing all operation functions
 * (add, subtract, multiply, divide, equals, lessThan, etc.) that work with
 * the specified numeric type.
 *
 * @template T - The numeric type (e.g., bigint, Big, Decimal)
 * @param {Calculator<T>} calculator - The calculator implementation for type T
 * @returns {Object} Object containing all arithmetic and comparison operations
 *
 * @example
 * ```typescript
 * import { createOperations, bigintCalculator, createGenkin } from '@genkin/core';
 *
 * const genkin = createGenkin(bigintCalculator);
 * const ops = createOperations(bigintCalculator);
 *
 * const a = genkin(1050n, { currency: 'USD', precision: 2, isMinorUnits: true });
 * const b = genkin(525n, { currency: 'USD', precision: 2, isMinorUnits: true });
 *
 * // Use any operation
 * const sum = ops.add(a, b);
 * const isLess = ops.lessThan(b, a);
 * const maximum = ops.max(a, b);
 *
 * console.log(sum.amount); // 15n
 * console.log(isLess); // true
 * console.log(maximum.amount); // 10n
 * ```
 *
 * @example
 * ```typescript
 * // Complete example with Big.js
 * import Big from 'big.js';
 * import { createOperations, bigjsCalculator, createGenkin } from '@genkin/core';
 *
 * const genkin = createGenkin(bigjsCalculator);
 * const ops = createOperations(bigjsCalculator);
 *
 * const price = genkin(new Big('100'), { currency: 'USD' });
 * const discount = genkin(new Big('15'), { currency: 'USD' });
 *
 * const final = ops.subtract(price, discount);
 * const isAffordable = ops.lessThan(final, genkin(new Big('100'), { currency: 'USD' }));
 *
 * console.log(final.amount.toString()); // "85"
 * console.log(isAffordable); // true
 * ```
 */
export function createOperations<T>(calculator: Calculator<T>) {
	return {
		...createArithmeticOperations(calculator),
		...createComparisonOperations(calculator),
	};
}
