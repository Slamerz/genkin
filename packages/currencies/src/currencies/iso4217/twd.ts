import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * TWD Currency Configuration
 * New Taiwan Dollar (ISO 4217: TWD)
 */
export const TWD_CONFIG: CurrencyConfig = {
  code: 'TWD',
  numeric: 901,
  precision: 2,
  symbol: 'NT$',
  name: 'New Taiwan Dollar',
  base: 10,
} as const;

/**
 * Create a TWD Currency instance
 * @returns Currency instance configured for New Taiwan Dollars
 */
export function createTWD(): Currency {
  return createCurrency(TWD_CONFIG);
}

/**
 * Default TWD Currency instance
 * Ready to use for most common scenarios
 */
export const TWD = createTWD();

/**
 * Type-safe TWD currency code
 */
export const TWD_CODE = 'TWD' as const;
export type TWDCode = typeof TWD_CODE;
