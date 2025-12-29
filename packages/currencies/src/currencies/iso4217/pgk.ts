import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * PGK Currency Configuration
 * Papua New Guinean Kina (ISO 4217: PGK)
 */
export const PGK_CONFIG: CurrencyConfig = {
  code: 'PGK',
  numeric: 598,
  precision: 2,
  symbol: 'K',
  name: 'Papua New Guinean Kina',
  base: 10,
} as const;

/**
 * Create a PGK Currency instance
 * @returns Currency instance configured for Papua New Guinean Kinas
 */
export function createPGK(): Currency {
  return createCurrency(PGK_CONFIG);
}

/**
 * Default PGK Currency instance
 * Ready to use for most common scenarios
 */
export const PGK = createPGK();

/**
 * Type-safe PGK currency code
 */
export const PGK_CODE = 'PGK' as const;
export type PGKCode = typeof PGK_CODE;
