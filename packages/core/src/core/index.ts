// Core Genkin class and factory (number-based, backward compatible)
export { Genkin, genkin } from './genkin.js';
export type { GenkinOptions } from './genkin.js';

// Generic Genkin factory and types
export { createGenkin, GenericGenkin } from './factory.js';
export type {
  GenkinInstance,
  GenkinFactory,
  GenkinOptions as GenericGenkinOptions,
  CreateGenkinOptions,
  GenericScaledRatio,
  GenericAllocationRatio,
} from './types.js';

// Currency types and utilities
export type { CurrencyCode, CurrencyConfig } from './currency.js';
export { RoundingMode, DEFAULT_CURRENCIES, getCurrencyConfig } from './currency.js';

// Currency registry
export { CurrencyRegistry, currencyRegistry, createCurrencyRegistry } from './registry.js';

// Precision utilities
export {
  toMinorUnits,
  fromMinorUnits,
  applyRounding,
  safeAdd,
  safeSubtract,
  safeMultiply,
  safeDivide,
} from './precision.js';

// Calculator abstraction
export type {
  Calculator,
  BinaryOperation,
  UnaryOperation,
} from './calculator.js';

export {
  ComparisonOperator,
  numberCalculator,
} from './calculator.js'; 