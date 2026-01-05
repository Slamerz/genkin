// Main entry point - exports core functionality for convenience
// Users can import from here or from specific modules

// Calculator abstraction - for implementing custom numeric types
export type {
	BinaryOperation,
	Calculator,
	UnaryOperation,
} from "./core/calculator.js";
export {
	bigintCalculator,
	ComparisonOperator,
	numberCalculator,
} from "./core/calculator.js";
export type {
	Currency,
	CurrencyCode,
	CurrencyConfig,
	CurrencyFormatOptions,
} from "./core/currency.js";
export {
	createCurrency,
	getCurrencyConfig,
	RoundingMode,
} from "./core/currency.js";
export {
	DEFAULT_CURRENCIES,
	EUR,
	GBP,
	JPY,
	USD,
} from "./core/default-currencies.js";
// Generic Genkin factory - for custom numeric types
export { createGenkin, GenericGenkin } from "./core/factory.js";
export type { GenkinOptions } from "./core/genkin.js";
// Re-export core functionality (most common use case)
export { Genkin, genkin } from "./core/genkin.js";
// Re-export precision utilities
export {
	applyRounding,
	fromMinorUnits,
	safeAdd,
	safeDivide,
	safeMultiply,
	safeSubtract,
	toMinorUnits,
} from "./core/precision.js";
// Re-export currency registry
export {
	CurrencyRegistry,
	createCurrencyRegistry,
	currencyRegistry,
} from "./core/registry.js";
export type {
	CreateGenkinOptions,
	GenericAllocationRatio,
	GenericScaledRatio,
	GenkinFactory,
	GenkinInstance,
} from "./core/types.js";

// bigjsCalculator removed - users should create their own to avoid constructor mismatch issues

// Module namespaces for those who prefer organized imports
export * as Core from "./core/index.js";

// Generic operations factory - for custom numeric types
export {
	createArithmeticOperations,
	createComparisonOperations,
	createOperations,
} from "./operations/generic.js";

// Re-export allocation types for convenience
export type { AllocationRatio, ScaledRatio } from "./operations/index.js";
export * as Operations from "./operations/index.js";
// Re-export common operations for convenience (number-based)
export {
	abs,
	add,
	allocate,
	convert,
	divide,
	equals,
	greaterThan,
	greaterThanOrEqual,
	hasSubUnits,
	isNegative,
	isPositive,
	isZero,
	lessThan,
	lessThanOrEqual,
	max,
	min,
	multiply,
	negate,
	normalizeScale,
	subtract,
	transformScale,
} from "./operations/index.js";
