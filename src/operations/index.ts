// Arithmetic operations (number-based, backward compatible)
export {
  add,
  subtract,
  multiply,
  divide,
  abs,
  negate,
  allocate,
  transformScale,
  normalizeScale,
} from './arithmetic.js';

// Allocation types
export type {
  ScaledRatio,
  AllocationRatio,
} from './arithmetic.js';

// Comparison operations (number-based, backward compatible)
export {
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
} from './comparison.js';

// Generic operations factory (for custom types)
export {
  createArithmeticOperations,
  createComparisonOperations,
  createOperations,
} from './generic.js'; 