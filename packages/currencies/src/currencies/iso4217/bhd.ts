import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * BHD Currency Configuration
 * Bahraini Dinar (ISO 4217: BHD)
 */
export const BHD_CONFIG: CurrencyConfig = {
  code: 'BHD',
  numeric: 48,
  precision: 3,
  symbol: 'ب.د',
  name: 'Bahraini Dinar',
  base: 10,
} as const;

/**
 * Create a BHD Currency instance
 * @returns Currency instance configured for Bahraini Dinars
 */
export function createBHD(): Currency {
  return createCurrency(BHD_CONFIG);
}

/**
 * Default BHD Currency instance
 * Ready to use for most common scenarios
 */
export const BHD = createBHD();

/**
 * Type-safe BHD currency code
 */
export const BHD_CODE = 'BHD' as const;
export type BHDCode = typeof BHD_CODE;
