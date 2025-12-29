import { RoundingMode } from "./currency.js";

/**
 * Convert a decimal amount to integer minor units based on precision.
 *
 * Transforms a decimal monetary amount (e.g., dollars) into integer minor units
 * (e.g., cents) by multiplying by 10^precision and rounding. This conversion
 * avoids floating-point precision issues by working with integers internally.
 *
 * @param {number} amount - The decimal amount (e.g., 12.34 for $12.34)
 * @param {number} precision - Number of decimal places (e.g., 2 for cents)
 * @returns {number} Integer units (e.g., 1234 for $12.34)
 *
 * @example
 * ```typescript
 * import { toMinorUnits } from '@genkin/core';
 *
 * // Convert dollars to cents
 * const cents = toMinorUnits(12.34, 2);
 * console.log(cents); // 1234
 * ```
 *
 * @example
 * ```typescript
 * // High precision for cryptocurrency
 * const satoshis = toMinorUnits(0.5, 8);
 * console.log(satoshis); // 50000000
 * ```
 *
 * @example
 * ```typescript
 * // Zero precision (no sub-units)
 * const yen = toMinorUnits(1000, 0);
 * console.log(yen); // 1000
 * ```
 */
export function toMinorUnits(amount: number, precision: number): number {
	const factor = 10 ** precision;
	return Math.round(amount * factor);
}

/**
 * Convert integer minor units back to decimal amount.
 *
 * Transforms integer minor units (e.g., cents) back into a decimal monetary
 * amount (e.g., dollars) by dividing by 10^precision. This is the inverse
 * operation of toMinorUnits.
 *
 * @param {number} units - Integer units (e.g., 1234 for cents)
 * @param {number} precision - Number of decimal places (e.g., 2)
 * @returns {number} Decimal amount (e.g., 12.34 for dollars)
 *
 * @example
 * ```typescript
 * import { fromMinorUnits } from '@genkin/core';
 *
 * // Convert cents to dollars
 * const dollars = fromMinorUnits(1234, 2);
 * console.log(dollars); // 12.34
 * ```
 *
 * @example
 * ```typescript
 * // Convert satoshis to BTC
 * const btc = fromMinorUnits(50000000, 8);
 * console.log(btc); // 0.5
 * ```
 *
 * @example
 * ```typescript
 * // Zero precision (no conversion needed)
 * const yen = fromMinorUnits(1000, 0);
 * console.log(yen); // 1000
 * ```
 */
export function fromMinorUnits(units: number, precision: number): number {
	const factor = 10 ** precision;
	return units / factor;
}

/**
 * Apply a rounding mode to a numeric value.
 *
 * Rounds a number according to the specified rounding strategy. Different rounding
 * modes are appropriate for different financial contexts:
 * - ROUND_HALF_EVEN (banker's rounding) - minimizes bias in repeated rounding
 * - ROUND_HALF_UP - standard rounding taught in schools
 * - ROUND_DOWN - always rounds toward zero (useful for discounts)
 * - ROUND_UP - always rounds away from zero (useful for fees)
 *
 * @param {number} value - The value to round
 * @param {RoundingMode} mode - The rounding mode to apply
 * @returns {number} The rounded value
 *
 * @example
 * ```typescript
 * import { applyRounding, RoundingMode } from '@genkin/core';
 *
 * // Half-up rounding (standard)
 * console.log(applyRounding(2.5, RoundingMode.ROUND_HALF_UP)); // 3
 * console.log(applyRounding(2.4, RoundingMode.ROUND_HALF_UP)); // 2
 * ```
 *
 * @example
 * ```typescript
 * // Banker's rounding (half-even)
 * console.log(applyRounding(2.5, RoundingMode.ROUND_HALF_EVEN)); // 2 (even)
 * console.log(applyRounding(3.5, RoundingMode.ROUND_HALF_EVEN)); // 4 (even)
 * ```
 *
 * @example
 * ```typescript
 * // Always round down
 * console.log(applyRounding(2.9, RoundingMode.ROUND_DOWN)); // 2
 * console.log(applyRounding(-2.9, RoundingMode.ROUND_DOWN)); // -3
 * ```
 *
 * @example
 * ```typescript
 * // Always round up
 * console.log(applyRounding(2.1, RoundingMode.ROUND_UP)); // 3
 * console.log(applyRounding(-2.1, RoundingMode.ROUND_UP)); // -3
 * ```
 */
export function applyRounding(value: number, mode: RoundingMode): number {
	switch (mode) {
		case RoundingMode.ROUND_UP:
			return Math.ceil(value);

		case RoundingMode.ROUND_DOWN:
			return Math.floor(value);

		case RoundingMode.ROUND_TOWARDS_ZERO:
			return value >= 0 ? Math.floor(value) : Math.ceil(value);

		case RoundingMode.ROUND_AWAY_FROM_ZERO:
			return value >= 0 ? Math.ceil(value) : Math.floor(value);

		case RoundingMode.ROUND_HALF_UP:
			return Math.floor(value + 0.5);

		case RoundingMode.ROUND_HALF_DOWN:
			return Math.ceil(value - 0.5);

		case RoundingMode.ROUND_HALF_ODD: {
			// Round to nearest, ties to odd
			const roundedOdd = Math.round(value);
			const diffOdd = Math.abs(value - roundedOdd);

			if (diffOdd === 0.5) {
				return roundedOdd % 2 === 1
					? roundedOdd
					: value > roundedOdd
						? roundedOdd + 1
						: roundedOdd - 1;
			}

			return roundedOdd;
		}

		case RoundingMode.ROUND_HALF_TOWARDS_ZERO: {
			// Round to nearest, ties towards zero
			const roundedTowardsZero = Math.round(value);
			const diffTowardsZero = Math.abs(value - roundedTowardsZero);

			if (diffTowardsZero === 0.5) {
				return value >= 0 ? Math.floor(value) : Math.ceil(value);
			}

			return roundedTowardsZero;
		}

		case RoundingMode.ROUND_HALF_AWAY_FROM_ZERO: {
			// Round to nearest, ties away from zero
			const roundedAway = Math.round(value);
			const diffAway = Math.abs(value - roundedAway);

			if (diffAway === 0.5) {
				return value >= 0 ? Math.ceil(value) : Math.floor(value);
			}

			return roundedAway;
		}

		case RoundingMode.ROUND_HALF_EVEN:
		default: {
			// Banker's rounding - round to nearest even
			const rounded = Math.round(value);
			const diff = Math.abs(value - rounded);

			if (diff === 0.5) {
				return rounded % 2 === 0
					? rounded
					: value > rounded
						? rounded + 1
						: rounded - 1;
			}

			return rounded;
		}
	}
}

/**
 * Safely add two numbers.
 *
 * Performs addition of two numbers. This function exists for consistency with
 * the safe arithmetic API, though JavaScript addition doesn't typically have
 * precision issues when working with integers (minor units).
 *
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 *
 * @example
 * ```typescript
 * import { safeAdd } from '@genkin/core';
 *
 * const result = safeAdd(1050, 250);
 * console.log(result); // 1300
 * ```
 */
export function safeAdd(a: number, b: number): number {
	return a + b;
}

/**
 * Safely subtract two numbers.
 *
 * Performs subtraction of two numbers. This function exists for consistency with
 * the safe arithmetic API, though JavaScript subtraction doesn't typically have
 * precision issues when working with integers (minor units).
 *
 * @param {number} a - Number to subtract from
 * @param {number} b - Number to subtract
 * @returns {number} Difference of a and b
 *
 * @example
 * ```typescript
 * import { safeSubtract } from '@genkin/core';
 *
 * const result = safeSubtract(1050, 250);
 * console.log(result); // 800
 * ```
 */
export function safeSubtract(a: number, b: number): number {
	return a - b;
}

/**
 * Safely multiply with rounding for precision.
 *
 * Multiplies a monetary amount (in minor units) by a multiplier and applies
 * rounding according to the specified mode. Used internally for precise
 * multiplication operations.
 *
 * @param {number} a - Amount in minor units
 * @param {number} b - Multiplier
 * @param {number} precision - Number of decimal places (currently unused but kept for API consistency)
 * @param {RoundingMode} [rounding=RoundingMode.ROUND_HALF_EVEN] - Rounding mode to apply
 * @returns {number} Rounded result in minor units
 *
 * @example
 * ```typescript
 * import { safeMultiply, RoundingMode } from '@genkin/core';
 *
 * // Multiply 1050 cents by 1.5
 * const result = safeMultiply(1050, 1.5, 2, RoundingMode.ROUND_HALF_UP);
 * console.log(result); // 1575
 * ```
 */
export function safeMultiply(
	a: number,
	b: number,
	precision: number,
	rounding: RoundingMode = RoundingMode.ROUND_HALF_EVEN,
): number {
	// a is in minor units, b is the multiplier
	// Result should be in minor units
	const result = a * b;
	return Math.round(applyRounding(result, rounding));
}

/**
 * Safely divide with rounding for precision.
 *
 * Divides a monetary amount (in minor units) by a divisor and applies rounding
 * according to the specified mode. Used internally for precise division operations.
 *
 * @param {number} a - Amount in minor units
 * @param {number} b - Divisor
 * @param {number} precision - Number of decimal places (currently unused but kept for API consistency)
 * @param {RoundingMode} [rounding=RoundingMode.ROUND_HALF_EVEN] - Rounding mode to apply
 * @returns {number} Rounded result in minor units
 *
 * @throws {Error} When divisor is zero
 *
 * @example
 * ```typescript
 * import { safeDivide, RoundingMode } from '@genkin/core';
 *
 * // Divide 1050 cents by 2
 * const result = safeDivide(1050, 2, 2, RoundingMode.ROUND_HALF_UP);
 * console.log(result); // 525
 * ```
 */
export function safeDivide(
	a: number,
	b: number,
	precision: number,
	rounding: RoundingMode = RoundingMode.ROUND_HALF_EVEN,
): number {
	if (b === 0) {
		throw new Error("Division by zero");
	}

	// a is in minor units, b is the divisor
	// Result should be in minor units
	const result = a / b;
	return Math.round(applyRounding(result, rounding));
}
