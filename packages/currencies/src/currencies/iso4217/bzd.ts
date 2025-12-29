import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * BZD Currency Configuration
 * Belize Dollar (ISO 4217: BZD)
 */
export const BZD_CONFIG: CurrencyConfig = {
  code: 'BZD',
  numeric: 84,
  precision: 2,
  symbol: '$',
  name: 'Belize Dollar',
  base: 10,
} as const;

/**
 * Create a BZD Currency instance
 * @returns Currency instance configured for Belize Dollars
 */
export function createBZD(): Currency {
  return createCurrency(BZD_CONFIG);
}

/**
 * Default BZD Currency instance
 * Ready to use for most common scenarios
 */
export const BZD = createBZD();

/**
 * Type-safe BZD currency code
 */
export const BZD_CODE = 'BZD' as const;
export type BZDCode = typeof BZD_CODE;
