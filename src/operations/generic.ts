import type { Calculator } from '../core/calculator.js';
import type { GenkinInstance, GenericScaledRatio, GenericAllocationRatio } from '../core/types.js';
import { ComparisonOperator } from '../core/calculator.js';
import { GenericGenkin, createGenkin } from '../core/factory.js';

/**
 * Assert function for validation
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Dinero.js] ${message}`);
  }
}

/**
 * Create generic arithmetic operations for a specific numeric type
 */
export function createArithmeticOperations<T>(calculator: Calculator<T>) {
  const factory = createGenkin(calculator);

  /**
   * Helper to convert a number to the calculator's type
   */
  function intFromNumber(n: number): T {
    let result = calculator.zero();
    for (let i = 0; i < n; i++) {
      result = calculator.increment(result);
    }
    return result;
  }

  /**
   * Normalize amounts to the same precision for comparison/calculation
   */
  function normalizeToSamePrecision(a: GenkinInstance<T>, b: GenkinInstance<T>): { aUnits: T; bUnits: T; maxPrecision: number } {
    const maxPrecision = Math.max(a.precision, b.precision);
    // Use the currency's base (default to 10 if not specified)
    const currencyBase = a.currency.base ?? 10;
    const base = intFromNumber(currencyBase);
    
    const aScale = calculator.power(base, intFromNumber(maxPrecision - a.precision));
    const bScale = calculator.power(base, intFromNumber(maxPrecision - b.precision));
    
    const aUnits = calculator.multiply(a.minorUnits, aScale);
    const bUnits = calculator.multiply(b.minorUnits, bScale);
    
    return { aUnits, bUnits, maxPrecision };
  }

  /**
   * Add two Genkin instances
   */
  function add(a: GenkinInstance<T>, b: GenkinInstance<T>): GenkinInstance<T> {
    assert(a.hasSameCurrency(b), 'Objects must have the same currency.');

    const { aUnits, bUnits, maxPrecision } = normalizeToSamePrecision(a, b);
    const resultUnits = calculator.add(aUnits, bUnits);

    return new GenericGenkin(resultUnits, calculator, {
      currency: a.currency,
      precision: maxPrecision,
      rounding: a.rounding,
      isMinorUnits: true,
    });
  }

  /**
   * Subtract one Genkin instance from another
   */
  function subtract(a: GenkinInstance<T>, b: GenkinInstance<T>): GenkinInstance<T> {
    assert(a.hasSameCurrency(b), 'Objects must have the same currency.');

    const { aUnits, bUnits, maxPrecision } = normalizeToSamePrecision(a, b);
    const resultUnits = calculator.subtract(aUnits, bUnits);

    return new GenericGenkin(resultUnits, calculator, {
      currency: a.currency,
      precision: maxPrecision,
      rounding: a.rounding,
      isMinorUnits: true,
    });
  }

  /**
   * Multiply a Genkin instance by a factor
   */
  function multiply(genkin: GenkinInstance<T>, multiplier: T): GenkinInstance<T> {
    const resultUnits = calculator.multiply(genkin.minorUnits, multiplier);

    return new GenericGenkin(resultUnits, calculator, {
      currency: genkin.currency,
      precision: genkin.precision,
      rounding: genkin.rounding,
      isMinorUnits: true,
    });
  }

  /**
   * Divide a Genkin instance by a divisor
   */
  function divide(genkin: GenkinInstance<T>, divisor: T): GenkinInstance<T> {
    const resultUnits = calculator.integerDivide(genkin.minorUnits, divisor);

    return new GenericGenkin(resultUnits, calculator, {
      currency: genkin.currency,
      precision: genkin.precision,
      rounding: genkin.rounding,
      isMinorUnits: true,
    });
  }

  /**
   * Negate a Genkin instance
   */
  function negate(genkin: GenkinInstance<T>): GenkinInstance<T> {
    const zero = calculator.zero();
    const negatedUnits = calculator.subtract(zero, genkin.minorUnits);

    return new GenericGenkin(negatedUnits, calculator, {
      currency: genkin.currency,
      precision: genkin.precision,
      rounding: genkin.rounding,
      isMinorUnits: true,
    });
  }

  /**
   * Get the absolute value of a Genkin instance
   */
  function abs(genkin: GenkinInstance<T>): GenkinInstance<T> {
    const comparison = calculator.compare(genkin.minorUnits, calculator.zero());
    if (comparison === ComparisonOperator.LT) {
      return negate(genkin);
    }
    return genkin;
  }

  /**
   * Allocate a Genkin amount across ratios
   */
  function allocate(genkin: GenkinInstance<T>, ratios: GenericAllocationRatio<T>[]): GenkinInstance<T>[] {
    if (ratios.length === 0) {
      throw new Error('Ratios array cannot be empty');
    }

    // Normalize ratios to simple values
    const normalizedRatios = normalizeRatios(ratios);
    
    // Calculate total ratio
    let totalRatio = calculator.zero();
    for (const ratio of normalizedRatios) {
      totalRatio = calculator.add(totalRatio, ratio);
    }

    const zeroComparison = calculator.compare(totalRatio, calculator.zero());
    if (zeroComparison === ComparisonOperator.EQ) {
      throw new Error('Total ratio cannot be zero');
    }

    const totalUnits = genkin.minorUnits;
    const allocations: T[] = [];
    let allocatedSum = calculator.zero();

    // Calculate base allocations
    for (const ratio of normalizedRatios) {
      const zeroRatioComparison = calculator.compare(ratio, calculator.zero());
      if (zeroRatioComparison === ComparisonOperator.EQ) {
        allocations.push(calculator.zero());
      } else {
        // allocation = (totalUnits * ratio) / totalRatio
        const numerator = calculator.multiply(totalUnits, ratio);
        const allocation = calculator.integerDivide(numerator, totalRatio);
        allocations.push(allocation);
        allocatedSum = calculator.add(allocatedSum, allocation);
      }
    }

    // Distribute remainder
    let remainder = calculator.subtract(totalUnits, allocatedSum);
    let index = 0;
    
    // Keep distributing while there's remainder
    while (calculator.compare(remainder, calculator.zero()) === ComparisonOperator.GT && index < allocations.length) {
      const ratioComparison = calculator.compare(normalizedRatios[index], calculator.zero());
      if (ratioComparison !== ComparisonOperator.EQ) {
        allocations[index] = calculator.increment(allocations[index]);
        remainder = calculator.decrement(remainder);
      }
      index++;
    }

    // Convert back to Genkin instances
    return allocations.map(units => 
      new GenericGenkin(units, calculator, {
        currency: genkin.currency,
        precision: genkin.precision,
        rounding: genkin.rounding,
        isMinorUnits: true,
      })
    );
  }

  /**
   * Normalize ratios to simple values
   */
  function normalizeRatios(ratios: GenericAllocationRatio<T>[]): T[] {
    return ratios.map(ratio => {
      if (typeof ratio === 'object' && ratio !== null && 'amount' in ratio) {
        return (ratio as GenericScaledRatio<T>).amount;
      }
      return ratio as T;
    });
  }

  return {
    add,
    subtract,
    multiply,
    divide,
    negate,
    abs,
    allocate,
  };
}

/**
 * Create generic comparison operations for a specific numeric type
 */
export function createComparisonOperations<T>(calculator: Calculator<T>) {
  /**
   * Helper to convert a number to the calculator's type
   */
  function intFromNumber(n: number): T {
    let result = calculator.zero();
    for (let i = 0; i < n; i++) {
      result = calculator.increment(result);
    }
    return result;
  }

  /**
   * Normalize amounts to the same precision for comparison
   */
  function normalizeToSamePrecision(a: GenkinInstance<T>, b: GenkinInstance<T>): { aUnits: T; bUnits: T } {
    const maxPrecision = Math.max(a.precision, b.precision);
    const base = intFromNumber(10);
    
    const aScale = calculator.power(base, intFromNumber(maxPrecision - a.precision));
    const bScale = calculator.power(base, intFromNumber(maxPrecision - b.precision));
    
    const aUnits = calculator.multiply(a.minorUnits, aScale);
    const bUnits = calculator.multiply(b.minorUnits, bScale);
    
    return { aUnits, bUnits };
  }

  /**
   * Compare two Genkin instances
   */
  function compare(a: GenkinInstance<T>, b: GenkinInstance<T>): ComparisonOperator {
    if (!a.hasSameCurrency(b)) {
      throw new Error(`Cannot compare different currencies: ${a.currencyCode} and ${b.currencyCode}`);
    }

    const { aUnits, bUnits } = normalizeToSamePrecision(a, b);
    return calculator.compare(aUnits, bUnits);
  }

  /**
   * Check if two Genkin instances are equal
   */
  function equals(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
    if (!a.hasSameCurrency(b)) {
      return false;
    }
    return compare(a, b) === ComparisonOperator.EQ;
  }

  /**
   * Check if the first Genkin is less than the second
   */
  function lessThan(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
    return compare(a, b) === ComparisonOperator.LT;
  }

  /**
   * Check if the first Genkin is less than or equal to the second
   */
  function lessThanOrEqual(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
    const result = compare(a, b);
    return result === ComparisonOperator.LT || result === ComparisonOperator.EQ;
  }

  /**
   * Check if the first Genkin is greater than the second
   */
  function greaterThan(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
    return compare(a, b) === ComparisonOperator.GT;
  }

  /**
   * Check if the first Genkin is greater than or equal to the second
   */
  function greaterThanOrEqual(a: GenkinInstance<T>, b: GenkinInstance<T>): boolean {
    const result = compare(a, b);
    return result === ComparisonOperator.GT || result === ComparisonOperator.EQ;
  }

  /**
   * Check if a Genkin instance is zero
   */
  function isZero(genkin: GenkinInstance<T>): boolean {
    return calculator.compare(genkin.minorUnits, calculator.zero()) === ComparisonOperator.EQ;
  }

  /**
   * Check if a Genkin instance is positive (>= 0)
   */
  function isPositive(genkin: GenkinInstance<T>): boolean {
    const result = calculator.compare(genkin.minorUnits, calculator.zero());
    return result === ComparisonOperator.GT || result === ComparisonOperator.EQ;
  }

  /**
   * Check if a Genkin instance is negative (< 0)
   */
  function isNegative(genkin: GenkinInstance<T>): boolean {
    return calculator.compare(genkin.minorUnits, calculator.zero()) === ComparisonOperator.LT;
  }

  /**
   * Find the minimum of Genkin instances
   */
  function min(...genkins: GenkinInstance<T>[]): GenkinInstance<T> {
    if (genkins.length === 0) {
      throw new Error('Cannot find minimum of empty array');
    }
    return genkins.reduce((min, current) => 
      lessThan(current, min) ? current : min
    );
  }

  /**
   * Find the maximum of Genkin instances
   */
  function max(...genkins: GenkinInstance<T>[]): GenkinInstance<T> {
    if (genkins.length === 0) {
      throw new Error('Cannot find maximum of empty array');
    }
    return genkins.reduce((max, current) => 
      greaterThan(current, max) ? current : max
    );
  }

  return {
    compare,
    equals,
    lessThan,
    lessThanOrEqual,
    greaterThan,
    greaterThanOrEqual,
    isZero,
    isPositive,
    isNegative,
    min,
    max,
  };
}

/**
 * Create all generic operations for a specific numeric type
 */
export function createOperations<T>(calculator: Calculator<T>) {
  return {
    ...createArithmeticOperations(calculator),
    ...createComparisonOperations(calculator),
  };
}

