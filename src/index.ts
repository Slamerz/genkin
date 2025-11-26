// Main entry point - exports core functionality for convenience
// Users can import from here or from specific modules

// Re-export core functionality (most common use case)
export { Genkin, genkin } from './core/genkin.js';
export type { GenkinOptions } from './core/genkin.js';
export type { CurrencyCode, CurrencyConfig } from './core/currency.js';
export { RoundingMode } from './core/currency.js';

// Re-export common operations for convenience
export {
  add,
  subtract,
  multiply,
  divide,
  allocate,
  equals,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  isZero,
  isPositive,
  isNegative,
} from './operations/index.js';

// Re-export allocation types for convenience
export type { ScaledRatio, AllocationRatio } from './operations/index.js';

// Module namespaces for those who prefer organized imports
export * as Core from './core/index.js';
export * as Operations from './operations/index.js';
export * as Currencies from './currencies/index.js';





