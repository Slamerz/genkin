import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * LAK Currency Configuration
 * Lao Kip (ISO 4217: LAK)
 */
export const LAK_CONFIG: CurrencyConfig = {
  code: 'LAK',
  numeric: 418,
  precision: 2,
  symbol: '₭',
  name: 'Lao Kip',
  base: 10,
} as const;

/**
 * Create a LAK Currency instance
 * @returns Currency instance configured for Lao Kip
 */
export function createLAK(): Currency {
  return createCurrency(LAK_CONFIG);
}

/**
 * Default LAK Currency instance
 * Ready to use for most common scenarios
 */
export const LAK = createLAK();

/**
 * Type-safe LAK currency code
 */
export const LAK_CODE = 'LAK' as const;
export type LAKCode = typeof LAK_CODE;
