// Dinero.js v2 Alpha - Genkin Wrapper
// Thin wrapper around Genkin core for dinero.js v2 compatibility
// Supports generic numeric types (number, bigint, custom types)

import { Genkin, genkin } from '../core/genkin.js';
import { Currency as GenkinCurrency, CurrencyConfig, getCurrencyConfig, createCurrency } from '../core/currency.js';
import { createGenkin, GenericGenkin } from '../core/factory.js';
import { createArithmeticOperations, createComparisonOperations } from '../operations/generic.js';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate, convert as genkinConvert, normalizeScale as genkinNormalizeScale, transformScale as genkinTransformScale } from '../operations/arithmetic.js';
import { equals as genkinEquals, lessThan as genkinLessThan, greaterThan as genkinGreaterThan, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative, min as genkinMin, max as genkinMax } from '../operations/comparison.js';
import type { ScaledRatio, AllocationRatio } from '../operations/arithmetic.js';
import type { GenkinInstance, GenericAllocationRatio } from '../core/types.js';
import type { Calculator as GenkinCalculator } from '../core/calculator.js';
import type { Currency } from './currencies.js';
import { Calculator, Dinero, DineroOptions, DineroSnapshot, DineroFactory, CreateDineroOptions, ScaledAmount, Rates, ComparisonOperator, DivideOperation } from './types.js';
import { down, up, halfUp, halfDown, halfEven, halfOdd, halfAwayFromZero, halfTowardsZero } from './divide/index.js';

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
  // Use the provided currency properties, but get additional details from registry if needed
  const config = getCurrencyConfig(currency.code);

  // Extract base as a number (handle case where it might be an array or any numeric type)
  let base: number | undefined;
  if (Array.isArray(currency.base)) {
    // For array base, convert the first element to number
    base = Number(currency.base[0]);
  } else if (currency.base !== undefined) {
    // Convert any numeric type (number, bigint, Big.js) to number
    base = Number(currency.base);
  } else {
    base = config.base;
  }

  // Extract exponent as a number (handle any numeric type)
  let precision: number;
  if (currency.exponent !== undefined) {
    precision = Number(currency.exponent);
  } else {
    precision = config.precision;
  }

  // Merge the provided currency properties with registry config
  const mergedConfig: CurrencyConfig = {
    ...config,
    code: currency.code,
    base,
    precision,
  };
  return createCurrency(mergedConfig);
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
  assert(augend.currency.code === addend.currency.code, 'Objects must have the same currency.');
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
  assert(minuend.currency.code === subtrahend.currency.code, 'Objects must have the same currency.');
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
export function multiply<T>(multiplicand: Dinero<T>, multiplier: ScaledAmount<T> | T): Dinero<T> {
  if (isDineroWrapper(multiplicand)) {
    // For number-based wrapper, handle scaled multiplier
    if (typeof multiplier === 'object' && multiplier !== null && 'amount' in multiplier) {
      const scaled = multiplier as ScaledAmount<number>;
      const multiplierAmount = scaled.amount as number;
      const multiplierScale = scaled.scale ?? 0;

      // Calculate new precision: multiplicand precision + multiplier scale
      const newPrecision = multiplicand._genkin.precision + multiplierScale;

      // Multiply minor units directly, then adjust precision
      const resultMinorUnits = multiplicand._genkin.minorUnits * multiplierAmount;

      const result = new Genkin(resultMinorUnits / Math.pow(10, newPrecision), {
        currency: multiplicand._genkin.currency,
        precision: newPrecision,
        rounding: multiplicand._genkin.rounding,
      });

      return new DineroWrapper(result) as unknown as Dinero<T>;
    } else {
      // Simple multiplier
      const result = genkinMultiply(multiplicand._genkin, multiplier as number);
      return new DineroWrapper(result) as unknown as Dinero<T>;
    }
  }

  if (isGenericDineroWrapper(multiplicand)) {
    const multiplicandWrapper = multiplicand as GenericDineroWrapper<T>;
    const calculator = multiplicandWrapper._genkin.calculator;
    const ops = createArithmeticOperations(calculator);
    
    // Convert ScaledAmount<T> to GenericScaledRatio<T> if needed
    let convertedMultiplier: T | { amount: T; scale: number };
    if (typeof multiplier === 'object' && multiplier !== null && 'amount' in multiplier) {
      const scaled = multiplier as ScaledAmount<T>;
      convertedMultiplier = {
        amount: scaled.amount,
        scale: scaled.scale !== undefined ? scaleToNumber(scaled.scale) : 0,
      };
    } else {
      convertedMultiplier = multiplier as T;
    }
    
    const result = ops.multiply(multiplicandWrapper._genkin, convertedMultiplier);
    return new GenericDineroWrapper(result, calculator, multiplicandWrapper._originalExponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Helper to extract amount and scale from a ratio (either T or { amount: T; scale: T })
 */
function getAmountAndScale<T>(
  ratio: T | { amount: T; scale: T },
  zero: T
): { amount: T; scale: T } {
  if (typeof ratio === 'object' && ratio !== null && 'amount' in ratio) {
    const scaled = ratio as { amount: T; scale: T };
    return { amount: scaled.amount, scale: scaled.scale ?? zero };
  }
  return { amount: ratio as T, scale: zero };
}

/**
 * Convert a scale value to a number (handles number, bigint, Big.js, etc.)
 */
function scaleToNumber<T>(scale: T): number {
  if (typeof scale === 'number') return scale;
  if (typeof scale === 'bigint') return Number(scale);
  if (typeof scale === 'object' && scale !== null && 'toNumber' in scale) {
    return (scale as any).toNumber();
  }
  return Number(scale);
}

/**
 * Allocate a Dinero amount across ratios
 */
export function allocate<T>(dineroObject: Dinero<T>, ratios: (T | { amount: T; scale: T })[]): Dinero<T>[] {
  const hasRatios = ratios.length > 0;
  
  if (isDineroWrapper(dineroObject)) {
    // Number-based wrapper
    const zero = 0;
    const ten = 10;
    // Get the currency's base (default to 10 for decimal currencies)
    const currencyBase = dineroObject._genkin.currency.base ?? 10;
    
    // Get amount and scale for each ratio
    const scaledRatios = ratios.map((ratio) => 
      getAmountAndScale(ratio as number | { amount: number; scale: number }, zero)
    );
    
    // Find highest ratio scale
    const highestRatioScale = hasRatios
      ? Math.max(...scaledRatios.map(({ scale }) => scale as number))
      : zero;
    
    // Normalize all ratios to the same scale (using base 10 for ratios)
    const normalizedRatios = scaledRatios.map(({ amount, scale }) => {
      const factor = scale === highestRatioScale
        ? zero
        : highestRatioScale - (scale as number);
      
      return {
        amount: (amount as number) * Math.pow(ten, factor),
        scale,
      };
    });
    
    // Validate using the normalized ratios
    const hasOnlyPositiveRatios = normalizedRatios.every(({ amount }) => amount >= 0);
    const hasOneNonZeroRatio = normalizedRatios.some(({ amount }) => amount > 0);
    const condition = hasRatios && hasOnlyPositiveRatios && hasOneNonZeroRatio;
    assert(condition, 'Ratios are invalid.');
    
    // Get current scale and calculate new scale
    const { scale: currentScale } = dineroObject.toJSON() as DineroSnapshot<number>;
    const newScale = currentScale + highestRatioScale;
    
    // Convert dinero to new scale before allocation (using currency's base)
    const scaleFactor = Math.pow(currencyBase, highestRatioScale);
    const newAmount = dineroObject._genkin.minorUnits * scaleFactor;
    
    const scaledGenkin = genkin(newAmount, {
      currency: dineroObject._genkin.currency,
      precision: newScale,
      isMinorUnits: true,
    });
    
    // Allocate using the normalized ratios (just the amounts)
    const results = genkinAllocate(scaledGenkin, normalizedRatios.map(r => r.amount) as AllocationRatio[]);
    return results.map(result => new DineroWrapper(result)) as unknown as Dinero<T>[];
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const exponent = dineroWrapper._originalExponent;
    const ops = createArithmeticOperations(calculator);
    
    // Get zero and ten for this calculator
    const zero = calculator.zero();
    let ten = calculator.zero();
    for (let i = 0; i < 10; i++) {
      ten = calculator.increment(ten);
    }
    
    // Get the currency's base (default to 10 for decimal currencies)
    const currencyBaseNum = dineroWrapper._genkin.currency.base ?? 10;
    let currencyBase = calculator.zero();
    for (let i = 0; i < currencyBaseNum; i++) {
      currencyBase = calculator.increment(currencyBase);
    }
    
    // Get amount and scale for each ratio
    const scaledRatios = ratios.map((ratio) => getAmountAndScale(ratio, zero));
    
    // Find highest ratio scale (need to convert to numbers for comparison)
    const scaleNumbers = scaledRatios.map(({ scale }) => scaleToNumber(scale));
    const highestRatioScaleNum = hasRatios ? Math.max(...scaleNumbers) : 0;
    
    // Convert highest scale back to type T
    let highestRatioScale = calculator.zero();
    for (let i = 0; i < highestRatioScaleNum; i++) {
      highestRatioScale = calculator.increment(highestRatioScale);
    }
    
    // Normalize all ratios to the same scale (using base 10 for ratios)
    const normalizedRatios = scaledRatios.map(({ amount, scale }) => {
      const scaleNum = scaleToNumber(scale);
      const factorNum = highestRatioScaleNum - scaleNum;
      
      let factor = calculator.zero();
      for (let i = 0; i < factorNum; i++) {
        factor = calculator.increment(factor);
      }
      
      const multiplier = calculator.power(ten, factor);
      return {
        amount: calculator.multiply(amount, multiplier),
        scale,
      };
    });
    
    // Validate using the calculator's comparison functions
    const hasOnlyPositiveRatios = normalizedRatios.every(({ amount }) => 
      calculator.compare(amount, zero) >= 0
    );
    const hasOneNonZeroRatio = normalizedRatios.some(({ amount }) => 
      calculator.compare(amount, zero) > 0
    );
    const condition = hasRatios && hasOnlyPositiveRatios && hasOneNonZeroRatio;
    assert(condition, 'Ratios are invalid.');
    
    // Get current scale and calculate new scale
    const currentScaleNum = dineroWrapper._genkin.precision;
    const newScaleNum = currentScaleNum + highestRatioScaleNum;
    
    // Convert dinero to new scale before allocation (using currency's base)
    const scaleMultiplier = calculator.power(currencyBase, highestRatioScale);
    const newAmount = calculator.multiply(dineroWrapper._genkin.minorUnits, scaleMultiplier);
    
    const scaledGenkin = new GenericGenkin(newAmount, calculator, {
      currency: dineroWrapper._genkin.currency,
      precision: newScaleNum,
      rounding: dineroWrapper._genkin.rounding,
      isMinorUnits: true,
    });
    
    // Allocate using the normalized ratios (just the amounts)
    const results = ops.allocate(scaledGenkin, normalizedRatios.map(r => r.amount));
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

/**
 * Convert a Dinero object to a different currency
 * 
 * @param dineroObject - The source Dinero object
 * @param newCurrency - The target currency
 * @param rates - Object containing exchange rates, keyed by currency code
 * @returns A new Dinero object in the target currency
 * 
 * @example
 * ```typescript
 * const d = dinero({ amount: 500, currency: USD });
 * 
 * // With scaled rate
 * const converted = convert(d, EUR, { EUR: { amount: 89, scale: 2 } });
 * // Result: { amount: 44500, currency: EUR, scale: 4 }
 * 
 * // With simple rate
 * const converted = convert(d, IQD, { IQD: 1199 });
 * // Result: { amount: 5995000, currency: IQD, scale: 3 }
 * ```
 */
export function convert<T>(
  dineroObject: Dinero<T>,
  newCurrency: Currency<T>,
  rates: Rates<T>
): Dinero<T> {
  const rate = rates[newCurrency.code];
  
  if (rate === undefined) {
    throw new Error(`[Dinero.js] No rate provided for currency ${newCurrency.code}`);
  }

  if (isDineroWrapper(dineroObject)) {
    // Number-based wrapper
    const numericRate = rate as number | { amount: number; scale: number };
    const targetCurrencyConfig = {
      code: newCurrency.code,
      base: typeof newCurrency.base === 'number' ? newCurrency.base : 10,
      precision: typeof newCurrency.exponent === 'number' ? newCurrency.exponent : 2,
    };
    
    const result = genkinConvert(dineroObject._genkin, targetCurrencyConfig, numericRate);
    return new DineroWrapper(result) as unknown as Dinero<T>;
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const ops = createArithmeticOperations(calculator);
    
    // Extract rate amount and scale
    let rateAmount: T;
    let rateScale: number | undefined;
    
    if (typeof rate === 'object' && rate !== null && 'amount' in rate) {
      const scaledRate = rate as { amount: T; scale: T };
      rateAmount = scaledRate.amount;
      rateScale = scaleToNumber(scaledRate.scale);
    } else {
      rateAmount = rate as T;
      rateScale = undefined;
    }
    
    const targetCurrencyConfig = {
      code: newCurrency.code,
      base: typeof newCurrency.base === 'number' 
        ? newCurrency.base 
        : (Array.isArray(newCurrency.base) ? 10 : Number(newCurrency.base)),
      precision: typeof newCurrency.exponent === 'number' 
        ? newCurrency.exponent 
        : Number(newCurrency.exponent),
    };
    
    const convertRate = rateScale !== undefined 
      ? { amount: rateAmount, scale: rateScale }
      : rateAmount;
    
    const result = ops.convert(dineroWrapper._genkin, targetCurrencyConfig, convertRate);
    return new GenericDineroWrapper(result, calculator, newCurrency.exponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Normalize the scale of an array of Dinero objects to the highest scale
 * All objects must have the same currency
 */
export function normalizeScale<T>(dineroObjects: Dinero<T>[]): Dinero<T>[] {
  assert(dineroObjects.length > 0, 'Cannot normalize scale of empty array');

  // Check that all objects have the same currency
  const firstCurrency = dineroObjects[0].currency.code;
  for (const dineroObject of dineroObjects) {
    assert(dineroObject.currency.code === firstCurrency, 'Objects must have the same currency.');
  }

  // Handle number-based DineroWrapper
  if (isDineroWrapper(dineroObjects[0])) {
    const genkins = dineroObjects.map(d => (d as unknown as DineroWrapper)._genkin);
    const normalizedGenkins = genkinNormalizeScale(genkins);
    return normalizedGenkins.map(genkin => new DineroWrapper(genkin) as unknown as Dinero<T>);
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(dineroObjects[0])) {
    const wrappers = dineroObjects.map(d => d as GenericDineroWrapper<T>);
    const calculator = wrappers[0]._genkin.calculator;
    const ops = createArithmeticOperations(calculator);
    const genkins = wrappers.map(w => w._genkin);
    const normalizedGenkins = ops.normalizeScale(genkins);
    const originalExponent = wrappers[0]._originalExponent;
    return normalizedGenkins.map(genkin => new GenericDineroWrapper(genkin, calculator, originalExponent)) as Dinero<T>[];
  }

  throw new Error('Invalid Dinero objects');
}

/**
 * Transform a Dinero object to a different scale
 */
export function transformScale<T>(
  dineroObject: Dinero<T>,
  newScale: T,
  divide?: DivideOperation
): Dinero<T> {
  // Handle number-based DineroWrapper
  if (isDineroWrapper(dineroObject)) {
    const wrapper = dineroObject as unknown as DineroWrapper;
    const currentScale = wrapper.scale;
    const targetScale = Number(newScale);
    const genkinInstance = wrapper._genkin;

    if (targetScale === currentScale) {
      return dineroObject;
    }

    // Get the currency's base (default to 10 for decimal currencies)
    const currencyBase = genkinInstance.currency.base ?? 10;
    let newAmount: number;

    if (targetScale > currentScale) {
      // Increasing precision - multiply by power of currency base
      const scaleFactor = Math.pow(currencyBase, targetScale - currentScale);
      newAmount = genkinInstance.minorUnits * scaleFactor;
    } else {
      // Decreasing precision - divide by power of currency base
      const scaleFactor = Math.pow(currencyBase, currentScale - targetScale);
      
      if (divide) {
        // Use the provided divide function
        // Create a number calculator for the divide operation
        const numberCalculator: Calculator<number> = {
          add: (a, b) => a + b,
          compare: (a, b) => (a < b ? ComparisonOperator.LT : a > b ? ComparisonOperator.GT : ComparisonOperator.EQ),
          decrement: (a) => a - 1,
          increment: (a) => a + 1,
          integerDivide: (a, b) => Math.trunc(a / b),
          modulo: (a, b) => a % b,
          multiply: (a, b) => a * b,
          power: (a, b) => Math.pow(a, b),
          subtract: (a, b) => a - b,
          zero: () => 0,
        };
        newAmount = divide(genkinInstance.minorUnits, scaleFactor, numberCalculator);
      } else {
        // Default to floor (integer division)
        newAmount = Math.trunc(genkinInstance.minorUnits / scaleFactor);
      }
    }

    // Create new Genkin with the converted amount and new precision
    const newGenkin = genkin(newAmount, {
      currency: genkinInstance.currency,
      precision: targetScale,
      isMinorUnits: true,
    });

    return new DineroWrapper(newGenkin) as unknown as Dinero<T>;
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(dineroObject)) {
    const wrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = wrapper._genkin.calculator;
    const genkinInstance = wrapper._genkin;
    const currentScale = genkinInstance.precision;
    const targetScale = scaleToNumber(newScale);

    if (targetScale === currentScale) {
      return dineroObject;
    }

    // Helper to convert a number to the calculator's type
    function intFromNumber(n: number): T {
      let result = calculator.zero();
      for (let i = 0; i < Math.abs(n); i++) {
        result = calculator.increment(result);
      }
      if (n < 0) {
        result = calculator.subtract(calculator.zero(), result);
      }
      return result;
    }

    // Get the currency's base from the dinero currency (already in type T)
    // The wrapper's currency property returns the base in the correct type
    const dineroCurrency = wrapper.currency;
    let base: T;
    if (Array.isArray(dineroCurrency.base)) {
      // For non-decimal currencies with array base, use the first element
      base = dineroCurrency.base[0];
    } else {
      base = dineroCurrency.base;
    }
    let newAmount: T;

    if (targetScale > currentScale) {
      // Increasing precision - multiply by power of currency base
      const scaleDiff = targetScale - currentScale;
      const scaleFactor = intFromNumber(scaleDiff);
      const multiplier = calculator.power(base, scaleFactor);
      newAmount = calculator.multiply(genkinInstance.minorUnits, multiplier);
    } else {
      // Decreasing precision - divide by power of currency base
      const scaleDiff = currentScale - targetScale;
      const scaleFactor = intFromNumber(scaleDiff);
      const divisor = calculator.power(base, scaleFactor);
      
      if (divide) {
        // Use the provided divide function
        newAmount = divide(genkinInstance.minorUnits, divisor, calculator);
      } else {
        // Default to floor (integer division)
        newAmount = calculator.integerDivide(genkinInstance.minorUnits, divisor);
      }
    }

    // Create new Genkin with the converted amount and target precision
    const newGenkin = new GenericGenkin(newAmount, calculator, {
      currency: genkinInstance.currency,
      precision: targetScale,
      rounding: genkinInstance.rounding,
      isMinorUnits: true,
    });

    return new GenericDineroWrapper(newGenkin, calculator, wrapper._originalExponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero object');
}

// Re-export rounding functions for compatibility
export {
  down,
  up,
  halfUp,
  halfDown,
  halfEven,
  halfOdd,
  halfAwayFromZero,
  halfTowardsZero,
};

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
