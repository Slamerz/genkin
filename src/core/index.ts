// Core Genkin class and factory
export { Genkin, genkin } from './genkin.js';
export type { GenkinOptions } from './genkin.js';

// Currency types and utilities
export type { CurrencyCode, CurrencyConfig } from './currency.js';
export { RoundingMode, DEFAULT_CURRENCIES, getCurrencyConfig } from './currency.js';

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