// Dinero.js v2 Alpha - Genkin Wrapper
// Thin wrapper around Genkin core for dinero.js v2 compatibility
// Supports generic numeric types (number, bigint, custom types)

import { Genkin, genkin } from '@genkin/core';
import { Currency as GenkinCurrency, CurrencyConfig, getCurrencyConfig, createCurrency } from '@genkin/core';
import { createGenkin, GenericGenkin } from '@genkin/core';
import { createArithmeticOperations, createComparisonOperations } from '@genkin/core';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate, convert as genkinConvert, normalizeScale as genkinNormalizeScale, transformScale as genkinTransformScale } from '@genkin/core';
import { equals as genkinEquals, lessThan as genkinLessThan, greaterThan as genkinGreaterThan, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative, min as genkinMin, max as genkinMax, hasSubUnits as genkinHasSubUnits } from '@genkin/core';
import type { ScaledRatio, AllocationRatio } from '@genkin/core';
import type { GenkinInstance, GenericAllocationRatio } from '@genkin/core';
import type { Calculator as GenkinCalculator } from '@genkin/core';
import type { Currency } from './currencies.js';
import { Calculator, Dinero, DineroOptions, DineroSnapshot, DineroFactory, CreateDineroOptions, ScaledAmount, Rates, ComparisonOperator, DivideOperation, Transformer } from './types.js';
import { down, up, halfUp, halfDown, halfEven, halfOdd, halfAwayFromZero, halfTowardsZero } from './divide/index.js';

/**
 * Assert function for validation
 */
export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Dinero.js] ${message}`);
  }
}

function toDineroCurrency<T>(currency: GenkinCurrency, scale: T, originalExponent?: T, originalBase?: T | readonly T[], convertToType?: (n: number) => T): Currency<T> {
  // For generic types, use the converter if provided
  const toT = convertToType ?? ((n: number) => n as unknown as T);
  return {
    code: currency.code,
    // Use original base if provided, otherwise derive from currency base
    base: originalBase ?? toT(currency.base ?? 10),
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
  public readonly _originalBase?: T | readonly T[];
  public readonly _originalScale?: T;
  public readonly __isGenericDineroWrapper = true as const;

  constructor(genkin: GenkinInstance<T>, calculator: GenkinCalculator<T>, originalExponent?: T, originalBase?: T | readonly T[], originalScale?: T) {
    this._genkin = genkin;
    this._calculator = calculator;
    // Store original base (may be an array for multi-base currencies)
    this._originalBase = originalBase;
    // Store original scale to preserve the same constructor/type
    this._originalScale = originalScale;
    // Store original currency exponent (defaults to currency precision converted to type T)
    // Note: we set _originalScale before this so _intToT can use it as reference
    this._originalExponent = originalExponent ?? this._intToT(genkin.currency.precision);
  }

  /**
   * Convert an integer to type T using the calculator, preserving the constructor from original values
   */
  private _intToT(n: number): T {
    // Try to create the value using the same constructor as the original values
    // This ensures deep equality works correctly when comparing Big.js instances
    const originalValue = this._originalScale ?? this._originalExponent ?? 
      (Array.isArray(this._originalBase) ? this._originalBase[0] : this._originalBase);
    
    if (originalValue !== undefined && typeof originalValue === 'object' && originalValue !== null) {
      const ctor = (originalValue as any).constructor;
      if (typeof ctor === 'function') {
        try {
          // Use the constructor from the original value to preserve the same Big.js instance type
          const result = new ctor(n);
          return result as T;
        } catch (e) {
          // Fall through to calculator-based approach
        }
      }
    }
    
    // Fallback: use the calculator's methods
    let result = this._calculator.zero();
    for (let i = 0; i < Math.abs(n); i++) {
      result = this._calculator.increment(result);
    }
    if (n < 0) {
      result = this._calculator.subtract(this._calculator.zero(), result);
    }
    return result;
  }

  /**
   * Convert any value to use the original constructor type
   * This ensures that values returned from operations use the same Big.js constructor as the input
   */
  private _convertToOriginalType(value: T): T {
    // For primitive types, no conversion needed
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    
    // Get a reference to an original value to extract its constructor
    const originalValue = this._originalScale ?? this._originalExponent ?? 
      (Array.isArray(this._originalBase) ? this._originalBase[0] : this._originalBase);
    
    // If we don't have an original value, return as-is
    if (originalValue === undefined || typeof originalValue !== 'object' || originalValue === null) {
      return value;
    }
    
    const originalCtor = (originalValue as any).constructor;
    const valueCtor = (value as any).constructor;
    
    // Only convert if constructors are different and we have a valid constructor
    if (originalCtor !== valueCtor && typeof originalCtor === 'function') {
      try {
        // Convert the value to a string representation, then create new instance
        const valueAsString = String(value);
        return new originalCtor(valueAsString) as T;
      } catch (e) {
        // If conversion fails, return the value as-is
        return value;
      }
    }
    
    // If constructors are the same, return the value as-is
    return value;
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
      this.scale, 
      this._originalExponent,
      this._originalBase,
      (n) => this._intToT(n)
    );
  }

  get scale(): T {
    // Always create a value with the correct constructor based on the current precision
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
    return new GenericDineroWrapper(genkinInstance, this._calculator, options.currency.exponent, options.currency.base, options.scale ?? options.currency.exponent);
  }

  toJSON(): DineroSnapshot<T> {
    // Get scale, preserving original constructor if possible
    const scaleValue = this.scale;
    return {
      amount: this._convertToOriginalType(this._genkin.minorUnits),
      currency: toDineroCurrency(
        this._genkin.currency, 
        scaleValue, 
        this._originalExponent,
        this._originalBase,
        (n) => this._intToT(n)
      ),
      scale: scaleValue,
    };
  }
}

/**
 * Dinero wrapper class that delegates to Genkin (number-based, backward compatible)
 */
class DineroWrapper implements Dinero<number> {
  public readonly _genkin: Genkin;
  public readonly _originalBase?: number | readonly number[];
  public readonly __isDineroWrapper = true as const;

  constructor(genkin: Genkin, originalBase?: number | readonly number[]) {
    this._genkin = genkin;
    this._originalBase = originalBase;
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

    // Pass the original currency exponent, base, and scale to preserve constructors
    return new GenericDineroWrapper(genkinInstance, calculator, currency.exponent, currency.base, scale ?? currency.exponent);
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

  // Wrap in Dinero-compatible interface, preserving original base
  return new DineroWrapper(genkinInstance, currency.base);
}

/**
 * Get a snapshot of a Dinero object
 */
export function toSnapshot<T>(dineroObject: Dinero<T>): DineroSnapshot<T> {
  return dineroObject.toJSON();
}

/**
 * Get the amount of a Dinero object as a decimal string.
 *
 * This function returns the amount as a string with the decimal point in the correct position.
 * It only works with decimal currencies (base 10). For non-decimal currencies, use `toUnits`.
 *
 * @param dineroObject - The Dinero object to convert
 * @param transformer - Optional transformer function to format the output
 * @returns Decimal string representation or transformed output
 * @throws Error if the currency is not decimal (non-base-10 or multi-base)
 *
 * @example
 * ```typescript
 * const d = dinero({ amount: 1050, currency: USD });
 * toDecimal(d); // "10.50"
 *
 * // With transformer
 * toDecimal(d, ({ value, currency }) => `${currency.code} ${value}`);
 * // "USD 10.50"
 *
 * // Negative amounts
 * const d2 = dinero({ amount: -1050, currency: USD });
 * toDecimal(d2); // "-10.50"
 * ```
 */
export function toDecimal<T, TOutput = string>(
  dineroObject: Dinero<T>,
  transformer?: Transformer<T, TOutput, string>
): TOutput {
  const { currency, scale } = dineroObject.toJSON();

  // Check if currency is decimal (single base that's a multiple of 10)
  // Handle number-based DineroWrapper
  if (isDineroWrapper(dineroObject)) {
    const originalBase = dineroObject._originalBase ?? currency.base;
    const isMultiBase = Array.isArray(originalBase);
    const base = isMultiBase 
      ? (originalBase as number[]).reduce((acc, b) => acc * b, 1)
      : Number(originalBase);
    const isBaseTen = base % 10 === 0;
    const isDecimal = !isMultiBase && isBaseTen;

    assert(isDecimal, 'Currency is not decimal.');

    const units = toUnits(dineroObject) as readonly number[];
    const scaleNumber = Number(scale);
    const value = getDecimalNumber(units, scaleNumber);

    if (!transformer) {
      return value as unknown as TOutput;
    }

    return transformer({ value, currency });
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    
    const originalBase = dineroWrapper._originalBase ?? currency.base;
    const isMultiBase = Array.isArray(originalBase);
    
    // Compute the base value
    let base: T;
    if (isMultiBase) {
      const bases = originalBase as readonly T[];
      base = bases.reduce((acc, b) => calculator.multiply(acc, b));
    } else {
      base = originalBase as T;
    }
    
    // Check if base is a multiple of 10
    const zero = calculator.zero();
    let ten = zero;
    for (let i = 0; i < 10; i++) {
      ten = calculator.increment(ten);
    }
    const isBaseTen = calculator.compare(calculator.modulo(base, ten), zero) === ComparisonOperator.EQ;
    const isDecimal = !isMultiBase && isBaseTen;

    assert(isDecimal, 'Currency is not decimal.');

    const units = toUnits(dineroObject) as readonly T[];
    const scaleNumber = Number(scale);
    const value = getDecimalGeneric(calculator, units, scaleNumber);

    if (!transformer) {
      return value as unknown as TOutput;
    }

    return transformer({ value, currency });
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Convert units to decimal string for number type
 */
function getDecimalNumber(units: readonly number[], scale: number): string {
  const whole = String(units[0]);
  const fractional = String(Math.abs(units[1]));

  const decimal = `${whole}.${fractional.padStart(scale, '0')}`;

  const leadsWithZero = units[0] === 0;
  const isNegative = units[1] < 0;

  // A leading negative zero is a special case because the `toString`
  // won't preserve its negative sign (since 0 === -0).
  return leadsWithZero && isNegative ? `-${decimal}` : decimal;
}

/**
 * Convert units to decimal string for generic type
 */
function getDecimalGeneric<T>(
  calculator: Calculator<T>,
  units: readonly T[],
  scale: number
): string {
  const zero = calculator.zero();
  
  // Get absolute value of fractional part
  const fractionalValue = units[1];
  const isNegativeFractional = calculator.compare(fractionalValue, zero) === ComparisonOperator.LT;
  const absFractional = isNegativeFractional 
    ? calculator.subtract(zero, fractionalValue)
    : fractionalValue;

  const whole = String(units[0]);
  const fractional = String(absFractional);

  const decimal = `${whole}.${fractional.padStart(scale, '0')}`;

  const leadsWithZero = calculator.compare(units[0], zero) === ComparisonOperator.EQ;

  // A leading negative zero is a special case because the `toString`
  // won't preserve its negative sign (since 0 === -0).
  return leadsWithZero && isNegativeFractional ? `-${decimal}` : decimal;
}

/**
 * Get the amount of a Dinero object in units.
 *
 * This function returns the total amount divided into each unit and sub-unit, as an array.
 * For example, an object representing $10.45 expressed as 1045 (with currency USD and no custom scale)
 * would return [10, 45] for 10 dollars and 45 cents.
 *
 * @param dineroObject - The Dinero object to convert
 * @param transformer - Optional transformer function to format the output
 * @returns Array of units or transformed output
 *
 * @example
 * ```typescript
 * const d = dinero({ amount: 1050, currency: USD });
 * toUnits(d); // [10, 50]
 *
 * // With transformer
 * toUnits(d, ({ value, currency }) => `${value.join('.')} ${currency.code}`);
 * // "10.50 USD"
 *
 * // Multi-base currency (old British Pounds: 20 shillings, 12 pence)
 * const GBP = { code: 'GBP', base: [20, 12], exponent: 1 };
 * const d2 = dinero({ amount: 267, currency: GBP });
 * toUnits(d2); // [1, 2, 3] - 1 pound, 2 shillings, 3 pence
 * ```
 */
export function toUnits<T, TOutput = readonly T[]>(
  dineroObject: Dinero<T>,
  transformer?: Transformer<T, TOutput, readonly T[]>
): TOutput {
  const { amount, currency, scale } = dineroObject.toJSON();

  // Handle number-based DineroWrapper
  if (isDineroWrapper(dineroObject)) {
    // Use the original base (may be array for multi-base currencies)
    const originalBase = dineroObject._originalBase ?? currency.base;
    const bases = Array.isArray(originalBase) ? originalBase : [originalBase];
    const divisors = getDivisorsNumber(bases.map((b) => Math.pow(Number(b), Number(scale))));
    
    const value = divisors.reduce<readonly number[]>(
      (amounts, divisor, index) => {
        const amountLeft = amounts[index];
        const quotient = Math.trunc(amountLeft / divisor);
        const remainder = amountLeft % divisor;
        return [...amounts.filter((_, i) => i !== index), quotient, remainder];
      },
      [amount as number]
    );

    if (!transformer) {
      return value as unknown as TOutput;
    }

    return transformer({ value: value as unknown as readonly T[], currency });
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    
    // Use the original base (may be array for multi-base currencies)
    const originalBase = dineroWrapper._originalBase ?? currency.base;
    const bases = Array.isArray(originalBase) ? originalBase : [originalBase];
    const divisors = getDivisorsGeneric(calculator, bases.map((b) => calculator.power(b, scale)));
    
    const value = divisors.reduce<readonly T[]>(
      (amounts, divisor, index) => {
        const amountLeft = amounts[index];
        const quotient = calculator.integerDivide(amountLeft, divisor);
        const remainder = calculator.modulo(amountLeft, divisor);
        return [...amounts.filter((_, i) => i !== index), quotient, remainder];
      },
      [amount]
    );

    if (!transformer) {
      return value as unknown as TOutput;
    }

    return transformer({ value, currency });
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Get divisors for number-based calculations
 * For multi-base currencies, computes cumulative products from right to left
 * e.g., [20, 12] becomes [240, 12] (20*12=240 for first divisor, 12 for second)
 */
function getDivisorsNumber(bases: number[]): number[] {
  // Compute cumulative product from right to left
  // For [20, 12]: result is [20*12, 12] = [240, 12]
  const result: number[] = [];
  let product = 1;
  
  // Start from the end and work backwards
  for (let i = bases.length - 1; i >= 0; i--) {
    product *= bases[i];
    result.unshift(product);
  }
  
  return result;
}

/**
 * Get divisors for generic type calculations
 * For multi-base currencies, computes cumulative products from right to left
 */
function getDivisorsGeneric<T>(calculator: Calculator<T>, bases: T[]): T[] {
  if (bases.length === 0) {
    return [];
  }
  
  // Compute cumulative product from right to left
  // For [20, 12]: result is [20*12, 12] = [240, 12]
  const result: T[] = [];
  let product = bases[bases.length - 1];
  result.unshift(product);
  
  // Start from the second-to-last and work backwards
  for (let i = bases.length - 2; i >= 0; i--) {
    product = calculator.multiply(product, bases[i]);
    result.unshift(product);
  }
  
  return result;
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
    // Preserve the original currency exponent, base, and scale
    // After normalization, result precision may be the higher of the two inputs
    const resultScale = result.precision === augendWrapper._genkin.precision 
      ? augendWrapper._originalScale 
      : (result.precision === addendWrapper._genkin.precision ? addendWrapper._originalScale : undefined);
    return new GenericDineroWrapper(result, calculator, augendWrapper._originalExponent, augendWrapper._originalBase, resultScale) as Dinero<T>;
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
    // Preserve the original currency exponent, base, and scale
    const resultScale = result.precision === minuendWrapper._genkin.precision 
      ? minuendWrapper._originalScale 
      : (result.precision === subtrahendWrapper._genkin.precision ? subtrahendWrapper._originalScale : undefined);
    return new GenericDineroWrapper(result, calculator, minuendWrapper._originalExponent, minuendWrapper._originalBase, resultScale) as Dinero<T>;
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
    // Preserve the original currency exponent, base, and scale (scale may change if multiplier has scale)
    const resultScale = result.precision === multiplicandWrapper._genkin.precision 
      ? multiplicandWrapper._originalScale 
      : multiplicandWrapper._intToT(result.precision);
    return new GenericDineroWrapper(result, calculator, multiplicandWrapper._originalExponent, multiplicandWrapper._originalBase, resultScale) as Dinero<T>;
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
    // For the new wrappers, pass the original exponent/base so they can create proper scale values
    // Don't pass a specific scale value - let each wrapper create its own based on its precision
    return results.map(result => new GenericDineroWrapper(result, calculator, exponent, dineroWrapper._originalBase, undefined)) as Dinero<T>[];
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Compare two Dinero objects
 */
export function compare<T>(dineroObject: Dinero<T>, comparator: Dinero<T>): ComparisonOperator {
  assert(dineroObject.currency.code === comparator.currency.code, 'Objects must have the same currency.');
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
  if(dineroObject.currency.code !== comparator.currency.code) {
    return false;
  }

  const [normalizedDineroObject, normalizedComparator] = normalizeScale([dineroObject, comparator]);
  return compare(normalizedDineroObject, normalizedComparator) === ComparisonOperator.EQ;
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
 * Get the greatest of the passed Dinero objects.
 *
 * @param dineroObjects - Array of Dinero objects to compare
 * @returns The Dinero object with the greatest value
 *
 * @example
 * ```typescript
 * const d1 = dinero({ amount: 150, currency: USD });
 * const d2 = dinero({ amount: 50, currency: USD });
 * const max = maximum([d1, d2]); // Returns d1 (150 USD)
 * ```
 */
export function maximum<T>(dineroObjects: ReadonlyArray<Dinero<T>>): Dinero<T> {
  assert(dineroObjects.length > 0, 'Cannot find maximum of empty array');

  // First normalize all objects to the same scale, then find the maximum
  const normalizedObjects = normalizeScale(dineroObjects);

  // Handle number-based DineroWrapper
  if (isDineroWrapper(normalizedObjects[0])) {
    const genkins = normalizedObjects.map(d => (d as unknown as DineroWrapper)._genkin);
    const maxGenkin = genkinMax(...genkins);
    return new DineroWrapper(maxGenkin) as unknown as Dinero<T>;
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(normalizedObjects[0])) {
    const wrappers = normalizedObjects.map(d => d as GenericDineroWrapper<T>);
    const calculator = wrappers[0]._genkin.calculator;
    const ops = createComparisonOperations(calculator);
    const genkins = wrappers.map(w => w._genkin);
    const maxGenkin = ops.maximum(genkins);
    const originalExponent = wrappers[0]._originalExponent;
    const originalBase = wrappers[0]._originalBase;
    // Find the wrapper that corresponds to the max to get its original scale
    const maxWrapperIdx = genkins.findIndex(g => g === maxGenkin);
    const originalScale = maxWrapperIdx >= 0 ? wrappers[maxWrapperIdx]._originalScale : undefined;
    return new GenericDineroWrapper(maxGenkin, calculator, originalExponent, originalBase, originalScale) as Dinero<T>;
  }

  throw new Error('Invalid Dinero objects');
}

/**
 * Get the smallest of the passed Dinero objects.
 *
 * @param dineroObjects - Array of Dinero objects to compare
 * @returns The Dinero object with the smallest value
 *
 * @example
 * ```typescript
 * const d1 = dinero({ amount: 150, currency: USD });
 * const d2 = dinero({ amount: 50, currency: USD });
 * const min = minimum([d1, d2]); // Returns d2 (50 USD)
 * ```
 */
export function minimum<T>(dineroObjects: ReadonlyArray<Dinero<T>>): Dinero<T> {
  assert(dineroObjects.length > 0, 'Cannot find minimum of empty array');

  // Check that all objects have the same currency
  const firstCurrency = dineroObjects[0].currency.code;
  for (const dineroObject of dineroObjects) {
    assert(dineroObject.currency.code === firstCurrency, 'Objects must have the same currency.');
  }

  // Find the minimum by comparing all objects
  let minObject = dineroObjects[0];
  for (let i = 1; i < dineroObjects.length; i++) {
    if (compare(dineroObjects[i], minObject) === ComparisonOperator.LT) {
      minObject = dineroObjects[i];
    }
  }

  return minObject;
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
 * Check if the Dinero object has sub-units
 * 
 * For decimal currencies, checks if there are fractional parts based on the current scale/precision.
 * For non-decimal currencies with a single base, checks if amount is not a whole unit.
 * For multi-base currencies (e.g., GBP with base [20, 12]), checks if amount is not a whole unit
 * based on the product of all bases.
 * 
 * @param dineroObject - The Dinero object to check
 * @returns true if the object has sub-units, false otherwise
 * 
 * @example
 * ```typescript
 * const d1 = dinero({ amount: 1100, currency: USD }); // $11.00
 * hasSubUnits(d1); // false
 * 
 * const d2 = dinero({ amount: 1150, currency: USD }); // $11.50
 * hasSubUnits(d2); // true
 * 
 * const d3 = dinero({ amount: 1100, currency: USD, scale: 3 }); // $1.100
 * hasSubUnits(d3); // true
 * ```
 */
export function hasSubUnits<T>(dineroObject: Dinero<T>): boolean {
  const dineroCurrency = dineroObject.currency;
  const base = dineroCurrency.base;
  
  // Check if base is an array (multi-base currency like GBP [20, 12])
  if (Array.isArray(base)) {
    // For multi-base currencies, check if minorUnits is divisible by the product of all bases
    if (isDineroWrapper(dineroObject)) {
      const product = base.reduce((acc, b) => acc * Number(b), 1);
      return dineroObject._genkin.minorUnits % product !== 0;
    }
    
    if (isGenericDineroWrapper(dineroObject)) {
      const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
      const calculator = dineroWrapper._genkin.calculator;
      const minorUnits = dineroWrapper._genkin.minorUnits;
      
      // Calculate product of all bases
      let product = calculator.zero();
      for (let i = 0; i < base.length; i++) {
        const baseValue = base[i];
        if (i === 0) {
          product = baseValue;
        } else {
          product = calculator.multiply(product, baseValue);
        }
      }
      
      // Check if minorUnits is divisible by product
      const remainder = calculator.modulo(minorUnits, product);
      return calculator.compare(remainder, calculator.zero()) !== ComparisonOperator.EQ;
    }
  }
  
  // For single base currencies, use the core function
  // The core function handles both decimal and non-decimal currencies correctly
  if (isDineroWrapper(dineroObject)) {
    return genkinHasSubUnits(dineroObject._genkin);
  }

  if (isGenericDineroWrapper(dineroObject)) {
    const dineroWrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = dineroWrapper._genkin.calculator;
    const ops = createComparisonOperations(calculator);
    return ops.hasSubUnits(dineroWrapper._genkin);
  }

  throw new Error('Invalid Dinero object');
}


export function haveSameCurrency<T>(dineroObjects: ReadonlyArray<Dinero<T>>): boolean {
  const firstCurrency = dineroObjects[0].currency;
  return dineroObjects.every(dineroObject => dineroObject.currency.code === firstCurrency.code);
}

/**
 * Check whether a set of Dinero objects have the same amount.
 * */
export function haveSameAmount<T>(dineroObjects: ReadonlyArray<Dinero<T>>): boolean {
  return dineroObjects.every((dineroObject, index) => index === 0 || compare(dineroObject, dineroObjects[index - 1]) === ComparisonOperator.EQ);
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
    // For convert, use the new currency's exponent and base
    return new GenericDineroWrapper(result, calculator, newCurrency.exponent, newCurrency.base, newCurrency.exponent) as Dinero<T>;
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Normalize the scale of an array of Dinero objects to the highest scale
 * All objects must have the same currency
 */
export function normalizeScale<T>(dineroObjects: ReadonlyArray<Dinero<T>>): Dinero<T>[] {
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
    const originalBase = wrappers[0]._originalBase;
    // Find the highest scale among the input wrappers
    const highestScaleWrapper = wrappers.reduce((highest, curr) => 
      curr._genkin.precision > highest._genkin.precision ? curr : highest
    );
    const highestOriginalScale = highestScaleWrapper._originalScale;
    return normalizedGenkins.map((genkin, i) => {
      // If this genkin's precision matches the highest, use that wrapper's original scale
      const originalScale = genkin.precision === highestScaleWrapper._genkin.precision 
        ? highestOriginalScale 
        : undefined;
      return new GenericDineroWrapper(genkin, calculator, originalExponent, originalBase, originalScale);
    }) as Dinero<T>[];
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
      base = dineroCurrency.base as T;
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

    // Use the newScale parameter as the original scale (it preserves the constructor)
    return new GenericDineroWrapper(newGenkin, calculator, wrapper._originalExponent, wrapper._originalBase, newScale) as Dinero<T>;
  }

  throw new Error('Invalid Dinero object');
}

/**
 * Trim a Dinero object's scale by removing trailing zeros from the amount
 * The scale will never go below the currency's exponent
 * 
 * @param dineroObject - The Dinero object to trim
 * @returns A new Dinero object with trimmed scale, or the original if no trimming needed
 * 
 * @example
 * ```typescript
 * // USD has exponent 2
 * const d = dinero({ amount: 500000, currency: USD, scale: 5 });
 * const trimmed = trimScale(d);
 * // Result: { amount: 500, scale: 2 }
 * 
 * const d2 = dinero({ amount: 55550, currency: USD, scale: 4 });
 * const trimmed2 = trimScale(d2);
 * // Result: { amount: 5555, scale: 3 } (can't go lower without losing precision)
 * ```
 */
export function trimScale<T>(dineroObject: Dinero<T>): Dinero<T> {
  // Handle number-based DineroWrapper
  if (isDineroWrapper(dineroObject)) {
    const wrapper = dineroObject as unknown as DineroWrapper;
    const amount = wrapper._genkin.minorUnits;
    const currentScale = wrapper.scale;
    const currencyExponent = wrapper.currency.exponent;
    
    // Get the currency's base (default to 10 for decimal currencies)
    const base = wrapper._genkin.currency.base ?? 10;
    
    // Handle zero amount - return with currency exponent as scale
    if (amount === 0) {
      if (currentScale === currencyExponent) {
        return dineroObject;
      }
      return transformScale(dineroObject as unknown as Dinero<number>, currencyExponent) as unknown as Dinero<T>;
    }
    
    // Count trailing zeros
    let trailingZeros = 0;
    let tempAmount = Math.abs(amount);
    while (tempAmount % base === 0 && trailingZeros < currentScale) {
      tempAmount = tempAmount / base;
      trailingZeros++;
    }
    
    // Calculate new scale (never go below currency exponent)
    const newScale = Math.max(currentScale - trailingZeros, currencyExponent);
    
    // If no change needed, return original
    if (newScale === currentScale) {
      return dineroObject;
    }
    
    return transformScale(dineroObject as unknown as Dinero<number>, newScale) as unknown as Dinero<T>;
  }

  // Handle generic GenericDineroWrapper
  if (isGenericDineroWrapper(dineroObject)) {
    const wrapper = dineroObject as GenericDineroWrapper<T>;
    const calculator = wrapper._genkin.calculator;
    const amount = wrapper._genkin.minorUnits;
    const currentScale = wrapper._genkin.precision;
    const currencyExponent = scaleToNumber(wrapper._originalExponent);
    
    // Get the currency's base (default to 10 for decimal currencies)
    const baseNum = wrapper._genkin.currency.base ?? 10;
    
    const zero = calculator.zero();
    const base = wrapper._intToT(baseNum);
    
    // Handle zero amount - return with currency exponent as scale
    if (calculator.compare(amount, zero) === 0) {
      if (currentScale === currencyExponent) {
        return dineroObject;
      }
      return transformScale(dineroObject, wrapper._intToT(currencyExponent));
    }
    
    // Count trailing zeros
    let trailingZeros = 0;
    let tempAmount = amount;
    // Make positive for counting
    if (calculator.compare(tempAmount, zero) < 0) {
      tempAmount = calculator.subtract(zero, tempAmount);
    }
    
    while (trailingZeros < currentScale) {
      const remainder = calculator.modulo(tempAmount, base);
      if (calculator.compare(remainder, zero) !== 0) {
        break;
      }
      tempAmount = calculator.integerDivide(tempAmount, base);
      trailingZeros++;
    }
    
    // Calculate new scale (never go below currency exponent)
    const newScale = Math.max(currentScale - trailingZeros, currencyExponent);
    
    // If no change needed, return original
    if (newScale === currentScale) {
      return dineroObject;
    }
    
    return transformScale(dineroObject, wrapper._intToT(newScale));
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
  // bigjsCalculator removed from core - users should create their own
} from '@genkin/core';


// Export currencies
export * from './currencies.js';

// Export generic operations factory
export {
  createArithmeticOperations,
  createComparisonOperations,
  createOperations
} from '@genkin/core';
