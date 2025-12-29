import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * SEK Currency Configuration
 * Swedish Krona (ISO 4217: SEK)
 */
export const SEK_CONFIG: CurrencyConfig = {
  code: 'SEK',
  numeric: 752,
  precision: 2,
  symbol: 'kr',
  name: 'Swedish Krona',
  base: 10,
} as const;

/**
 * Create a SEK Currency instance
 * @returns Currency instance configured for Swedish Kronor
 */
export function createSEK(): Currency {
  return createCurrency(SEK_CONFIG);
}

/**
 * Default SEK Currency instance
 * Ready to use for most common scenarios
 */
export const SEK = createSEK();

/**
 * Type-safe SEK currency code
 */
export const SEK_CODE = 'SEK' as const;
export type SEKCode = typeof SEK_CODE;
