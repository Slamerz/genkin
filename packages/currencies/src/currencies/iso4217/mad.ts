import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * MAD Currency Configuration
 * Moroccan Dirham (ISO 4217: MAD)
 */
export const MAD_CONFIG: CurrencyConfig = {
  code: 'MAD',
  numeric: 504,
  precision: 2,
  symbol: 'د.م.',
  name: 'Moroccan Dirham',
  base: 10,
} as const;

/**
 * Create a MAD Currency instance
 * @returns Currency instance configured for Moroccan Dirhams
 */
export function createMAD(): Currency {
  return createCurrency(MAD_CONFIG);
}

/**
 * Default MAD Currency instance
 * Ready to use for most common scenarios
 */
export const MAD = createMAD();

/**
 * Type-safe MAD currency code
 */
export const MAD_CODE = 'MAD' as const;
export type MADCode = typeof MAD_CODE;
