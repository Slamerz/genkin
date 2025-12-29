import { Genkin } from "../core/genkin.js";
import {
	safeAdd,
	safeDivide,
	safeMultiply,
	safeSubtract,
} from "../core/precision.js";
import { max } from "./comparison.js";

/**
 * Represents a scaled ratio for allocation with precision control.
 *
 * Scaled ratios allow you to specify allocation percentages with decimal precision
 * by providing both an amount and a scale factor. For example, to represent 50.5%,
 * use `{ amount: 505, scale: 1 }` (505 / 10^1 = 50.5).
 *
 * @interface ScaledRatio
 *
 * @example
 * ```typescript
 * // 50.5% as a scaled ratio
 * const ratio: ScaledRatio = { amount: 505, scale: 1 };
 *
 * // 33.33% as a scaled ratio
 * const ratio2: ScaledRatio = { amount: 3333, scale: 2 };
 * ```
 */
export interface ScaledRatio {
	/** The numerator of the ratio */
	amount: number;
	/** The scale factor (power of 10 divisor) */
	scale: number;
}

/**
 * Union type for allocation ratios.
 *
 * Can be either a simple number (for whole number ratios like 25, 75) or a
 * ScaledRatio (for precise decimal ratios like 50.5%, 49.5%).
 *
 * @example
 * ```typescript
 * // Simple ratios
 * const ratios: AllocationRatio[] = [25, 75];
 *
 * // Scaled ratios for precision
 * const preciseRatios: AllocationRatio[] = [
 *   { amount: 505, scale: 1 },  // 50.5%
 *   { amount: 495, scale: 1 }   // 49.5%
 * ];
 *
 * // Mixed ratios
 * const mixedRatios: AllocationRatio[] = [
 *   25,
 *   { amount: 755, scale: 1 }
 * ];
 * ```
 */
export type AllocationRatio = number | ScaledRatio;

/**
 * Add two Genkin monetary amounts.
 *
 * Performs addition of two monetary amounts with the same currency. The result
 * uses the higher precision of the two operands to maintain accuracy. This
 * operation is immutable - neither input is modified.
 *
 * @param {Genkin} a - The first monetary amount (augend)
 * @param {Genkin} b - The second monetary amount (addend)
 * @returns {Genkin} A new Genkin instance representing the sum
 *
 * @throws {Error} When the two amounts have different currencies
 *
 * @example
 * ```typescript
 * import { genkin, add } from '@genkin/core';
 *
 * const price1 = genkin(12.34, { currency: 'USD' });
 * const price2 = genkin(5.67, { currency: 'USD' });
 * const total = add(price1, price2);
 *
 * console.log(total.amount); // 18.01
 * console.log(total.currencyCode); // "USD"
 * ```
 *
 * @example
 * ```typescript
 * // Handles different precisions by using the higher one
 * const a = genkin(12.34, { currency: 'USD', precision: 2 });
 * const b = genkin(5.678, { currency: 'USD', precision: 3 });
 * const result = add(a, b);
 *
 * console.log(result.amount); // 18.018
 * console.log(result.precision); // 3
 * ```
 *
 * @example
 * ```typescript
 * // Handles negative values
 * const a = genkin(10, { currency: 'USD' });
 * const b = genkin(-3, { currency: 'USD' });
 * const result = add(a, b);
 *
 * console.log(result.amount); // 7
 * ```
 */
export function add(a: Genkin, b: Genkin): Genkin {
	if (!a.hasSameCurrency(b)) {
		throw new Error(
			`Cannot add different currencies: ${a.currencyCode} and ${b.currencyCode}`,
		);
	}
	// Use the higher precision for the result
	const maxPrecision = Math.max(a.precision, b.precision);

	// Convert both to the same precision for calculation
	const aUnits = a.minorUnits * 10 ** (maxPrecision - a.precision);
	const bUnits = b.minorUnits * 10 ** (maxPrecision - b.precision);

	const resultUnits = safeAdd(aUnits, bUnits);
	const resultAmount = resultUnits / 10 ** maxPrecision;

	return new Genkin(resultAmount, {
		currency: a.currency,
		precision: maxPrecision,
		rounding: a.rounding,
	});
}

/**
 * Subtract one Genkin monetary amount from another.
 *
 * Performs subtraction of two monetary amounts with the same currency. The result
 * uses the higher precision of the two operands to maintain accuracy. This
 * operation is immutable - neither input is modified.
 *
 * @param {Genkin} a - The monetary amount to subtract from (minuend)
 * @param {Genkin} b - The monetary amount to subtract (subtrahend)
 * @returns {Genkin} A new Genkin instance representing the difference
 *
 * @throws {Error} When the two amounts have different currencies
 *
 * @example
 * ```typescript
 * import { genkin, subtract } from '@genkin/core';
 *
 * const price = genkin(12.34, { currency: 'USD' });
 * const discount = genkin(5.67, { currency: 'USD' });
 * const finalPrice = subtract(price, discount);
 *
 * console.log(finalPrice.amount); // 6.67
 * ```
 *
 * @example
 * ```typescript
 * // Results can be negative
 * const a = genkin(5, { currency: 'USD' });
 * const b = genkin(10, { currency: 'USD' });
 * const result = subtract(a, b);
 *
 * console.log(result.amount); // -5
 * ```
 *
 * @example
 * ```typescript
 * // Handles different precisions
 * const a = genkin(12.345, { currency: 'USD', precision: 3 });
 * const b = genkin(5.67, { currency: 'USD', precision: 2 });
 * const result = subtract(a, b);
 *
 * console.log(result.amount); // 6.675
 * console.log(result.precision); // 3
 * ```
 */
export function subtract(a: Genkin, b: Genkin): Genkin {
	if (!a.hasSameCurrency(b)) {
		throw new Error(
			`Cannot subtract different currencies: ${a.currencyCode} and ${b.currencyCode}`,
		);
	}

	// Use the higher precision for the result
	const maxPrecision = Math.max(a.precision, b.precision);

	// Convert both to the same precision for calculation
	const aUnits = a.minorUnits * 10 ** (maxPrecision - a.precision);
	const bUnits = b.minorUnits * 10 ** (maxPrecision - b.precision);

	const resultUnits = safeSubtract(aUnits, bUnits);
	const resultAmount = resultUnits / 10 ** maxPrecision;

	return new Genkin(resultAmount, {
		currency: a.currency,
		precision: maxPrecision,
		rounding: a.rounding,
	});
}

/**
 * Multiply a Genkin monetary amount by a numeric multiplier.
 *
 * Scales the monetary amount by the given multiplier. The multiplier can be
 * any finite number including decimals and negative values. The currency and
 * precision are preserved from the original amount. This operation is immutable.
 *
 * @param {Genkin} genkin - The monetary amount to multiply
 * @param {number} multiplier - The factor to multiply by (must be finite)
 * @returns {Genkin} A new Genkin instance with the multiplied amount
 *
 * @throws {Error} When multiplier is not a finite number (NaN or Infinity)
 *
 * @example
 * ```typescript
 * import { genkin, multiply } from '@genkin/core';
 *
 * const price = genkin(12.34, { currency: 'USD' });
 * const doubled = multiply(price, 2);
 *
 * console.log(doubled.amount); // 24.68
 * ```
 *
 * @example
 * ```typescript
 * // Multiply by decimal for percentage calculations
 * const price = genkin(100, { currency: 'USD' });
 * const halfPrice = multiply(price, 0.5);
 *
 * console.log(halfPrice.amount); // 50
 * ```
 *
 * @example
 * ```typescript
 * // Negative multipliers work too
 * const amount = genkin(10, { currency: 'USD' });
 * const negated = multiply(amount, -1.5);
 *
 * console.log(negated.amount); // -15
 * ```
 *
 * @example
 * ```typescript
 * // Multiply by zero
 * const price = genkin(12.34, { currency: 'USD' });
 * const zero = multiply(price, 0);
 *
 * console.log(zero.amount); // 0
 * ```
 */
export function multiply(genkin: Genkin, multiplier: number): Genkin {
	if (!Number.isFinite(multiplier)) {
		throw new Error("Multiplier must be a finite number");
	}

	// Multiply the minor units directly
	const resultUnits = Math.round(genkin.minorUnits * multiplier);

	return new Genkin(resultUnits / 10 ** genkin.precision, {
		currency: genkin.currency,
		precision: genkin.precision,
		rounding: genkin.rounding,
	});
}

/**
 * Divide a Genkin monetary amount by a numeric divisor.
 *
 * Divides the monetary amount by the given divisor. The divisor can be any
 * finite non-zero number including decimals. The result is rounded according
 * to the currency's precision. The currency and precision are preserved from
 * the original amount. This operation is immutable.
 *
 * @param {Genkin} genkin - The monetary amount to divide
 * @param {number} divisor - The number to divide by (must be finite and non-zero)
 * @returns {Genkin} A new Genkin instance with the divided amount
 *
 * @throws {Error} When divisor is not a finite number (NaN or Infinity)
 * @throws {Error} When divisor is zero
 *
 * @example
 * ```typescript
 * import { genkin, divide } from '@genkin/core';
 *
 * const price = genkin(12.34, { currency: 'USD' });
 * const half = divide(price, 2);
 *
 * console.log(half.amount); // 6.17
 * ```
 *
 * @example
 * ```typescript
 * // Divide by decimal
 * const amount = genkin(10, { currency: 'USD' });
 * const result = divide(amount, 0.5);
 *
 * console.log(result.amount); // 20
 * ```
 *
 * @example
 * ```typescript
 * // Handles recurring decimals with rounding
 * const amount = genkin(10, { currency: 'USD' });
 * const third = divide(amount, 3);
 *
 * console.log(third.amount); // 3.33 (rounded to 2 decimal places)
 * ```
 */
export function divide(genkin: Genkin, divisor: number): Genkin {
	if (!Number.isFinite(divisor)) {
		throw new Error("Divisor must be a finite number");
	}

	if (divisor === 0) {
		throw new Error("Cannot divide by zero");
	}

	// Divide the minor units directly
	const resultUnits = Math.round(genkin.minorUnits / divisor);

	return new Genkin(resultUnits / 10 ** genkin.precision, {
		currency: genkin.currency,
		precision: genkin.precision,
		rounding: genkin.rounding,
	});
}

/**
 * Calculate the absolute value of a Genkin monetary amount.
 *
 * Returns a new Genkin instance with the absolute (non-negative) value of the
 * amount. For positive values and zero, returns the same instance (optimization).
 * For negative values, returns a new instance with the negated amount.
 *
 * @param {Genkin} genkin - The monetary amount to get absolute value of
 * @returns {Genkin} A Genkin instance with non-negative amount
 *
 * @example
 * ```typescript
 * import { genkin, abs } from '@genkin/core';
 *
 * const negative = genkin(-12.34, { currency: 'USD' });
 * const positive = abs(negative);
 *
 * console.log(positive.amount); // 12.34
 * ```
 *
 * @example
 * ```typescript
 * // Already positive values return the same instance
 * const amount = genkin(12.34, { currency: 'USD' });
 * const result = abs(amount);
 *
 * console.log(result === amount); // true (same instance)
 * console.log(result.amount); // 12.34
 * ```
 *
 * @example
 * ```typescript
 * // Zero returns the same instance
 * const zero = genkin(0, { currency: 'USD' });
 * const result = abs(zero);
 *
 * console.log(result === zero); // true
 * ```
 */
export function abs(genkin: Genkin): Genkin {
	if (genkin.minorUnits >= 0) {
		return genkin;
	}

	return new Genkin(Math.abs(genkin.amount), {
		currency: genkin.currency,
		precision: genkin.precision,
		rounding: genkin.rounding,
	});
}

/**
 * Negate a Genkin monetary amount (multiply by -1).
 *
 * Returns a new Genkin instance with the opposite sign. Positive amounts become
 * negative, negative amounts become positive, and zero becomes negative zero.
 * This operation is immutable.
 *
 * @param {Genkin} genkin - The monetary amount to negate
 * @returns {Genkin} A new Genkin instance with negated amount
 *
 * @example
 * ```typescript
 * import { genkin, negate } from '@genkin/core';
 *
 * const positive = genkin(12.34, { currency: 'USD' });
 * const negative = negate(positive);
 *
 * console.log(negative.amount); // -12.34
 * ```
 *
 * @example
 * ```typescript
 * // Negating negative values makes them positive
 * const negative = genkin(-12.34, { currency: 'USD' });
 * const positive = negate(negative);
 *
 * console.log(positive.amount); // 12.34
 * ```
 *
 * @example
 * ```typescript
 * // Useful for reversing transactions
 * const charge = genkin(100, { currency: 'USD' });
 * const refund = negate(charge);
 *
 * console.log(refund.amount); // -100
 * ```
 */
export function negate(genkin: Genkin): Genkin {
	return multiply(genkin, -1);
}

/**
 * Allocate a Genkin monetary amount across multiple ratios.
 *
 * Distributes a monetary amount proportionally according to the provided ratios,
 * ensuring that the sum of allocated amounts equals the original amount exactly.
 * Handles remainders (from rounding) by distributing them one unit at a time to
 * the first recipients, ensuring fair distribution without losing precision.
 *
 * Supports both simple number ratios (e.g., [25, 75] for 25% and 75%) and
 * scaled ratios for precise decimal percentages (e.g., { amount: 505, scale: 1 }
 * for 50.5%).
 *
 * @param {Genkin} genkin - The monetary amount to allocate
 * @param {AllocationRatio[]} ratios - Array of ratios defining the distribution
 * @returns {Genkin[]} Array of Genkin instances representing allocated amounts
 *
 * @throws {Error} When ratios array is empty
 * @throws {Error} When total ratio is zero (all ratios are zero)
 *
 * @example
 * ```typescript
 * import { genkin, allocate } from '@genkin/core';
 *
 * // Simple ratio allocation
 * const total = genkin(100, { currency: 'USD' });
 * const [first, second] = allocate(total, [25, 75]);
 *
 * console.log(first.amount);  // 25
 * console.log(second.amount); // 75
 * ```
 *
 * @example
 * ```typescript
 * // Split evenly with remainder distribution
 * const amount = genkin(10, { currency: 'USD' });
 * const parts = allocate(amount, [1, 1, 1]); // Split $10 three ways
 *
 * console.log(parts[0].amount); // 3.34
 * console.log(parts[1].amount); // 3.33
 * console.log(parts[2].amount); // 3.33
 * // Sum: 3.34 + 3.33 + 3.33 = 10.00 (exact)
 * ```
 *
 * @example
 * ```typescript
 * // Scaled ratios for precise percentages
 * const amount = genkin(100, { currency: 'USD' });
 * const parts = allocate(amount, [
 *   { amount: 505, scale: 1 },  // 50.5%
 *   { amount: 495, scale: 1 }   // 49.5%
 * ]);
 *
 * console.log(parts[0].amount); // 50.50
 * console.log(parts[1].amount); // 49.50
 * ```
 *
 * @example
 * ```typescript
 * // Zero ratios are allowed
 * const amount = genkin(100, { currency: 'USD' });
 * const parts = allocate(amount, [0, 50, 50]);
 *
 * console.log(parts[0].amount); // 0
 * console.log(parts[1].amount); // 50
 * console.log(parts[2].amount); // 50
 * ```
 *
 * @example
 * ```typescript
 * // Works with negative amounts
 * const debt = genkin(-100, { currency: 'USD' });
 * const parts = allocate(debt, [25, 75]);
 *
 * console.log(parts[0].amount); // -25
 * console.log(parts[1].amount); // -75
 * ```
 *
 * @example
 * ```typescript
 * // Percentage-based allocation
 * const revenue = genkin(1000, { currency: 'USD' });
 * const [partner1, partner2, partner3] = allocate(revenue, [40, 35, 25]);
 *
 * console.log(partner1.amount); // 400 (40%)
 * console.log(partner2.amount); // 350 (35%)
 * console.log(partner3.amount); // 250 (25%)
 * ```
 */
export function allocate(genkin: Genkin, ratios: AllocationRatio[]): Genkin[] {
	if (ratios.length === 0) {
		throw new Error("Ratios array cannot be empty");
	}

	// Convert all ratios to a common scale for calculation
	const normalizedRatios = normalizeRatios(ratios);
	const totalRatio = normalizedRatios.reduce((sum, ratio) => sum + ratio, 0);

	if (totalRatio === 0) {
		throw new Error("Total ratio cannot be zero");
	}

	// Work with minor units to avoid floating-point issues
	const totalMinorUnits = genkin.minorUnits;

	// Calculate base allocations
	const allocations: number[] = [];
	const remainders: number[] = [];
	let allocatedSum = 0;

	for (let i = 0; i < normalizedRatios.length; i++) {
		const ratio = normalizedRatios[i];

		if (ratio === 0) {
			// Zero ratios get zero allocation
			allocations.push(0);
			remainders.push(0);
		} else {
			// Calculate exact allocation (may have fractional part)
			const exactAllocation = (totalMinorUnits * ratio) / totalRatio;
			const baseAllocation = Math.floor(exactAllocation);
			const remainder = exactAllocation - baseAllocation;

			allocations.push(baseAllocation);
			remainders.push(remainder);
			allocatedSum += baseAllocation;
		}
	}

	// Distribute the remaining units (from first to last, matching original dinero.js behavior)
	let unallocatedUnits = totalMinorUnits - allocatedSum;
	let index = 0;

	while (unallocatedUnits > 0 && index < allocations.length) {
		// Only give remainder to non-zero ratios
		if (normalizedRatios[index] !== 0) {
			allocations[index] += 1;
			unallocatedUnits -= 1;
		}
		index++;
	}

	// Convert back to Genkin instances
	return allocations.map((units) => {
		const amount = units / 10 ** genkin.precision;
		return new Genkin(amount, {
			currency: genkin.currency,
			precision: genkin.precision,
			rounding: genkin.rounding,
		});
	});
}

/**
 * Normalize ratios to a common scale for calculation
 * Converts both simple numbers and scaled ratios to simple numbers
 */
function normalizeRatios(ratios: AllocationRatio[]): number[] {
	// Check if any ratios are scaled
	const hasScaledRatios = ratios.some((ratio) => typeof ratio === "object");

	if (!hasScaledRatios) {
		// All ratios are simple numbers
		return ratios as number[];
	}

	// Find the maximum scale to convert all ratios to the same precision
	let maxScale = 0;
	for (const ratio of ratios) {
		if (typeof ratio === "object") {
			maxScale = Math.max(maxScale, ratio.scale);
		}
	}

	// Convert all ratios to the same scale
	return ratios.map((ratio) => {
		if (typeof ratio === "number") {
			// Simple ratio - scale it up to match maxScale
			return ratio * 10 ** maxScale;
		} else {
			// Scaled ratio - convert to target scale
			const scaleDifference = maxScale - ratio.scale;
			return ratio.amount * 10 ** scaleDifference;
		}
	});
}

/**
 * Calculate a percentage of a Genkin monetary amount.
 *
 * Computes the specified percentage of the monetary amount. This is a convenience
 * function that multiplies the amount by (percentage / 100). Useful for calculating
 * discounts, taxes, tips, and other percentage-based operations.
 *
 * @param {Genkin} genkin - The monetary amount to calculate percentage of
 * @param {number} percentage - The percentage value (e.g., 15 for 15%)
 * @returns {Genkin} A new Genkin instance with the percentage amount
 *
 * @example
 * ```typescript
 * import { genkin, percentage } from '@genkin/core';
 *
 * const price = genkin(100, { currency: 'USD' });
 * const tax = percentage(price, 15); // 15% tax
 *
 * console.log(tax.amount); // 15
 * ```
 *
 * @example
 * ```typescript
 * // Calculate discount
 * const originalPrice = genkin(50, { currency: 'USD' });
 * const discount = percentage(originalPrice, 20); // 20% off
 *
 * console.log(discount.amount); // 10
 * ```
 *
 * @example
 * ```typescript
 * // Calculate tip
 * const bill = genkin(85.50, { currency: 'USD' });
 * const tip = percentage(bill, 18); // 18% tip
 *
 * console.log(tip.amount); // 15.39
 * ```
 */
export function percentage(genkin: Genkin, percentage: number): Genkin {
	return multiply(genkin, percentage / 100);
}

/**
 * Represents a conversion rate for currency exchange.
 *
 * Similar to ScaledRatio, this interface allows precise specification of exchange
 * rates using an amount and scale factor. For example, an exchange rate of 0.89
 * can be represented as `{ amount: 89, scale: 2 }` (89 / 10^2 = 0.89).
 *
 * @interface ConversionRate
 *
 * @example
 * ```typescript
 * // USD to EUR rate of 0.89
 * const rate: ConversionRate = { amount: 89, scale: 2 };
 *
 * // USD to JPY rate of 149.50
 * const jpyRate: ConversionRate = { amount: 14950, scale: 2 };
 * ```
 */
export interface ConversionRate {
	/** The numerator of the exchange rate */
	amount: number;
	/** The scale factor (power of 10 divisor) */
	scale: number;
}

/**
 * Transform a Genkin instance to a different scale (precision).
 *
 * Changes the precision (number of decimal places) of a monetary amount. This is
 * a convenience wrapper around the `convertPrecision` method. When increasing
 * precision, the amount is scaled up without loss. When decreasing precision,
 * rounding may occur.
 *
 * @param {Genkin} genkin - The monetary amount to transform
 * @param {number} targetScale - The target precision (number of decimal places)
 * @returns {Genkin} A new Genkin instance with the new precision
 *
 * @throws {Error} When targetScale is not a non-negative integer
 *
 * @example
 * ```typescript
 * import { genkin, transformScale } from '@genkin/core';
 *
 * // Increase precision
 * const amount = genkin(10.50, { currency: 'USD', precision: 2 });
 * const highPrecision = transformScale(amount, 4);
 *
 * console.log(highPrecision.precision); // 4
 * console.log(highPrecision.amount); // 10.50
 * ```
 *
 * @example
 * ```typescript
 * // Decrease precision (with rounding)
 * const precise = genkin(10.123, { currency: 'USD', precision: 3 });
 * const rounded = transformScale(precise, 2);
 *
 * console.log(rounded.precision); // 2
 * console.log(rounded.amount); // 10.12
 * ```
 */
export function transformScale(genkin: Genkin, targetScale: number): Genkin {
	return genkin.convertPrecision(targetScale);
}

/**
 * Convert a Genkin monetary amount to a different currency using an exchange rate.
 *
 * Performs currency conversion by applying the specified exchange rate. The rate
 * can be a simple number (e.g., 0.89) or a scaled rate for more precision
 * (e.g., { amount: 89, scale: 2 }). The result is a new Genkin instance in the
 * target currency with appropriate precision.
 *
 * Note: This function does not fetch live exchange rates - you must provide the
 * rate yourself.
 *
 * @param {Genkin} genkin - The source monetary amount to convert
 * @param {Object} newCurrency - The target currency configuration
 * @param {string} newCurrency.code - The target currency code (e.g., 'EUR')
 * @param {number} [newCurrency.base] - The currency base (default: 10)
 * @param {number} newCurrency.precision - The target currency precision
 * @param {number | ConversionRate} rate - The exchange rate
 * @returns {Genkin} A new Genkin instance in the target currency
 *
 * @example
 * ```typescript
 * import { genkin, convert } from '@genkin/core';
 *
 * // Simple rate conversion
 * const usd = genkin(5.00, { currency: 'USD' });
 * const eurConfig = { code: 'EUR', precision: 2 };
 * const eur = convert(usd, eurConfig, 0.89);
 *
 * console.log(eur.amount); // 4.45
 * console.log(eur.currencyCode); // "EUR"
 * ```
 *
 * @example
 * ```typescript
 * // Scaled rate for precision
 * const usd = genkin(5.00, { currency: 'USD' });
 * const eurConfig = { code: 'EUR', precision: 2 };
 * const eur = convert(usd, eurConfig, { amount: 89, scale: 2 });
 *
 * console.log(eur.amount); // 4.45
 * ```
 *
 * @example
 * ```typescript
 * // Convert to currency with different precision
 * const usd = genkin(100, { currency: 'USD', precision: 2 });
 * const jpy = convert(usd, { code: 'JPY', precision: 0 }, 149.50);
 *
 * console.log(jpy.amount); // 14950
 * console.log(jpy.precision); // 0
 * ```
 */
export function convert(
	genkin: Genkin,
	newCurrency: { code: string; base?: number; precision: number },
	rate: number | ConversionRate,
): Genkin {
	const sourceScale = genkin.precision;
	const destExponent = newCurrency.precision;
	// Get the currency's base (default to 10 for decimal currencies)
	const currencyBase = newCurrency.base ?? 10;

	let newAmount: number;
	let newScale: number;

	if (typeof rate === "object" && "amount" in rate) {
		// Scaled rate: { amount, scale }
		newAmount = genkin.minorUnits * rate.amount;
		newScale = sourceScale + rate.scale;
	} else {
		// Simple rate - use destination currency's exponent as scale
		newScale = destExponent;

		if (newScale > sourceScale) {
			// Scale up the amount
			const scaleDiff = newScale - sourceScale;
			const scaleFactor = currencyBase ** scaleDiff;
			newAmount = genkin.minorUnits * rate * scaleFactor;
		} else {
			// No scale adjustment needed
			newAmount = genkin.minorUnits * rate;
		}
	}

	// Create a minimal currency object for Genkin
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

	return new Genkin(newAmount, {
		currency: targetCurrency,
		precision: newScale,
		rounding: genkin.rounding,
		isMinorUnits: true,
	});
}

/**
 * Normalize the scale (precision) of multiple Genkin instances to the highest scale.
 *
 * Converts all monetary amounts in the array to use the same precision, which is
 * the highest precision found among all instances. This is useful when you need
 * to perform operations on amounts with different precisions. All instances must
 * have the same currency.
 *
 * @param {Genkin[]} genkins - Array of monetary amounts to normalize
 * @returns {Genkin[]} Array of Genkin instances all using the highest precision
 *
 * @example
 * ```typescript
 * import { genkin, normalizeScale } from '@genkin/core';
 *
 * const amounts = [
 *   genkin(10.5, { currency: 'USD', precision: 1 }),
 *   genkin(20.50, { currency: 'USD', precision: 2 }),
 *   genkin(30.123, { currency: 'USD', precision: 3 })
 * ];
 *
 * const normalized = normalizeScale(amounts);
 *
 * // All now have precision 3
 * console.log(normalized[0].precision); // 3
 * console.log(normalized[1].precision); // 3
 * console.log(normalized[2].precision); // 3
 *
 * console.log(normalized[0].amount); // 10.500
 * console.log(normalized[1].amount); // 20.500
 * console.log(normalized[2].amount); // 30.123
 * ```
 *
 * @example
 * ```typescript
 * // Empty array returns empty array
 * const result = normalizeScale([]);
 * console.log(result); // []
 * ```
 *
 * @example
 * ```typescript
 * // Single precision returns unchanged
 * const amounts = [
 *   genkin(10, { currency: 'USD', precision: 2 }),
 *   genkin(20, { currency: 'USD', precision: 2 })
 * ];
 *
 * const normalized = normalizeScale(amounts);
 * // All already have precision 2, so no change needed
 * ```
 */
export function normalizeScale(genkins: Genkin[]): Genkin[] {
	if (genkins.length === 0) {
		return [];
	}

	// Find the highest scale
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
