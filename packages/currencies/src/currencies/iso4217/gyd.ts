import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * GYD Currency Configuration
 * Guyanaese Dollar (ISO 4217: GYD)
 */
export const GYD_CONFIG: CurrencyConfig = {
  code: 'GYD',
  numeric: 328,
  precision: 2,
  symbol: '$',
  name: 'Guyanaese Dollar',
  base: 10,
} as const;

/**
 * Create a GYD Currency instance
 * @returns Currency instance configured for Guyanaese Dollars
 */
export function createGYD(): Currency {
  return createCurrency(GYD_CONFIG);
}

/**
 * Default GYD Currency instance
 * Ready to use for most common scenarios
 */
export const GYD = createGYD();

/**
 * Type-safe GYD currency code
 */
export const GYD_CODE = 'GYD' as const;
export type GYDCode = typeof GYD_CODE;
