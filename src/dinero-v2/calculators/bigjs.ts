import Big from 'big.js';
import type { Calculator, BinaryOperation, UnaryOperation } from '../types.js';
import { ComparisonOperator } from '../types.js';


/**
 * Big.js calculator implementation for Dinero.js v2
 */
export const calculator: Calculator<Big> = {
  add: ((a: Big, b: Big): Big => a.add(b)) as BinaryOperation<Big>,

  compare: ((a: Big, b: Big): ComparisonOperator => {
    const comparison = a.cmp(b);
    if (comparison < 0) return ComparisonOperator.LT;
    if (comparison > 0) return ComparisonOperator.GT;
    return ComparisonOperator.EQ;
  }) as BinaryOperation<Big, ComparisonOperator>,

  decrement: ((value: Big): Big => value.minus(1)) as UnaryOperation<Big>,

  integerDivide: ((a: Big, b: Big): Big => {
    if (b.eq(0)) throw new Error('Division by zero');
    return a.div(b).round(0, 0); // Round down to nearest integer
  }) as BinaryOperation<Big>,

  increment: ((value: Big): Big => value.plus(1)) as UnaryOperation<Big>,

  modulo: ((a: Big, b: Big): Big => {
    if (b.eq(0)) throw new Error('Division by zero');
    return a.mod(b);
  }) as BinaryOperation<Big>,

  multiply: ((a: Big, b: Big): Big => a.mul(b)) as BinaryOperation<Big>,

  power: ((base: Big, exponent: Big): Big => {
    if (exponent.lt(0)) throw new Error('Negative exponent not supported');
    return base.pow(exponent.toNumber());
  }) as BinaryOperation<Big>,

  subtract: ((a: Big, b: Big): Big => a.minus(b)) as BinaryOperation<Big>,

  zero: (): Big => new Big(0),
};
