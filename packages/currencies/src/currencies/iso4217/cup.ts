import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * CUP Currency Configuration
 * Cuban Peso (ISO 4217: CUP)
 */
export const CUP_CONFIG: CurrencyConfig = {
  code: 'CUP',
  numeric: 192,
  precision: 2,
  symbol: '₱',
  name: 'Cuban Peso',
  base: 10,
} as const;

/**
 * Create a CUP Currency instance
 * @returns Currency instance configured for Cuban Pesos
 */
export function createCUP(): Currency {
  return createCurrency(CUP_CONFIG);
}

/**
 * Default CUP Currency instance
 * Ready to use for most common scenarios
 */
export const CUP = createCUP();

/**
 * Type-safe CUP currency code
 */
export const CUP_CODE = 'CUP' as const;
export type CUPCode = typeof CUP_CODE;
