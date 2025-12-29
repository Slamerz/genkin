import type { Currency } from './currencies.js';

/**
 * Binary operation type for calculator operations
 */
export type BinaryOperation<TInput, TOutput = TInput> = (a: TInput, b: TInput) => TOutput;

/**
 * Unary operation type for calculator operations
 */
export type UnaryOperation<TInput, TOutput = TInput> = (value: TInput) => TOutput;

/**
 * Calculator interface for numeric operations
 */
export interface Calculator<TInput> {
  readonly add: BinaryOperation<TInput>;
  readonly compare: BinaryOperation<TInput, ComparisonOperator>;
  readonly decrement: UnaryOperation<TInput>;
  readonly integerDivide: BinaryOperation<TInput>;
  readonly increment: UnaryOperation<TInput>;
  readonly modulo: BinaryOperation<TInput>;
  readonly multiply: BinaryOperation<TInput>;
  readonly power: BinaryOperation<TInput>;
  readonly subtract: BinaryOperation<TInput>;
  readonly zero: () => TInput;
}

/**
 * Comparison operator enum
 */
export enum ComparisonOperator {
  LT = -1,
  EQ = 0,
  GT = 1
}

/**
 * Scaled amount with optional scale
 */
export interface ScaledAmount<TAmount> {
  readonly amount: TAmount;
  readonly scale?: TAmount;
}

/**
 * Rate type for currency conversion
 */
export type Rate<TAmount> = ScaledAmount<TAmount> | TAmount;

/**
 * Rates record for currency conversion
 */
export type Rates<TAmount> = Record<string, Rate<TAmount>>;

/**
 * Dinero options for creating instances
 */
export interface DineroOptions<TAmount> {
  readonly amount: TAmount;
  readonly currency: Currency<TAmount>;
  readonly scale?: TAmount;
}

/**
 * Dinero snapshot for serialization
 */
export interface DineroSnapshot<TAmount> {
  readonly amount: TAmount;
  readonly currency: Currency<TAmount>;
  readonly scale: TAmount;
}

/**
 * Formatter interface for output formatting
 */
export interface Formatter<TAmount> {
  readonly toNumber: (value?: TAmount) => number;
  readonly toString: (value?: TAmount) => string;
}

/**
 * Dinero instance interface
 */
export interface Dinero<TAmount> {
  readonly calculator: Calculator<TAmount>;
  readonly formatter: Formatter<TAmount>;
  readonly create: (options: DineroOptions<TAmount>) => Dinero<TAmount>;
  readonly toJSON: () => DineroSnapshot<TAmount>;
  readonly amount: TAmount;
  readonly currency: Currency<TAmount>;
  readonly scale: TAmount;
}

/**
 * Dinero factory function type
 */
export type DineroFactory<TAmount> = (options: DineroOptions<TAmount>) => Dinero<TAmount>;

/**
 * Create Dinero options
 */
export interface CreateDineroOptions<TAmount> {
  readonly calculator: Calculator<TAmount>;
  readonly formatter?: Formatter<TAmount>;
  readonly onCreate?: (options: DineroOptions<TAmount>) => void;
}

/**
 * Divide operation function type
 */
export type DivideOperation = <TAmount>(amount: TAmount, factor: TAmount, calculator: Calculator<TAmount>) => TAmount;

/**
 * Transformer function type
 */
export type Transformer<TAmount, TOutput, TValue> = (options: TransformerOptions<TAmount, TValue>) => TOutput;

/**
 * Transformer options
 */
export interface TransformerOptions<TAmount, TValue> {
  readonly value: TValue;
  readonly currency: Currency<TAmount>;
}

/**
 * Parameter types for API functions
 */
export type AddParams<TAmount> = readonly [augend: Dinero<TAmount>, addend: Dinero<TAmount>];
export type SubtractParams<TAmount> = readonly [minuend: Dinero<TAmount>, subtrahend: Dinero<TAmount>];
export type MultiplyParams<TAmount> = readonly [multiplicand: Dinero<TAmount>, multiplier: ScaledAmount<TAmount> | TAmount];
export type AllocateParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, ratios: ReadonlyArray<ScaledAmount<TAmount> | TAmount>];
export type CompareParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, comparator: Dinero<TAmount>];
export type EqualParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, comparator: Dinero<TAmount>];
export type GreaterThanParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, comparator: Dinero<TAmount>];
export type GreaterThanOrEqualParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, comparator: Dinero<TAmount>];
export type LessThanParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, comparator: Dinero<TAmount>];
export type LessThanOrEqualParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, comparator: Dinero<TAmount>];
export type IsZeroParams<TAmount> = readonly [dineroObject: Dinero<TAmount>];
export type IsPositiveParams<TAmount> = readonly [dineroObject: Dinero<TAmount>];
export type IsNegativeParams<TAmount> = readonly [dineroObject: Dinero<TAmount>];
export type HasSubUnitsParams<TAmount> = readonly [dineroObject: Dinero<TAmount>];
export type HaveSameAmountParams<TAmount> = readonly [dineroObjects: ReadonlyArray<Dinero<TAmount>>];
export type MaximumParams<TAmount> = readonly [dineroObjects: ReadonlyArray<Dinero<TAmount>>];
export type MinimumParams<TAmount> = readonly [dineroObjects: ReadonlyArray<Dinero<TAmount>>];
export type ConvertParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, newCurrency: Currency<TAmount>, rates: Rates<TAmount>];
export type NormalizeScaleParams<TAmount> = readonly [dineroObjects: ReadonlyArray<Dinero<TAmount>>];
export type TransformScaleParams<TAmount> = readonly [dineroObject: Dinero<TAmount>, newScale: TAmount, divide?: DivideOperation];
export type TrimScaleParams<TAmount> = readonly [dineroObject: Dinero<TAmount>];
export type ToDecimalParams<TAmount, TOutput> = readonly [dineroObject: Dinero<TAmount>, transformer?: Transformer<TAmount, TOutput, string>];
export type ToUnitsParams<TAmount, TOutput> = readonly [dineroObject: Dinero<TAmount>, transformer?: Transformer<TAmount, TOutput, readonly TAmount[]>];

/**
 * Error messages constants
 */
export const INVALID_AMOUNT_MESSAGE = "Amount is invalid.";
export const INVALID_RATIOS_MESSAGE = "Ratios are invalid.";
export const INVALID_SCALE_MESSAGE = "Scale is invalid.";
export const NON_DECIMAL_CURRENCY_MESSAGE = "Currency is not decimal.";
export const UNEQUAL_CURRENCIES_MESSAGE = "Objects must have the same currency.";
export const UNEQUAL_SCALES_MESSAGE = "Objects must have the same scale.";
