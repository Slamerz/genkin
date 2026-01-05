// Core Genkin class and factory (number-based, backward compatible)

// Calculator abstraction
export type {
	BinaryOperation,
	Calculator,
	UnaryOperation,
} from "./calculator.js";
export {
	bigintCalculator,
	ComparisonOperator,
	numberCalculator,
} from "./calculator.js";
// Currency types and utilities
export type { Currency, CurrencyCode, CurrencyConfig } from "./currency.js";
export {
	createCurrency,
	getCurrencyConfig,
	RoundingMode,
} from "./currency.js";
// Default currencies and configurations
export {
	DEFAULT_CURRENCIES,
	EUR,
	GBP,
	JPY,
	USD,
} from "./default-currencies.js";
// Generic Genkin factory and types
export { createGenkin, GenericGenkin } from "./factory.js";
export type { GenkinOptions } from "./genkin.js";
export { Genkin, genkin } from "./genkin.js";

// Precision utilities
export {
	applyRounding,
	fromMinorUnits,
	safeAdd,
	safeDivide,
	safeMultiply,
	safeSubtract,
	toMinorUnits,
} from "./precision.js";
// Currency registry
export {
	CurrencyRegistry,
	createCurrencyRegistry,
	currencyRegistry,
} from "./registry.js";
export type {
	CreateGenkinOptions,
	GenericAllocationRatio,
	GenericScaledRatio,
	GenkinFactory,
	GenkinInstance,
	GenkinOptions as GenericGenkinOptions,
} from "./types.js";
