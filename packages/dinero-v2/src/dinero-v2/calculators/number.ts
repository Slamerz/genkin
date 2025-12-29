import type { Calculator, BinaryOperation, UnaryOperation } from './types.js';
import { ComparisonOperator } from './types.js';

/**
 * Number calculator implementation for Dinero.js v2
 */
export const calculator: Calculator<number> = {
  add: ((a: number, b: number): number => a + b) as BinaryOperation<number>,

  compare: ((a: number, b: number): ComparisonOperator => {
    if (a < b) return ComparisonOperator.LT;
    if (a > b) return ComparisonOperator.GT;
    return ComparisonOperator.EQ;
  }) as BinaryOperation<number, ComparisonOperator>,

  decrement: ((value: number): number => value - 1) as UnaryOperation<number>,

  integerDivide: ((a: number, b: number): number => {
    if (b === 0) throw new Error('Division by zero');
    return Math.floor(a / b);
  }) as BinaryOperation<number>,

  increment: ((value: number): number => value + 1) as UnaryOperation<number>,

  modulo: ((a: number, b: number): number => {
    if (b === 0) throw new Error('Division by zero');
    return a % b;
  }) as BinaryOperation<number>,

  multiply: ((a: number, b: number): number => a * b) as BinaryOperation<number>,

  power: ((base: number, exponent: number): number => {
    if (exponent < 0) throw new Error('Negative exponent not supported');
    return Math.pow(base, exponent);
  }) as BinaryOperation<number>,

  subtract: ((a: number, b: number): number => a - b) as BinaryOperation<number>,

  zero: (): number => 0,
};
