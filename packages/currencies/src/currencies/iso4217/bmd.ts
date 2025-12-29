import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * BMD Currency Configuration
 * Bermudian Dollar (ISO 4217: BMD)
 */
export const BMD_CONFIG: CurrencyConfig = {
  code: 'BMD',
  numeric: 60,
  precision: 2,
  symbol: '$',
  name: 'Bermudian Dollar',
  base: 10,
} as const;

/**
 * Create a BMD Currency instance
 * @returns Currency instance configured for Bermudian Dollars
 */
export function createBMD(): Currency {
  return createCurrency(BMD_CONFIG);
}

/**
 * Default BMD Currency instance
 * Ready to use for most common scenarios
 */
export const BMD = createBMD();

/**
 * Type-safe BMD currency code
 */
export const BMD_CODE = 'BMD' as const;
export type BMDCode = typeof BMD_CODE;
