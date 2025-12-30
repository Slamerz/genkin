import Big from 'big.js';
import type { Calculator } from '@genkin/dinero-v2';
import { ComparisonOperator } from '@genkin/core';

/**
 * Big.js calculator for tests.
 * Created in the test suite to ensure there's only one Big.js instance.
 */
export const bigjsCalculator: Calculator<Big> = {
  add: (a: Big, b: Big): Big => a.add(b),

  compare: (a: Big, b: Big): ComparisonOperator => {
    const comparison = a.cmp(b);
    if (comparison < 0) return ComparisonOperator.LT;
    if (comparison > 0) return ComparisonOperator.GT;
    return ComparisonOperator.EQ;
  },

  decrement: (value: Big): Big => value.minus(1),

  integerDivide: (a: Big, b: Big): Big => {
    if (b.eq(0)) throw new Error('Division by zero');
    return a.div(b).round(0, 0); // Round down to nearest integer
  },

  increment: (value: Big): Big => value.plus(1),

  modulo: (a: Big, b: Big): Big => {
    if (b.eq(0)) throw new Error('Division by zero');
    return a.mod(b);
  },

  multiply: (a: Big, b: Big): Big => a.mul(b),

  power: (base: Big, exponent: Big): Big => {
    if (exponent.lt(0)) throw new Error('Negative exponent not supported');
    return base.pow(exponent.toNumber());
  },

  subtract: (a: Big, b: Big): Big => a.minus(b),

  zero: (): Big => new Big(0),
};

