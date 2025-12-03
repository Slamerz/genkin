// Dinero.js v2 Alpha compatibility layer
// This module provides a Dinero.js v2-compatible API that internally uses Genkin

import { Genkin, genkin } from '../core/genkin.js';
import { CurrencyCode, getCurrencyConfig, createCurrency } from '../core/currency.js';
import { add as genkinAdd, subtract as genkinSubtract, multiply as genkinMultiply, divide as genkinDivide, allocate as genkinAllocate } from '../operations/arithmetic.js';
import { equals as genkinEquals, lessThan as genkinLessThan, greaterThan as genkinGreaterThan, isZero as genkinIsZero, isPositive as genkinIsPositive, isNegative as genkinIsNegative } from '../operations/comparison.js';
import type { ScaledRatio, AllocationRatio } from '../operations/arithmetic.js';
import type { Currency } from './currencies.js';



/**
 * Dinero v2 compatible options for creating a dinero instance
 */
export interface DineroOptions<TAmount extends number> {
  amount: TAmount;
  currency: Currency<TAmount>;
  scale?: number;
}

/**
 * Dinero v2 compatible instance interface
 */
export interface DineroInstance<TAmount extends number> {
  toJSON(): { amount: TAmount; currency: Currency<TAmount>; scale: number };
  genkin: Genkin;
  currency: Currency<TAmount>;
}

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Dinero.js] ${message}`);
  }
}

/**
 * Internal wrapper class that provides Dinero v2 API around a Genkin instance
 */
class DineroWrapper<TAmount extends number> implements DineroInstance<TAmount> {
  private _genkin: Genkin;
  private _currency: Currency<TAmount>;

  constructor(genkin: Genkin, currency: Currency<TAmount>) {
    this._genkin = genkin;
    this._currency = currency;
  }

  toJSON(): { amount: TAmount; currency: Currency<TAmount>; scale: number } {
    return {
      amount: this._genkin.minorUnits as TAmount,
      currency: this._currency,
      scale: this._genkin.precision,
    };
  }
  get genkin(): Genkin {
    return this._genkin;
  }
  get currency(): Currency<TAmount> {
    return this._currency;
  }
}

/**
 * Create a dinero instance (Dinero v2 compatible)
 */
export function dinero<TAmount extends number>(options: DineroOptions<TAmount>): DineroInstance<TAmount> {
  // Extract only the allowed properties to clean up unwanted ones
  const { amount, currency, scale } = options;

  // Convert Dinero currency to Genkin currency
  assert(Number.isInteger(amount), 'Amount is invalid.');
  if (scale !== undefined) {
    assert(Number.isInteger(scale), 'Scale is invalid.');
  }

  // Clean the currency object to only include expected properties
  const cleanCurrency = {
    code: currency.code,
    base: currency.base,
    exponent: currency.exponent,
  };

  // Create Genkin instance with amount in minor units
  const genkinInstance = new Genkin(amount as number, { currency: cleanCurrency.code, precision: scale ?? cleanCurrency.exponent, isMinorUnits: true });

  // Wrap in Dinero-compatible interface
  return new DineroWrapper(genkinInstance, cleanCurrency);
}

export function toSnapshot<TAmount extends number>(dineroObject: DineroInstance<TAmount>): { amount: TAmount; currency: Currency<TAmount>; scale: number } {
  return dineroObject.toJSON();
}

export function add<TAmount extends number>(a: DineroInstance<TAmount>, b: DineroInstance<TAmount>): DineroInstance<TAmount> {
  return new DineroWrapper(genkinAdd(a.genkin, b.genkin), a.currency);
}
