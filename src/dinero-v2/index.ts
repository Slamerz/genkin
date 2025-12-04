// Dinero.js v2 Alpha - Genkin Wrapper
// Thin wrapper around Genkin core for dinero.js v2 compatibility
// Supports generic numeric types (number, bigint, custom types)

import { Genkin, genkin } from '../core/genkin.js';
import { Currency as GenkinCurrency, getCurrencyConfig, createCurrency } from '../core/currency.js';
import { createGenkin, GenericGenkin } from '../core/factory.js';
import { createArithmeticOperations, createComparisonOperations } from '../operations/generic.js';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate } from '../operations/arithmetic.js';
import { equals as genkinEquals, lessThan as genkinLessThan, greaterThan as genkinGreaterThan, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative, min as genkinMin, max as genkinMax } from '../operations/comparison.js';
import type { ScaledRatio, AllocationRatio } from '../operations/arithmetic.js';
import type { GenkinInstance, GenericAllocationRatio } from '../core/types.js';
import type { Calculator as GenkinCalculator } from '../core/calculator.js';
import type { Currency } from './currencies.js';
import { Calculator, Dinero, DineroOptions, DineroSnapshot, DineroFactory, CreateDineroOptions, ScaledAmount, Rates, ComparisonOperator } from './types.js';

/**
 * Assert function for validation
 */
export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Dinero.js] ${message}`);
  }
}

function toDineroCurrency<T>(currency: GenkinCurrency, scale: T, originalExponent?: T, convertToType?: (n: number) => T): Currency<T> {
  // For generic types, use the converter if provided
  const toT = convertToType ?? ((n: number) => n as unknown as T);
  return {
    code: currency.code,
    base: toT(currency.base ?? 10),
    // Use original exponent if provided, otherwise derive from currency precision
    exponent: originalExponent ?? toT(currency.precision),
  };
}

function toGenkinCurrency(currency: Currency<number>): GenkinCurrency {
  // Get the full currency config using the code
  const config = getCurrencyConfig(currency.code);
  return createCurrency(config);
}

/**
 * Generic Dinero wrapper class that works with any numeric type
 */
class GenericDineroWrapper<T> implements Dinero<T> {
  public readonly _genkin: GenkinInstance<T>;
  private readonly _calculator: GenkinCalculator<T>;
  public readonly _originalExponent: T;
  public readonly __isGenericDineroWrapper = true as const;

  constructor(genkin: GenkinInstance<T>, calculator: GenkinCalculator<T>, originalExponent?: T) {
    this._genkin = genkin;
    this._calculator = calculator;
    // Store original currency exponent (defaults to currency precision converted to type T)
    this._originalExponent = originalExponent ?? this._intToT(genkin.currency.precision);
  }

  /**
   * Convert an integer to type T using the calculator
   */
  private _intToT(n: number): T {
    let result = this._calculator.zero();
    for (let i = 0; i < Math.abs(n); i++) {
      result = this._calculator.increment(result);
    }
    if (n < 0) {
      result = this._calculator.subtract(this._calculator.zero(), result);
    }
    return result;
  }

  get calculator(): Calculator<T> {
    return this._calculator;
  }

  get formatter(): any {
    return {
      toNumber: () => Number(this._genkin.amount),
      toString: () => String(this._genkin.amount),
    };
  }

  get amount(): T {
    return this._genkin.minorUnits; // Dinero v2 returns amount in minor units
  }

  get currency(): Currency<T> {
    return toDineroCurrency(
      this._genkin.currency, 
      this._intToT(this._genkin.precision), 
      this._originalExponent,
      (n) => this._intToT(n)
    );
  }

  get scale(): T {
    return this._intToT(this._genkin.precision);
  }

  create(options: DineroOptions<T>): Dinero<T> {
    const genkinCurrency = toGenkinCurrency(options.currency as unknown as Currency<number>);
    const factory = createGenkin(this._calculator);
    const precision = options.scale !== undefined ? Number(options.scale) : Number(options.currency.exponent);
    const genkinInstance = factory(options.amount, {
      currency: genkinCurrency,
      precision,
      isMinorUnits: true,
    });
    return new GenericDineroWrapper(genkinInstance, this._calculator, options.currency.exponent);
  }

  toJSON(): DineroSnapshot<T> {
    return {
      amount: this._genkin.minorUnits,
      currency: toDineroCurrency(
        this._genkin.currency, 
        this._intToT(this._genkin.precision), 
        this._originalExponent,
        (n) => this._intToT(n)
      ),
      scale: this._intToT(this._genkin.precision),
    };
  }
}

/**
 * Dinero wrapper class that delegates to Genkin (number-based, backward compatible)
 */
class DineroWrapper implements Dinero<number> {
  public readonly _genkin: Genkin;
  public readonly __isDineroWrapper = true as const;

  constructor(genkin: Genkin) {
    this._genkin = genkin;
  }

  get calculator(): Calculator<number> {
    throw new Error('Calculator not accessible in wrapper mode');
  }

  get formatter(): any {
    throw new Error('Formatter not accessible in wrapper mode');
  }

  get amount(): number {
    return this._genkin.minorUnits; // Dinero v2 returns amount in minor units
  }

  get currency(): Currency<number> {
    return toDineroCurrency(this._genkin.currency, this._genkin.precision);
  }

  get scale(): number {
    return this._genkin.precision;
  }

  create(options: DineroOptions<number>): Dinero<number> {
    const genkinCurrency = toGenkinCurrency(options.currency);
    const genkinInstance = genkin(options.amount, {
      currency: genkinCurrency,
      precision: options.scale,
      isMinorUnits: true,
    });
    return new DineroWrapper(genkinInstance);
  }

  toJSON(): DineroSnapshot<number> {
    // In dinero.js V2, toJSON always returns amount in minor units
    return {
      amount: this._genkin.minorUnits,
      currency: toDineroCurrency(this._genkin.currency, this._genkin.precision),
      scale: this._genkin.precision,
    };
  }
}

/**
 * Create a Dinero factory for a specific numeric type
 * 
 * @param options - Configuration including calculator and optional callbacks
 * @returns A factory function that creates Dinero instances of that type
 * 
 * @example
 * ```typescript
 * import { createDinero } from 'genkin/dinero-v2';
 * import { bigintCalculator } from 'genkin';
 * 
 * const bigintDinero = createDinero({ calculator: bigintCalculator });
 * const price = bigintDinero({ amount: 1099n, currency: USD_BIGINT, scale: 2n });
 * ```
 */
export function createDinero<T>(options: CreateDineroOptions<T>): DineroFactory<T> {
  const { calculator, onCreate } = options;
  const genkinFactory = createGenkin(calculator);

  return (dineroOptions: DineroOptions<T>): Dinero<T> => {
    if (onCreate) {
      onCreate(dineroOptions);
    }

    const { amount, currency, scale } = dineroOptions;
    const genkinCurrency = toGenkinCurrency(currency as unknown as Currency<number>);
    // Convert scale/exponent to number - handles BigInt, Big.js, etc.
    const precision = scale !== undefined ? Number(scale) : Number(currency.exponent);

    const genkinInstance = genkinFactory(amount, {
      currency: genkinCurrency,
      precision,
      isMinorUnits: true,
    });

    // Pass the original currency exponent
    return new GenericDineroWrapper(genkinInstance, calculator, currency.exponent);
  };
}

/**
 * Create a Dinero object (main factory function - number-based, backward compatible)
 */
export function dinero(options: DineroOptions<number>): Dinero<number> {
  // Extract only the allowed properties to clean up unwanted ones
  const { amount, currency, scale } = options;

  // Validation
  assert(Number.isInteger(amount), 'Amount is invalid.');
  if (scale !== undefined) {
    assert(Number.isInteger(scale), 'Scale is invalid.');
  }

  // Convert to Genkin currency format
  const genkinCurrency = toGenkinCurrency(currency);

  // Create Genkin instance with amount in minor units (dinero.js V2 convention)
  const genkinInstance = genkin(amount, {
    currency: genkinCurrency,
    precision: scale ?? currency.exponent,
    isMinorUnits: true,
  });

  // Wrap in Dinero-compatible interface
  return new DineroWrapper(genkinInstance);
}

/**
 * Get a snapshot of a Dinero object
 */
export function toSnapshot<T>(dineroObject: Dinero<T>): DineroSnapshot<T> {
  return dineroObject.toJSON();
}

// Type guards for duck typing
function isDineroWrapper(obj: any): obj is DineroWrapper {
  return obj && obj.__isDineroWrapper === true && obj._genkin;
}

function isGenericDineroWrapper(obj: any): boolean {
  return obj && obj.__isGenericDineroWrapper === true && obj._genkin;
}

/**
 * Add two Dinero objects
 * Supports both number-based DineroWrapper and generic GenericDineroWrapper
 */
export function add<T>(augend: Dinero<T>, addend: Dinero<T>): Dinero<T> {
  // Handle number-based DineroWrapper
  if (isDineroWrapper(augend) && isDineroWrapper(addend)) {
    const result = genkinAdd(augend._genkin, addend._genkin);
    return new DineroWrapper(result) as unknown as Dinero<T>;
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(augend) && isGenericDineroWrapper(addend)) {
    const augendWrapper = augend as GenericDineroWrapper<T>;
    const addendWrapper = addend as GenericDineroWrapper<T>;
    const calculator = augendWrapper._genkin.calculator;
    const ops = createArithmeticOperations(calculator);
    const result = ops.add(augendWrapper._genkin, addendWrapper._genkin);
    // Preserve the original currency exponent
    return new GenericDineroWrapper(result, calculator, augendWrapper._originalExponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero objects');
}

/**
 * Subtract two Dinero objects
 */
export function subtract<T>(minuend: Dinero<T>, subtrahend: Dinero<T>): Dinero<T> {
  if (isDineroWrapper(minuend) && isDineroWrapper(subtrahend)) {
    const result = genkinSubtract(minuend._genkin, subtrahend._genkin);
    return new DineroWrapper(result) as unknown as Dinero<T>;
  }

  if (isGenericDineroWrapper(minuend) && isGenericDineroWrapper(subtrahend)) {
    const minuendWrapper = minuend as GenericDineroWrapper<T>;
    const subtrahendWrapper = subtrahend as GenericDineroWrapper<T>;
    const calculator = minuendWrapper._genkin.calculator;
    const ops = createArithmeticOperations(calculator);
    const result = ops.subtract(minuendWrapper._genkin, subtrahendWrapper._genkin);
    return new GenericDineroWrapper(result, calculator, minuendWrapper._originalExponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero objects');
}

/**
 * Multiply a Dinero object by a multiplier
 */
export function multiply<T>(multiplicand: Dinero<T>, multiplier: T): Dinero<T> {
  if (isDineroWrapper(multiplicand)) {
    const result = genkinMultiply(multiplicand._genkin, multiplier as number);
    return new DineroWrapper(result) as unknown as Dinero<T>;
  }

  if (isGenericDineroWrapper(multiplicand)) {
    const multiplicandWrapper = multiplicand as GenericDineroWrapper<T>;
    const calculator = multiplicandWrapper._genkin.calculator;
    const ops = createArithmeticOperations(calculator);
    const result = ops.multiply(multiplicandWrapper._genkin, multiplier);
    return new GenericDineroWrapper(result, calculator, multiplicandWrapper._originalExponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Allocate a Dinero amount across ratios
 */
export function allocate<T>(dineroObject: Dinero<T>, ratios: (T | { amount: T; scale: number })[]): Dinero<T>[] {
  if (isDineroWrapper(dineroObject)) {
    const results = genkinAllocate(dineroObject._genkin, ratios as AllocationRatio[]);
    return results.map(result => new DineroWrapper(result)) as unknown as Dinero<T>[];
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const exponent = dineroWrapper._originalExponent;
    const ops = createArithmeticOperations(calculator);
    const results = ops.allocate(dineroWrapper._genkin, ratios as GenericAllocationRatio<T>[]);
    return results.map(result => new GenericDineroWrapper(result, calculator, exponent)) as Dinero<T>[];
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Compare two Dinero objects
 */
export function compare<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): ComparisonOperator {
  if (isDineroWrapper(dineroObject) && isDineroWrapper(comparator)) {
    const result = genkinLessThan(dineroObject._genkin, comparator._genkin) ? ComparisonOperator.LT :
                   genkinGreaterThan(dineroObject._genkin, comparator._genkin) ? ComparisonOperator.GT :
                   ComparisonOperator.EQ;
    return result;
  }

  if (isGenericDineroWrapper(dineroObject) && isGenericDineroWrapper(comparator)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const comparatorWrapper = comparator as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const ops = createComparisonOperations(calculator);
    if (ops.lessThan(dineroWrapper._genkin, comparatorWrapper._genkin)) return ComparisonOperator.LT;
    if (ops.greaterThan(dineroWrapper._genkin, comparatorWrapper._genkin)) return ComparisonOperator.GT;
    return ComparisonOperator.EQ;
  }

  throw new Error('Invalid Dinero objects');
}

/**
 * Check if two Dinero objects are equal
 */
export function equal<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): boolean {
  return compare(dineroObject, comparator) === ComparisonOperator.EQ;
}

/**
 * Check if the first Dinero is greater than the second
 */
export function greaterThan<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): boolean {
  return compare(dineroObject, comparator) === ComparisonOperator.GT;
}

/**
 * Check if the first Dinero is greater than or equal to the second
 */
export function greaterThanOrEqual<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): boolean {
  const comparison = compare(dineroObject, comparator);
  return comparison === ComparisonOperator.GT || comparison === ComparisonOperator.EQ;
}

/**
 * Check if the first Dinero is less than the second
 */
export function lessThan<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): boolean {
  return compare(dineroObject, comparator) === ComparisonOperator.LT;
}

/**
 * Check if the first Dinero is less than or equal to the second
 */
export function lessThanOrEqual<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): boolean {
  const comparison = compare(dineroObject, comparator);
  return comparison === ComparisonOperator.LT || comparison === ComparisonOperator.EQ;
}

/**
 * Check if a Dinero object is zero
 */
export function isZero<T>(dineroObject: Dinero<T>): boolean {
  if (isDineroWrapper(dineroObject)) {
    return genkinIsZero(dineroObject._genkin);
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const ops = createComparisonOperations(calculator);
    return ops.isZero(dineroWrapper._genkin);
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Check if a Dinero object is positive
 */
export function isPositive<T>(dineroObject: Dinero<T>): boolean {
  if (isDineroWrapper(dineroObject)) {
    return genkinIsPositive(dineroObject._genkin);
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const ops = createComparisonOperations(calculator);
    return ops.isPositive(dineroWrapper._genkin);
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Check if a Dinero object is negative
 */
export function isNegative<T>(dineroObject: Dinero<T>): boolean {
  if (isDineroWrapper(dineroObject)) {
    return genkinIsNegative(dineroObject._genkin);
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const ops = createComparisonOperations(calculator);
    return ops.isNegative(dineroWrapper._genkin);
  }

  throw new Error('Invalid Dinero object');
}

// Export rounding functions for compatibility
export {
  down,
  up,
  halfUp,
  halfDown,
  halfEven,
  halfOdd,
  halfAwayFromZero,
  halfTowardsZero,
} from './divide/index.js';

// Export types for compatibility
export type {
  Calculator,
  Dinero,
  DineroOptions,
  DineroSnapshot,
  DineroFactory,
  CreateDineroOptions,
  ScaledAmount,
  Rates,
  ComparisonOperator,
} from './types.js';

// Export calculators for generic usage
export { 
  numberCalculator, 
  bigintCalculator,
  bigjsCalculator 
} from '../core/calculator.js';

// Export currencies
export * from './currencies.js';

// Export generic operations factory
export { 
  createArithmeticOperations, 
  createComparisonOperations, 
  createOperations 
} from '../operations/generic.js';
