import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * TND Currency Configuration
 * Tunisian Dinar (ISO 4217: TND)
 */
export const TND_CONFIG: CurrencyConfig = {
  code: 'TND',
  numeric: 788,
  precision: 3,
  symbol: 'د.ت ',
  name: 'Tunisian Dinar',
  base: 10,
} as const;

/**
 * Create a TND Currency instance
 * @returns Currency instance configured for Tunisian Dinars
 */
export function createTND(): Currency {
  return createCurrency(TND_CONFIG);
}

/**
 * Default TND Currency instance
 * Ready to use for most common scenarios
 */
export const TND = createTND();

/**
 * Type-safe TND currency code
 */
export const TND_CODE = 'TND' as const;
export type TNDCode = typeof TND_CODE;
