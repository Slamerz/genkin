// Main entry point - exports core functionality for convenience
// Users can import from here or from specific modules

// Re-export core functionality (most common use case)
export { Genkin, genkin } from './core/genkin.js';
export type { GenkinOptions } from './core/genkin.js';
export type { CurrencyCode, CurrencyConfig, Currency } from './core/currency.js';
export { RoundingMode, createCurrency, getCurrencyConfig } from './core/currency.js';

// Re-export currency registry
export { CurrencyRegistry, currencyRegistry, createCurrencyRegistry } from './core/registry.js';

// Re-export precision utilities
export {
  toMinorUnits,
  fromMinorUnits,
  applyRounding,
  safeAdd,
  safeSubtract,
  safeMultiply,
  safeDivide,
} from './core/precision.js';

// Generic Genkin factory - for custom numeric types
export { createGenkin, GenericGenkin } from './core/factory.js';
export type {
  GenkinInstance,
  GenkinFactory,
  CreateGenkinOptions,
  GenericScaledRatio,
  GenericAllocationRatio,
} from './core/types.js';

// Calculator abstraction - for implementing custom numeric types
export type { Calculator, BinaryOperation, UnaryOperation } from './core/calculator.js';
export { ComparisonOperator, numberCalculator, bigintCalculator } from './core/calculator.js';
// bigjsCalculator removed - users should create their own to avoid constructor mismatch issues

// Re-export common operations for convenience (number-based)
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
  convert,
  equals,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  isZero,
  isPositive,
  isNegative,
  hasSubUnits,
  min,
  max,
} from './operations/index.js';

// Generic operations factory - for custom numeric types
export {
  createArithmeticOperations,
  createComparisonOperations,
  createOperations,
} from './operations/generic.js';

// Re-export allocation types for convenience
export type { ScaledRatio, AllocationRatio } from './operations/index.js';

// Module namespaces for those who prefer organized imports
export * as Core from './core/index.js';
export * as Operations from './operations/index.js';