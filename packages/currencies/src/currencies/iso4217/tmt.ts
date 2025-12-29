import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * TMT Currency Configuration
 * Turkmenistani Manat (ISO 4217: TMT)
 */
export const TMT_CONFIG: CurrencyConfig = {
  code: 'TMT',
  numeric: 934,
  precision: 2,
  symbol: 'm',
  name: 'Turkmenistani Manat',
  base: 10,
} as const;

/**
 * Create a TMT Currency instance
 * @returns Currency instance configured for Turkmenistani Manat
 */
export function createTMT(): Currency {
  return createCurrency(TMT_CONFIG);
}

/**
 * Default TMT Currency instance
 * Ready to use for most common scenarios
 */
export const TMT = createTMT();

/**
 * Type-safe TMT currency code
 */
export const TMT_CODE = 'TMT' as const;
export type TMTCode = typeof TMT_CODE;
