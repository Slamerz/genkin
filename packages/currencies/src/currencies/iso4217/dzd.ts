import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * DZD Currency Configuration
 * Algerian Dinar (ISO 4217: DZD)
 */
export const DZD_CONFIG: CurrencyConfig = {
  code: 'DZD',
  numeric: 12,
  precision: 2,
  symbol: 'د.ج',
  name: 'Algerian Dinar',
  base: 10,
} as const;

/**
 * Create a DZD Currency instance
 * @returns Currency instance configured for Algerian Dinars
 */
export function createDZD(): Currency {
  return createCurrency(DZD_CONFIG);
}

/**
 * Default DZD Currency instance
 * Ready to use for most common scenarios
 */
export const DZD = createDZD();

/**
 * Type-safe DZD currency code
 */
export const DZD_CODE = 'DZD' as const;
export type DZDCode = typeof DZD_CODE;
