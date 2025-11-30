import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * ISK Currency Configuration
 * Icelandic Króna (ISO 4217: ISK)
 */
export const ISK_CONFIG: CurrencyConfig = {
  code: 'ISK',
  numeric: 352,
  precision: 0,
  symbol: 'kr',
  name: 'Icelandic Króna',
  base: 10,
} as const;

/**
 * Create a ISK Currency instance
 * @returns Currency instance configured for Icelandic Krónur
 */
export function createISK(): Currency {
  return createCurrency(ISK_CONFIG);
}

/**
 * Default ISK Currency instance
 * Ready to use for most common scenarios
 */
export const ISK = createISK();

/**
 * Type-safe ISK currency code
 */
export const ISK_CODE = 'ISK' as const;
export type ISKCode = typeof ISK_CODE;
