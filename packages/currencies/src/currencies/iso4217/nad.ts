import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * NAD Currency Configuration
 * Namibian Dollar (ISO 4217: NAD)
 */
export const NAD_CONFIG: CurrencyConfig = {
  code: 'NAD',
  numeric: 516,
  precision: 2,
  symbol: '$',
  name: 'Namibian Dollar',
  base: 10,
} as const;

/**
 * Create a NAD Currency instance
 * @returns Currency instance configured for Namibian Dollars
 */
export function createNAD(): Currency {
  return createCurrency(NAD_CONFIG);
}

/**
 * Default NAD Currency instance
 * Ready to use for most common scenarios
 */
export const NAD = createNAD();

/**
 * Type-safe NAD currency code
 */
export const NAD_CODE = 'NAD' as const;
export type NADCode = typeof NAD_CODE;
