import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * EGP Currency Configuration
 * Egyptian Pound (ISO 4217: EGP)
 */
export const EGP_CONFIG: CurrencyConfig = {
  code: 'EGP',
  numeric: 818,
  precision: 2,
  symbol: '£',
  name: 'Egyptian Pound',
  base: 10,
} as const;

/**
 * Create a EGP Currency instance
 * @returns Currency instance configured for Egyptian Pounds
 */
export function createEGP(): Currency {
  return createCurrency(EGP_CONFIG);
}

/**
 * Default EGP Currency instance
 * Ready to use for most common scenarios
 */
export const EGP = createEGP();

/**
 * Type-safe EGP currency code
 */
export const EGP_CODE = 'EGP' as const;
export type EGPCode = typeof EGP_CODE;
