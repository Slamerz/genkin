import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * MMK Currency Configuration
 * Myanmar Kyat (ISO 4217: MMK)
 */
export const MMK_CONFIG: CurrencyConfig = {
  code: 'MMK',
  numeric: 104,
  precision: 2,
  symbol: 'K',
  name: 'Myanmar Kyat',
  base: 10,
} as const;

/**
 * Create a MMK Currency instance
 * @returns Currency instance configured for Myanmar Kyats
 */
export function createMMK(): Currency {
  return createCurrency(MMK_CONFIG);
}

/**
 * Default MMK Currency instance
 * Ready to use for most common scenarios
 */
export const MMK = createMMK();

/**
 * Type-safe MMK currency code
 */
export const MMK_CODE = 'MMK' as const;
export type MMKCode = typeof MMK_CODE;
