import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * AMD Currency Configuration
 * Armenian Dram (ISO 4217: AMD)
 */
export const AMD_CONFIG: CurrencyConfig = {
  code: 'AMD',
  numeric: 51,
  precision: 2,
  symbol: '֏',
  name: 'Armenian Dram',
  base: 10,
} as const;

/**
 * Create a AMD Currency instance
 * @returns Currency instance configured for Armenian Dram
 */
export function createAMD(): Currency {
  return createCurrency(AMD_CONFIG);
}

/**
 * Default AMD Currency instance
 * Ready to use for most common scenarios
 */
export const AMD = createAMD();

/**
 * Type-safe AMD currency code
 */
export const AMD_CODE = 'AMD' as const;
export type AMDCode = typeof AMD_CODE;
