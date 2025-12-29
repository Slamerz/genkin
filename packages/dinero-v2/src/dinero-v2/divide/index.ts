import type { Calculator, DivideOperation } from './types.js';

/**
 * Helper to convert a number to TAmount using the calculator
 */
function intFromNumber<TAmount>(n: number, calculator: Calculator<TAmount>): TAmount {
  let result = calculator.zero();
  for (let i = 0; i < n; i++) {
    result = calculator.increment(result);
  }
  return result;
}

/**
 * Round down (towards negative infinity)
 */
export const down: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const quotient = calculator.integerDivide(amount, factor);
  return quotient;
};

/**
 * Round up (towards positive infinity)
 */
export const up: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);

  // If there's a remainder, round up
  if (calculator.compare(remainder, calculator.zero()) !== 0) {
    return calculator.increment(quotient);
  }

  return quotient;
};

/**
 * Round half up (round to nearest, ties round away from zero)
 */
export const halfUp: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);
  const two = intFromNumber(2, calculator);
  
  // Check if remainder >= half of factor (round up)
  const doubledRemainder = calculator.multiply(remainder, two);
  const comparison = calculator.compare(doubledRemainder, factor);
  
  // If doubledRemainder >= factor, round up
  if (comparison >= 0) {
    return calculator.increment(quotient);
  }
  
  return quotient;
};

/**
 * Round half down (round to nearest, ties round towards zero)
 */
export const halfDown: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);
  const two = intFromNumber(2, calculator);
  
  // Check if remainder > half of factor (round up only if past half)
  const doubledRemainder = calculator.multiply(remainder, two);
  const comparison = calculator.compare(doubledRemainder, factor);
  
  // If doubledRemainder > factor, round up
  if (comparison > 0) {
    return calculator.increment(quotient);
  }
  
  return quotient;
};

/**
 * Round half to even (banker's rounding)
 */
export const halfEven: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const two = intFromNumber(2, calculator);
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);

  // Check if remainder is exactly half
  const halfFactor = calculator.integerDivide(factor, two);
  const isHalf = calculator.compare(remainder, halfFactor) === 0;

  if (isHalf) {
    // Check if quotient is even
    const remainderOfQuotient = calculator.modulo(quotient, two);
    const isEven = calculator.compare(remainderOfQuotient, calculator.zero()) === 0;

    if (!isEven) {
      // Round to even by incrementing
      return calculator.increment(quotient);
    }
  }

  return quotient;
};

/**
 * Round half to odd
 */
export const halfOdd: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const two = intFromNumber(2, calculator);
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);

  // Check if remainder is exactly half
  const halfFactor = calculator.integerDivide(factor, two);
  const isHalf = calculator.compare(remainder, halfFactor) === 0;

  if (isHalf) {
    // Check if quotient is odd
    const remainderOfQuotient = calculator.modulo(quotient, two);
    const isOdd = calculator.compare(remainderOfQuotient, calculator.zero()) !== 0;

    if (!isOdd) {
      // Round to odd by incrementing
      return calculator.increment(quotient);
    }
  }

  return quotient;
};

/**
 * Round half away from zero
 */
export const halfAwayFromZero: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const two = intFromNumber(2, calculator);
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);

  // Check if remainder is exactly half
  const halfFactor = calculator.integerDivide(factor, two);
  const isHalf = calculator.compare(remainder, halfFactor) === 0;

  if (isHalf) {
    // Always round away from zero
    const isPositive = calculator.compare(amount, calculator.zero()) >= 0;
    return isPositive ? calculator.increment(quotient) : calculator.decrement(quotient);
  }

  return quotient;
};

/**
 * Round half towards zero
 */
export const halfTowardsZero: DivideOperation = <TAmount>(
  amount: TAmount,
  factor: TAmount,
  calculator: Calculator<TAmount>
): TAmount => {
  const two = intFromNumber(2, calculator);
  const quotient = calculator.integerDivide(amount, factor);
  const remainder = calculator.modulo(amount, factor);

  // Check if remainder is exactly half
  const halfFactor = calculator.integerDivide(factor, two);
  const isHalf = calculator.compare(remainder, halfFactor) === 0;

  if (isHalf) {
    // Round towards zero (do nothing, just return quotient)
    return quotient;
  }

  return quotient;
};
