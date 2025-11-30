import { Genkin } from '../core/genkin.js';

/**
 * Check if two Genkin instances are equal
 * Both instances must have the same currency
 */
export function equals(a: Genkin, b: Genkin): boolean {
  if (!a.hasSameCurrency(b)) {
    return false;
  }

  // Compare at the higher precision level
  const maxPrecision = Math.max(a.precision, b.precision);
  const aUnits = a.minorUnits * Math.pow(10, maxPrecision - a.precision);
  const bUnits = b.minorUnits * Math.pow(10, maxPrecision - b.precision);

  return aUnits === bUnits;
}

/**
 * Check if the first Genkin is less than the second
 * Both instances must have the same currency
 */
export function lessThan(a: Genkin, b: Genkin): boolean {
  if (!a.hasSameCurrency(b)) {
    throw new Error(`Cannot compare different currencies: ${a.currencyCode} and ${b.currencyCode}`);
  }

  // Compare at the higher precision level
  const maxPrecision = Math.max(a.precision, b.precision);
  const aUnits = a.minorUnits * Math.pow(10, maxPrecision - a.precision);
  const bUnits = b.minorUnits * Math.pow(10, maxPrecision - b.precision);

  return aUnits < bUnits;
}

/**
 * Check if the first Genkin is less than or equal to the second
 * Both instances must have the same currency
 */
export function lessThanOrEqual(a: Genkin, b: Genkin): boolean {
  return lessThan(a, b) || equals(a, b);
}

/**
 * Check if the first Genkin is greater than the second
 * Both instances must have the same currency
 */
export function greaterThan(a: Genkin, b: Genkin): boolean {
  if (!a.hasSameCurrency(b)) {
    throw new Error(`Cannot compare different currencies: ${a.currencyCode} and ${b.currencyCode}`);
  }

  // Compare at the higher precision level
  const maxPrecision = Math.max(a.precision, b.precision);
  const aUnits = a.minorUnits * Math.pow(10, maxPrecision - a.precision);
  const bUnits = b.minorUnits * Math.pow(10, maxPrecision - b.precision);

  return aUnits > bUnits;
}

/**
 * Check if the first Genkin is greater than or equal to the second
 * Both instances must have the same currency
 */
export function greaterThanOrEqual(a: Genkin, b: Genkin): boolean {
  return greaterThan(a, b) || equals(a, b);
}

/**
 * Check if a Genkin instance is zero
 */
export function isZero(genkin: Genkin): boolean {
  return genkin.minorUnits === 0;
}

/**
 * Check if a Genkin instance is positive
 */
export function isPositive(genkin: Genkin): boolean {
  return genkin.minorUnits >= 0;
}

/**
 * Check if a Genkin instance is negative
 */
export function isNegative(genkin: Genkin): boolean {
  return genkin.minorUnits < 0;
}

/**
 * Find the minimum of two or more Genkin instances
 * All instances must have the same currency
 */
export function min(...genkins: Genkin[]): Genkin {
  if (genkins.length === 0) {
    throw new Error('Cannot find minimum of empty array');
  }

  if (genkins.length === 1) {
    return genkins[0];
  }

  return genkins.reduce((min, current) => {
    return lessThan(current, min) ? current : min;
  });
}

/**
 * Find the maximum of two or more Genkin instances
 * All instances must have the same currency
 */
export function max(...genkins: Genkin[]): Genkin {
  if (genkins.length === 0) {
    throw new Error('Cannot find maximum of empty array');
  }

  if (genkins.length === 1) {
    return genkins[0];
  }

  return genkins.reduce((max, current) => {
    return greaterThan(current, max) ? current : max;
  });
} 