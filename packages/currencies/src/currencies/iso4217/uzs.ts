import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * UZS Currency Configuration
 * Uzbekistan Som (ISO 4217: UZS)
 */
export const UZS_CONFIG: CurrencyConfig = {
  code: 'UZS',
  numeric: 860,
  precision: 2,
  symbol: 'лв',
  name: 'Uzbekistan Som',
  base: 10,
} as const;

/**
 * Create a UZS Currency instance
 * @returns Currency instance configured for Uzbekistan Sums
 */
export function createUZS(): Currency {
  return createCurrency(UZS_CONFIG);
}

/**
 * Default UZS Currency instance
 * Ready to use for most common scenarios
 */
export const UZS = createUZS();

/**
 * Type-safe UZS currency code
 */
export const UZS_CODE = 'UZS' as const;
export type UZSCode = typeof UZS_CODE;
