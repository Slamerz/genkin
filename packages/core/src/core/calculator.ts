import Big from "big.js";

/**
 * Binary operation type for calculator operations
 */
export type BinaryOperation<TInput, TOutput = TInput> = (
	a: TInput,
	b: TInput,
) => TOutput;

/**
 * Unary operation type for calculator operations
 */
export type UnaryOperation<TInput, TOutput = TInput> = (
	value: TInput,
) => TOutput;

/**
 * Calculator interface for numeric operations
 *
 * This is the core abstraction that enables generic type support in Genkin.
 * Implement this interface to add support for custom numeric types.
 *
 * @typeParam TInput - The numeric type (e.g., number, bigint, Big)
 *
 * @example
 * ```typescript
 * import { Calculator, createGenkin } from 'genkin';
 * import Decimal from 'decimal.js';
 *
 * const decimalCalculator: Calculator<Decimal> = {
 *   add: (a, b) => a.plus(b),
 *   subtract: (a, b) => a.minus(b),
 *   multiply: (a, b) => a.times(b),
 *   integerDivide: (a, b) => a.dividedToIntegerBy(b),
 *   modulo: (a, b) => a.mod(b),
 *   power: (a, b) => a.pow(b),
 *   compare: (a, b) => a.comparedTo(b) as ComparisonOperator,
 *   increment: (a) => a.plus(1),
 *   decrement: (a) => a.minus(1),
 *   zero: () => new Decimal(0),
 * };
 *
 * const decimalGenkin = createGenkin(decimalCalculator);
 * ```
 */
export interface Calculator<TInput> {
	/** Add two values */
	readonly add: BinaryOperation<TInput>;
	/** Compare two values, returning -1, 0, or 1 */
	readonly compare: BinaryOperation<TInput, ComparisonOperator>;
	/** Decrement a value by 1 */
	readonly decrement: UnaryOperation<TInput>;
	/** Integer division (floor) */
	readonly integerDivide: BinaryOperation<TInput>;
	/** Increment a value by 1 */
	readonly increment: UnaryOperation<TInput>;
	/** Modulo operation */
	readonly modulo: BinaryOperation<TInput>;
	/** Multiply two values */
	readonly multiply: BinaryOperation<TInput>;
	/** Raise to a power */
	readonly power: BinaryOperation<TInput>;
	/** Subtract two values */
	readonly subtract: BinaryOperation<TInput>;
	/** Return the zero value for this type */
	readonly zero: () => TInput;
}

/**
 * Comparison operator enum
 * Used as the return type for calculator.compare()
 */
export enum ComparisonOperator {
	/** Less than */
	LT = -1,
	/** Equal */
	EQ = 0,
	/** Greater than */
	GT = 1,
}

/**
 * Number calculator implementation.
 *
 * Standard calculator for JavaScript's built-in number type. This is the default
 * calculator used by the standard Genkin class. Suitable for most monetary
 * calculations with reasonable precision requirements (up to ~15 significant digits).
 *
 * Note: JavaScript numbers are IEEE 754 double-precision floating-point, which can
 * have precision issues with very large numbers or many decimal places. For higher
 * precision requirements, consider using bigintCalculator or bigjsCalculator.
 *
 * @example
 * ```typescript
 * import { createGenkin, numberCalculator } from '@genkin/core';
 *
 * const genkin = createGenkin(numberCalculator);
 * const amount = genkin(10.50, { currency: 'USD' });
 * ```
 */
export const numberCalculator: Calculator<number> = {
	add: ((a: number, b: number): number => a + b) as BinaryOperation<number>,

	compare: ((a: number, b: number): ComparisonOperator => {
		if (a < b) return ComparisonOperator.LT;
		if (a > b) return ComparisonOperator.GT;
		return ComparisonOperator.EQ;
	}) as BinaryOperation<number, ComparisonOperator>,

	decrement: ((value: number): number => value - 1) as UnaryOperation<number>,

	integerDivide: ((a: number, b: number): number => {
		if (b === 0) throw new Error("Division by zero");
		return Math.floor(a / b);
	}) as BinaryOperation<number>,

	increment: ((value: number): number => value + 1) as UnaryOperation<number>,

	modulo: ((a: number, b: number): number => {
		if (b === 0) throw new Error("Division by zero");
		return a % b;
	}) as BinaryOperation<number>,

	multiply: ((a: number, b: number): number =>
		a * b) as BinaryOperation<number>,

	power: ((base: number, exponent: number): number => {
		if (exponent < 0) throw new Error("Negative exponent not supported");
		return base ** exponent;
	}) as BinaryOperation<number>,

	subtract: ((a: number, b: number): number =>
		a - b) as BinaryOperation<number>,

	zero: (): number => 0,
};

/**
 * BigInt calculator implementation.
 *
 * Calculator for JavaScript's built-in BigInt type, which provides arbitrary-precision
 * integer arithmetic. Ideal for financial calculations requiring exact precision without
 * floating-point errors, especially for large monetary amounts or cryptocurrencies.
 *
 * BigInt can represent integers of any size (limited only by memory), making it perfect
 * for high-value transactions, precise accounting, or working with currencies that have
 * many decimal places.
 *
 * @example
 * ```typescript
 * import { createGenkin, bigintCalculator } from '@genkin/core';
 *
 * const genkin = createGenkin(bigintCalculator);
 *
 * // Create amount with BigInt (1050 cents = $10.50)
 * const amount = genkin(1050n, {
 *   currency: 'USD',
 *   precision: 2,
 *   isMinorUnits: true
 * });
 *
 * console.log(amount.amount); // 10n
 * console.log(amount.minorUnits); // 1050n
 * ```
 *
 * @example
 * ```typescript
 * // Perfect for cryptocurrency with high precision
 * const btcGenkin = createGenkin(bigintCalculator);
 * const btc = btcGenkin(50000000n, {
 *   currency: 'BTC',
 *   precision: 8,
 *   isMinorUnits: true
 * });
 *
 * console.log(btc.amount); // 0n (in BTC, but BigInt can't represent decimals)
 * console.log(btc.minorUnits); // 50000000n (satoshis)
 * ```
 */
export const bigintCalculator: Calculator<bigint> = {
	add: ((a: bigint, b: bigint): bigint => a + b) as BinaryOperation<bigint>,

	compare: ((a: bigint, b: bigint): ComparisonOperator => {
		if (a < b) return ComparisonOperator.LT;
		if (a > b) return ComparisonOperator.GT;
		return ComparisonOperator.EQ;
	}) as BinaryOperation<bigint, ComparisonOperator>,

	decrement: ((value: bigint): bigint => value - 1n) as UnaryOperation<bigint>,

	integerDivide: ((a: bigint, b: bigint): bigint => {
		if (b === 0n) throw new Error("Division by zero");
		return a / b;
	}) as BinaryOperation<bigint>,

	increment: ((value: bigint): bigint => value + 1n) as UnaryOperation<bigint>,

	modulo: ((a: bigint, b: bigint): bigint => {
		if (b === 0n) throw new Error("Division by zero");
		return a % b;
	}) as BinaryOperation<bigint>,

	multiply: ((a: bigint, b: bigint): bigint =>
		a * b) as BinaryOperation<bigint>,

	power: ((base: bigint, exponent: bigint): bigint => {
		if (exponent < 0n) throw new Error("Negative exponent not supported");
		let result = 1n;
		let currentBase = base;
		let currentExponent = exponent;

		while (currentExponent > 0n) {
			if (currentExponent % 2n === 1n) {
				result *= currentBase;
			}
			currentBase *= currentBase;
			currentExponent /= 2n;
		}

		return result;
	}) as BinaryOperation<bigint>,

	subtract: ((a: bigint, b: bigint): bigint =>
		a - b) as BinaryOperation<bigint>,

	zero: (): bigint => 0n,
};

/**
 * Big.js calculator implementation.
 *
 * Calculator for the Big.js library, which provides arbitrary-precision decimal
 * arithmetic. Ideal for financial calculations requiring exact decimal representation
 * and high precision. Unlike BigInt, Big.js can represent decimal fractions exactly.
 *
 * Big.js is particularly useful for:
 * - Financial calculations with many decimal places
 * - Situations where floating-point errors are unacceptable
 * - Working with percentages and decimal multipliers
 * - Scientific or engineering calculations with monetary values
 *
 * @example
 * ```typescript
 * import Big from 'big.js';
 * import { createGenkin, bigjsCalculator } from '@genkin/core';
 *
 * const genkin = createGenkin(bigjsCalculator);
 *
 * // Create amount with Big.js
 * const amount = genkin(new Big('10.50'), {
 *   currency: 'USD',
 *   precision: 2
 * });
 *
 * console.log(amount.amount.toString()); // "10.5"
 * ```
 *
 * @example
 * ```typescript
 * // Perfect for precise decimal calculations
 * const genkin = createGenkin(bigjsCalculator);
 * const price = genkin(new Big('0.1'), { currency: 'USD' });
 * const tax = genkin(new Big('0.2'), { currency: 'USD' });
 *
 * // No floating-point errors!
 * const total = add(price, tax);
 * console.log(total.amount.toString()); // "0.3" (not 0.30000000000000004)
 * ```
 */
export const bigjsCalculator: Calculator<Big> = {
	add: ((a: Big, b: Big): Big => a.add(b)) as BinaryOperation<Big>,

	compare: ((a: Big, b: Big): ComparisonOperator => {
		const comparison = a.cmp(b);
		if (comparison < 0) return ComparisonOperator.LT;
		if (comparison > 0) return ComparisonOperator.GT;
		return ComparisonOperator.EQ;
	}) as BinaryOperation<Big, ComparisonOperator>,

	decrement: ((value: Big): Big => value.minus(1)) as UnaryOperation<Big>,

	integerDivide: ((a: Big, b: Big): Big => {
		if (b.eq(0)) throw new Error("Division by zero");
		return a.div(b).round(0, 0); // Round down to nearest integer
	}) as BinaryOperation<Big>,

	increment: ((value: Big): Big => value.plus(1)) as UnaryOperation<Big>,

	modulo: ((a: Big, b: Big): Big => {
		if (b.eq(0)) throw new Error("Division by zero");
		return a.mod(b);
	}) as BinaryOperation<Big>,

	multiply: ((a: Big, b: Big): Big => a.mul(b)) as BinaryOperation<Big>,

	power: ((base: Big, exponent: Big): Big => {
		if (exponent.lt(0)) throw new Error("Negative exponent not supported");
		return base.pow(exponent.toNumber());
	}) as BinaryOperation<Big>,

	subtract: ((a: Big, b: Big): Big => a.minus(b)) as BinaryOperation<Big>,

	zero: (): Big => new Big(0),
};
