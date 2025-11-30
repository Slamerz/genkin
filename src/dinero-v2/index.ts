// Dinero.js v2 Alpha compatibility layer
// This module provides a Dinero.js v2-compatible API that internally uses Genkin

import { Genkin, genkin } from '../core/genkin.js';
import { CurrencyCode, Currency, getCurrencyConfig, createCurrency } from '../core/currency.js';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate } from '../operations/arithmetic.js';
import { equals as genkinEquals, lessThan as genkinLessThan, greaterThan as genkinGreaterThan, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative } from '../operations/comparison.js';
import type { ScaledRatio, AllocationRatio } from '../operations/arithmetic.js';

/**
 * Dinero v2 compatible currency interface
 */
export interface DineroCurrency {
  code: CurrencyCode;
  scale: number;
}

/**
 * Dinero v2 compatible options for creating a dinero instance
 */
export interface DineroOptions {
  amount: number;
  currency: DineroCurrency;
  scale?: number;
}

/**
 * Dinero v2 compatible instance interface
 */
export interface DineroInstance {
  toJSON(): { amount: number; currency: DineroCurrency; scale: number };
  getAmount(): number;
  getCurrency(): DineroCurrency;
  getScale(): number;
}

/**
 * Internal wrapper class that provides Dinero v2 API around a Genkin instance
 */
class DineroWrapper implements DineroInstance {
  private _genkin: Genkin;
  private _currency: DineroCurrency;

  constructor(genkin: Genkin, currency: DineroCurrency) {
    this._genkin = genkin;
    this._currency = currency;
  }

  toJSON(): { amount: number; currency: DineroCurrency; scale: number } {
    return {
      amount: this._genkin.minorUnits,
      currency: this._currency,
      scale: this._genkin.precision,
    };
  }

  getAmount(): number {
    return this._genkin.minorUnits;
  }

  getCurrency(): DineroCurrency {
    return this._currency;
  }

  getScale(): number {
    return this._genkin.precision;
  }

  // Expose the internal Genkin instance for operations
  get _internal(): Genkin {
    return this._genkin;
  }
}

/**
 * Create a dinero instance (Dinero v2 compatible)
 */
export function dinero({ amount, currency, scale }: DineroOptions): DineroInstance {
  // Convert Dinero currency to Genkin currency
  let genkinCurrency: Currency;
  try {
    genkinCurrency = createCurrency(getCurrencyConfig(currency.code));
  } catch {
    // If currency is not found, create a basic one
    genkinCurrency = createCurrency({
      code: currency.code,
      numeric: 999, // Use placeholder numeric code for unknown currencies
      precision: scale ?? currency.scale,
      symbol: currency.code,
      name: currency.code,
      base: 10,
    });
  }

  // Create Genkin instance with amount in minor units
  const precision = scale ?? currency.scale;
  const genkinInstance = new Genkin(amount, {
    currency: genkinCurrency,
    precision,
    isMinorUnits: true, // Dinero v2 amount is already in minor units
  });

  // Wrap in Dinero-compatible interface
  return new DineroWrapper(genkinInstance, currency);
}

/**
 * Convert a dinero instance to decimal representation (Dinero v2 compatible)
 */
export function toDecimal(dineroInstance: DineroInstance): string {
  if (dineroInstance instanceof DineroWrapper) {
    return dineroInstance._internal.amount.toString();
  }
  // Fallback for unknown implementations
  const json = dineroInstance.toJSON();
  const precision = json.scale;
  const amount = json.amount / Math.pow(10, precision);
  return amount.toString();
}

/**
 * Add two dinero instances (Dinero v2 compatible)
 */
export function add(dinero1: DineroInstance, dinero2: DineroInstance): DineroInstance {
  if (!(dinero1 instanceof DineroWrapper) || !(dinero2 instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instances');
  }

  const result = genkinAdd(dinero1._internal, dinero2._internal);
  return new DineroWrapper(result, dinero1.getCurrency());
}

/**
 * Subtract two dinero instances (Dinero v2 compatible)
 */
export function subtract(dinero1: DineroInstance, dinero2: DineroInstance): DineroInstance {
  if (!(dinero1 instanceof DineroWrapper) || !(dinero2 instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instances');
  }

  const result = genkinSubtract(dinero1._internal, dinero2._internal);
  return new DineroWrapper(result, dinero1.getCurrency());
}

/**
 * Multiply a dinero instance by a factor (Dinero v2 compatible)
 */
export function multiply(dineroInstance: DineroInstance, factor: number): DineroInstance {
  if (!(dineroInstance instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instance');
  }

  const result = genkinMultiply(dineroInstance._internal, factor);
  return new DineroWrapper(result, dineroInstance.getCurrency());
}

/**
 * Divide a dinero instance by a divisor (Dinero v2 compatible)
 */
export function divide(dineroInstance: DineroInstance, divisor: number): DineroInstance {
  if (!(dineroInstance instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instance');
  }

  const result = genkinDivide(dineroInstance._internal, divisor);
  return new DineroWrapper(result, dineroInstance.getCurrency());
}

/**
 * Check if two dinero instances are equal (Dinero v2 compatible)
 */
export function equals(dinero1: DineroInstance, dinero2: DineroInstance): boolean {
  if (!(dinero1 instanceof DineroWrapper) || !(dinero2 instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instances');
  }

  return genkinEquals(dinero1._internal, dinero2._internal);
}

/**
 * Check if first dinero instance is less than second (Dinero v2 compatible)
 */
export function lessThan(dinero1: DineroInstance, dinero2: DineroInstance): boolean {
  if (!(dinero1 instanceof DineroWrapper) || !(dinero2 instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instances');
  }

  return genkinLessThan(dinero1._internal, dinero2._internal);
}

/**
 * Check if first dinero instance is greater than second (Dinero v2 compatible)
 */
export function greaterThan(dinero1: DineroInstance, dinero2: DineroInstance): boolean {
  if (!(dinero1 instanceof DineroWrapper) || !(dinero2 instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instances');
  }

  return genkinGreaterThan(dinero1._internal, dinero2._internal);
}

/**
 * Check if dinero instance is zero (Dinero v2 compatible)
 */
export function isZero(dineroInstance: DineroInstance): boolean {
  if (!(dineroInstance instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instance');
  }

  return genkinIsZero(dineroInstance._internal);
}

/**
 * Check if dinero instance is positive (Dinero v2 compatible)
 */
export function isPositive(dineroInstance: DineroInstance): boolean {
  if (!(dineroInstance instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instance');
  }

  return genkinIsPositive(dineroInstance._internal);
}

/**
 * Check if dinero instance is negative (Dinero v2 compatible)
 */
export function isNegative(dineroInstance: DineroInstance): boolean {
  if (!(dineroInstance instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instance');
  }

  return genkinIsNegative(dineroInstance._internal);
}

/**
 * Allocate a dinero instance into parts (Dinero v2 compatible)
 */
export function allocate(dineroInstance: DineroInstance, ratios: AllocationRatio[]): DineroInstance[] {
  if (!(dineroInstance instanceof DineroWrapper)) {
    throw new Error('Invalid dinero instance');
  }

  const results = genkinAllocate(dineroInstance._internal, ratios);
  return results.map(result => new DineroWrapper(result, dineroInstance.getCurrency()));
}

// Re-export types for convenience
export type { ScaledRatio, AllocationRatio };
