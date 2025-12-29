import type { Genkin } from "../core/genkin.js";

/**
 * Check if two Genkin monetary amounts are equal.
 *
 * Compares two monetary amounts for equality. Returns true only if both amounts
 * have the same currency and the same value (accounting for different precisions).
 * If currencies differ, returns false without throwing an error.
 *
 * @param {Genkin} a - The first monetary amount
 * @param {Genkin} b - The second monetary amount
 * @returns {boolean} True if amounts are equal, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, equals } from '@genkin/core';
 *
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(12.34, { currency: 'USD' });
 *
 * console.log(equals(a, b)); // true
 * ```
 *
 * @example
 * ```typescript
 * // Handles different precisions correctly
 * const a = genkin(12.34, { currency: 'USD', precision: 2 });
 * const b = genkin(12.340, { currency: 'USD', precision: 3 });
 *
 * console.log(equals(a, b)); // true (same value)
 * ```
 *
 * @example
 * ```typescript
 * // Different currencies return false
 * const usd = genkin(12.34, { currency: 'USD' });
 * const eur = genkin(12.34, { currency: 'EUR' });
 *
 * console.log(equals(usd, eur)); // false
 * ```
 *
 * @example
 * ```typescript
 * // Works with negative values
 * const a = genkin(-12.34, { currency: 'USD' });
 * const b = genkin(-12.34, { currency: 'USD' });
 *
 * console.log(equals(a, b)); // true
 * ```
 */
export function equals(a: Genkin, b: Genkin): boolean {
	if (!a.hasSameCurrency(b)) {
		return false;
	}

	// Compare at the higher precision level
	const maxPrecision = Math.max(a.precision, b.precision);
	const aUnits = a.minorUnits * 10 ** (maxPrecision - a.precision);
	const bUnits = b.minorUnits * 10 ** (maxPrecision - b.precision);

	return aUnits === bUnits;
}

/**
 * Check if the first Genkin monetary amount is less than the second.
 *
 * Compares two monetary amounts and returns true if the first is strictly less
 * than the second. Both amounts must have the same currency. Handles different
 * precisions correctly by normalizing to the higher precision before comparison.
 *
 * @param {Genkin} a - The first monetary amount
 * @param {Genkin} b - The second monetary amount
 * @returns {boolean} True if a < b, false otherwise
 *
 * @throws {Error} When the two amounts have different currencies
 *
 * @example
 * ```typescript
 * import { genkin, lessThan } from '@genkin/core';
 *
 * const small = genkin(5.67, { currency: 'USD' });
 * const large = genkin(12.34, { currency: 'USD' });
 *
 * console.log(lessThan(small, large)); // true
 * console.log(lessThan(large, small)); // false
 * ```
 *
 * @example
 * ```typescript
 * // Equal amounts return false
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(12.34, { currency: 'USD' });
 *
 * console.log(lessThan(a, b)); // false
 * ```
 *
 * @example
 * ```typescript
 * // Works with negative values
 * const a = genkin(-10, { currency: 'USD' });
 * const b = genkin(-5, { currency: 'USD' });
 *
 * console.log(lessThan(a, b)); // true (-10 < -5)
 * ```
 */
export function lessThan(a: Genkin, b: Genkin): boolean {
	if (!a.hasSameCurrency(b)) {
		throw new Error(
			`Cannot compare different currencies: ${a.currencyCode} and ${b.currencyCode}`,
		);
	}

	// Compare at the higher precision level
	const maxPrecision = Math.max(a.precision, b.precision);
	const aUnits = a.minorUnits * 10 ** (maxPrecision - a.precision);
	const bUnits = b.minorUnits * 10 ** (maxPrecision - b.precision);

	return aUnits < bUnits;
}

/**
 * Check if the first Genkin monetary amount is less than or equal to the second.
 *
 * Compares two monetary amounts and returns true if the first is less than or
 * equal to the second. Both amounts must have the same currency.
 *
 * @param {Genkin} a - The first monetary amount
 * @param {Genkin} b - The second monetary amount
 * @returns {boolean} True if a <= b, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, lessThanOrEqual } from '@genkin/core';
 *
 * const a = genkin(5.67, { currency: 'USD' });
 * const b = genkin(12.34, { currency: 'USD' });
 * const c = genkin(5.67, { currency: 'USD' });
 *
 * console.log(lessThanOrEqual(a, b)); // true (5.67 < 12.34)
 * console.log(lessThanOrEqual(a, c)); // true (5.67 == 5.67)
 * console.log(lessThanOrEqual(b, a)); // false (12.34 > 5.67)
 * ```
 */
export function lessThanOrEqual(a: Genkin, b: Genkin): boolean {
	return lessThan(a, b) || equals(a, b);
}

/**
 * Check if the first Genkin monetary amount is greater than the second.
 *
 * Compares two monetary amounts and returns true if the first is strictly greater
 * than the second. Both amounts must have the same currency. Handles different
 * precisions correctly by normalizing to the higher precision before comparison.
 *
 * @param {Genkin} a - The first monetary amount
 * @param {Genkin} b - The second monetary amount
 * @returns {boolean} True if a > b, false otherwise
 *
 * @throws {Error} When the two amounts have different currencies
 *
 * @example
 * ```typescript
 * import { genkin, greaterThan } from '@genkin/core';
 *
 * const large = genkin(12.34, { currency: 'USD' });
 * const small = genkin(5.67, { currency: 'USD' });
 *
 * console.log(greaterThan(large, small)); // true
 * console.log(greaterThan(small, large)); // false
 * ```
 *
 * @example
 * ```typescript
 * // Equal amounts return false
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(12.34, { currency: 'USD' });
 *
 * console.log(greaterThan(a, b)); // false
 * ```
 */
export function greaterThan(a: Genkin, b: Genkin): boolean {
	if (!a.hasSameCurrency(b)) {
		throw new Error(
			`Cannot compare different currencies: ${a.currencyCode} and ${b.currencyCode}`,
		);
	}

	// Compare at the higher precision level
	const maxPrecision = Math.max(a.precision, b.precision);
	const aUnits = a.minorUnits * 10 ** (maxPrecision - a.precision);
	const bUnits = b.minorUnits * 10 ** (maxPrecision - b.precision);

	return aUnits > bUnits;
}

/**
 * Check if the first Genkin monetary amount is greater than or equal to the second.
 *
 * Compares two monetary amounts and returns true if the first is greater than or
 * equal to the second. Both amounts must have the same currency.
 *
 * @param {Genkin} a - The first monetary amount
 * @param {Genkin} b - The second monetary amount
 * @returns {boolean} True if a >= b, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, greaterThanOrEqual } from '@genkin/core';
 *
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(5.67, { currency: 'USD' });
 * const c = genkin(12.34, { currency: 'USD' });
 *
 * console.log(greaterThanOrEqual(a, b)); // true (12.34 > 5.67)
 * console.log(greaterThanOrEqual(a, c)); // true (12.34 == 12.34)
 * console.log(greaterThanOrEqual(b, a)); // false (5.67 < 12.34)
 * ```
 */
export function greaterThanOrEqual(a: Genkin, b: Genkin): boolean {
	return greaterThan(a, b) || equals(a, b);
}

/**
 * Check if a Genkin monetary amount is zero.
 *
 * Returns true if the amount is exactly zero, false otherwise. This check is
 * performed on the internal minor units representation for precision.
 *
 * @param {Genkin} genkin - The monetary amount to check
 * @returns {boolean} True if the amount is zero, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, isZero } from '@genkin/core';
 *
 * const zero = genkin(0, { currency: 'USD' });
 * const nonZero = genkin(10, { currency: 'USD' });
 *
 * console.log(isZero(zero)); // true
 * console.log(isZero(nonZero)); // false
 * ```
 *
 * @example
 * ```typescript
 * // Useful for conditional logic
 * const balance = genkin(0, { currency: 'USD' });
 *
 * if (isZero(balance)) {
 *   console.log('Account is empty');
 * }
 * ```
 */
export function isZero(genkin: Genkin): boolean {
	return genkin.minorUnits === 0;
}

/**
 * Check if a Genkin monetary amount is positive (>= 0).
 *
 * Returns true if the amount is greater than or equal to zero. Note that zero
 * is considered positive in this implementation.
 *
 * @param {Genkin} genkin - The monetary amount to check
 * @returns {boolean} True if the amount is >= 0, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, isPositive } from '@genkin/core';
 *
 * const positive = genkin(10, { currency: 'USD' });
 * const zero = genkin(0, { currency: 'USD' });
 * const negative = genkin(-10, { currency: 'USD' });
 *
 * console.log(isPositive(positive)); // true
 * console.log(isPositive(zero)); // true
 * console.log(isPositive(negative)); // false
 * ```
 */
export function isPositive(genkin: Genkin): boolean {
	return genkin.minorUnits >= 0;
}

/**
 * Check if a Genkin monetary amount is negative (< 0).
 *
 * Returns true if the amount is strictly less than zero.
 *
 * @param {Genkin} genkin - The monetary amount to check
 * @returns {boolean} True if the amount is < 0, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, isNegative } from '@genkin/core';
 *
 * const negative = genkin(-10, { currency: 'USD' });
 * const zero = genkin(0, { currency: 'USD' });
 * const positive = genkin(10, { currency: 'USD' });
 *
 * console.log(isNegative(negative)); // true
 * console.log(isNegative(zero)); // false
 * console.log(isNegative(positive)); // false
 * ```
 *
 * @example
 * ```typescript
 * // Useful for debt/credit logic
 * const balance = genkin(-50, { currency: 'USD' });
 *
 * if (isNegative(balance)) {
 *   console.log('Account is overdrawn');
 * }
 * ```
 */
export function isNegative(genkin: Genkin): boolean {
	return genkin.minorUnits < 0;
}

/**
 * Find the minimum monetary amount from a set of Genkin instances.
 *
 * Returns the Genkin instance with the smallest value. All instances must have
 * the same currency. The actual instance (not a copy) is returned.
 *
 * @param {...Genkin} genkins - One or more monetary amounts to compare
 * @returns {Genkin} The Genkin instance with the minimum value
 *
 * @throws {Error} When called with no arguments (empty array)
 *
 * @example
 * ```typescript
 * import { genkin, min } from '@genkin/core';
 *
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(5.67, { currency: 'USD' });
 * const c = genkin(8.90, { currency: 'USD' });
 *
 * const minimum = min(a, b, c);
 * console.log(minimum.amount); // 5.67
 * console.log(minimum === b); // true (returns actual instance)
 * ```
 *
 * @example
 * ```typescript
 * // Works with two values
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(5.67, { currency: 'USD' });
 *
 * const minimum = min(a, b);
 * console.log(minimum.amount); // 5.67
 * ```
 *
 * @example
 * ```typescript
 * // Single value returns itself
 * const amount = genkin(12.34, { currency: 'USD' });
 * const result = min(amount);
 *
 * console.log(result === amount); // true
 * ```
 *
 * @example
 * ```typescript
 * // Handles negative values
 * const a = genkin(5, { currency: 'USD' });
 * const b = genkin(-10, { currency: 'USD' });
 * const c = genkin(15, { currency: 'USD' });
 *
 * const minimum = min(a, b, c);
 * console.log(minimum.amount); // -10
 * ```
 */
export function min(...genkins: Genkin[]): Genkin {
	if (genkins.length === 0) {
		throw new Error("Cannot find minimum of empty array");
	}

	if (genkins.length === 1) {
		return genkins[0];
	}

	return genkins.reduce((min, current) => {
		return lessThan(current, min) ? current : min;
	});
}

/**
 * Find the maximum monetary amount from a set of Genkin instances.
 *
 * Returns the Genkin instance with the largest value. All instances must have
 * the same currency. The actual instance (not a copy) is returned.
 *
 * @param {...Genkin} genkins - One or more monetary amounts to compare
 * @returns {Genkin} The Genkin instance with the maximum value
 *
 * @throws {Error} When called with no arguments (empty array)
 *
 * @example
 * ```typescript
 * import { genkin, max } from '@genkin/core';
 *
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(5.67, { currency: 'USD' });
 * const c = genkin(8.90, { currency: 'USD' });
 *
 * const maximum = max(a, b, c);
 * console.log(maximum.amount); // 12.34
 * console.log(maximum === a); // true (returns actual instance)
 * ```
 *
 * @example
 * ```typescript
 * // Works with two values
 * const a = genkin(12.34, { currency: 'USD' });
 * const b = genkin(5.67, { currency: 'USD' });
 *
 * const maximum = max(a, b);
 * console.log(maximum.amount); // 12.34
 * ```
 *
 * @example
 * ```typescript
 * // Single value returns itself
 * const amount = genkin(12.34, { currency: 'USD' });
 * const result = max(amount);
 *
 * console.log(result === amount); // true
 * ```
 *
 * @example
 * ```typescript
 * // Handles negative values
 * const a = genkin(5, { currency: 'USD' });
 * const b = genkin(-10, { currency: 'USD' });
 * const c = genkin(15, { currency: 'USD' });
 *
 * const maximum = max(a, b, c);
 * console.log(maximum.amount); // 15
 * ```
 */
export function max(...genkins: Genkin[]): Genkin {
	if (genkins.length === 0) {
		throw new Error("Cannot find maximum of empty array");
	}

	if (genkins.length === 1) {
		return genkins[0];
	}

	return genkins.reduce((max, current) => {
		return greaterThan(current, max) ? current : max;
	});
}

/**
 * Check if a Genkin monetary amount has sub-units (fractional parts).
 *
 * Determines whether the amount has fractional components based on the currency's
 * base and precision. For decimal currencies (base 10), this checks if there are
 * cents, pence, or other minor units. For non-decimal currencies, it checks if
 * the amount is not a whole unit.
 *
 * The check is performed by testing if the minor units are divisible by
 * base^precision. If not divisible, there are sub-units present.
 *
 * Note: This function works with single-base currencies. For multi-base currencies
 * (like old British pounds with shillings and pence), use the Dinero v2 wrapper.
 *
 * @param {Genkin} genkin - The monetary amount to check
 * @returns {boolean} True if the amount has sub-units, false otherwise
 *
 * @example
 * ```typescript
 * import { genkin, hasSubUnits } from '@genkin/core';
 *
 * // Amount with cents
 * const withCents = genkin(11.50, { currency: 'USD' });
 * console.log(hasSubUnits(withCents)); // true
 *
 * // Whole dollar amount
 * const wholeDollars = genkin(11.00, { currency: 'USD' });
 * console.log(hasSubUnits(wholeDollars)); // false
 * ```
 *
 * @example
 * ```typescript
 * // With higher precision
 * const precise = genkin(1.100, { currency: 'USD', precision: 3 });
 * console.log(hasSubUnits(precise)); // true (has fractional millis)
 * ```
 *
 * @example
 * ```typescript
 * // Zero precision currency (like JPY)
 * const yen = genkin(1000, { currency: 'JPY', precision: 0 });
 * console.log(hasSubUnits(yen)); // false (no sub-units in JPY)
 * ```
 */
export function hasSubUnits(genkin: Genkin): boolean {
	const minorUnits = genkin.minorUnits;
	const precision = genkin.precision;
	const currencyBase = genkin.currency.base ?? 10;

	// For decimal currencies, check if minorUnits has fractional parts at the current precision
	// This means checking if minorUnits is not divisible by base^precision
	const divisor = currencyBase ** precision;
	return minorUnits % divisor !== 0;
}
