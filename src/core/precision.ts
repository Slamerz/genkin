import { RoundingMode } from './currency.js';

/**
 * Convert a decimal amount to integer units based on precision
 * @param amount - The decimal amount (e.g., 12.34)
 * @param precision - Number of decimal places (e.g., 2 for cents)
 * @returns Integer units (e.g., 1234 for $12.34)
 */
export function toMinorUnits(amount: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(amount * factor);
}

/**
 * Convert integer units back to decimal amount
 * @param units - Integer units (e.g., 1234)
 * @param precision - Number of decimal places (e.g., 2)
 * @returns Decimal amount (e.g., 12.34)
 */
export function fromMinorUnits(units: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return units / factor;
}

/**
 * Apply rounding mode to a number
 * @param value - The value to round
 * @param mode - The rounding mode to apply
 * @returns Rounded value
 */
export function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case RoundingMode.ROUND_UP:
      return Math.ceil(value);
    
    case RoundingMode.ROUND_DOWN:
      return Math.floor(value);
    
    case RoundingMode.ROUND_TOWARDS_ZERO:
      return value >= 0 ? Math.floor(value) : Math.ceil(value);
    
    case RoundingMode.ROUND_AWAY_FROM_ZERO:
      return value >= 0 ? Math.ceil(value) : Math.floor(value);
    
    case RoundingMode.ROUND_HALF_UP:
      return Math.floor(value + 0.5);
    
    case RoundingMode.ROUND_HALF_DOWN:
      return Math.ceil(value - 0.5);
    
    case RoundingMode.ROUND_HALF_ODD:
      // Round to nearest, ties to odd
      const roundedOdd = Math.round(value);
      const diffOdd = Math.abs(value - roundedOdd);

      if (diffOdd === 0.5) {
        return roundedOdd % 2 === 1 ? roundedOdd : (value > roundedOdd ? roundedOdd + 1 : roundedOdd - 1);
      }

      return roundedOdd;

    case RoundingMode.ROUND_HALF_TOWARDS_ZERO:
      // Round to nearest, ties towards zero
      const roundedTowardsZero = Math.round(value);
      const diffTowardsZero = Math.abs(value - roundedTowardsZero);

      if (diffTowardsZero === 0.5) {
        return value >= 0 ? Math.floor(value) : Math.ceil(value);
      }

      return roundedTowardsZero;

    case RoundingMode.ROUND_HALF_AWAY_FROM_ZERO:
      // Round to nearest, ties away from zero
      const roundedAway = Math.round(value);
      const diffAway = Math.abs(value - roundedAway);

      if (diffAway === 0.5) {
        return value >= 0 ? Math.ceil(value) : Math.floor(value);
      }

      return roundedAway;

    case RoundingMode.ROUND_HALF_EVEN:
    default:
      // Banker's rounding - round to nearest even
      const rounded = Math.round(value);
      const diff = Math.abs(value - rounded);

      if (diff === 0.5) {
        return rounded % 2 === 0 ? rounded : (value > rounded ? rounded + 1 : rounded - 1);
      }

      return rounded;
  }
}

/**
 * Safely add two numbers avoiding floating-point precision issues
 */
export function safeAdd(a: number, b: number): number {
  return a + b;
}

/**
 * Safely subtract two numbers avoiding floating-point precision issues
 */
export function safeSubtract(a: number, b: number): number {
  return a - b;
}

/**
 * Safely multiply, applying rounding for precision
 */
export function safeMultiply(a: number, b: number, precision: number, rounding: RoundingMode = RoundingMode.ROUND_HALF_EVEN): number {
  // a is in minor units, b is the multiplier
  // Result should be in minor units
  const result = a * b;
  return Math.round(applyRounding(result, rounding));
}

/**
 * Safely divide, applying rounding for precision
 */
export function safeDivide(a: number, b: number, precision: number, rounding: RoundingMode = RoundingMode.ROUND_HALF_EVEN): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  
  // a is in minor units, b is the divisor
  // Result should be in minor units
  const result = a / b;
  return Math.round(applyRounding(result, rounding));
} 