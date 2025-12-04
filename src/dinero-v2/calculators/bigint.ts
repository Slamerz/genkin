import type { Calculator, BinaryOperation, UnaryOperation } from '../types.js';
import { ComparisonOperator } from '../types.js';

/**
 * BigInt calculator implementation for Dinero.js v2
 */
export const calculator: Calculator<bigint> = {
  add: ((a: bigint, b: bigint): bigint => a + b) as BinaryOperation<bigint>,

  compare: ((a: bigint, b: bigint): ComparisonOperator => {
    if (a < b) return ComparisonOperator.LT;
    if (a > b) return ComparisonOperator.GT;
    return ComparisonOperator.EQ;
  }) as BinaryOperation<bigint, ComparisonOperator>,

  decrement: ((value: bigint): bigint => value - 1n) as UnaryOperation<bigint>,

  integerDivide: ((a: bigint, b: bigint): bigint => {
    if (b === 0n) throw new Error('Division by zero');
    return a / b;
  }) as BinaryOperation<bigint>,

  increment: ((value: bigint): bigint => value + 1n) as UnaryOperation<bigint>,

  modulo: ((a: bigint, b: bigint): bigint => {
    if (b === 0n) throw new Error('Division by zero');
    return a % b;
  }) as BinaryOperation<bigint>,

  multiply: ((a: bigint, b: bigint): bigint => a * b) as BinaryOperation<bigint>,

  power: ((base: bigint, exponent: bigint): bigint => {
    if (exponent < 0n) throw new Error('Negative exponent not supported');
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

  subtract: ((a: bigint, b: bigint): bigint => a - b) as BinaryOperation<bigint>,

  zero: (): bigint => 0n,
};
