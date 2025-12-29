import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * LYD Currency Configuration
 * Libyan Dinar (ISO 4217: LYD)
 */
export const LYD_CONFIG: CurrencyConfig = {
  code: 'LYD',
  numeric: 434,
  precision: 3,
  symbol: 'ل.د',
  name: 'Libyan Dinar',
  base: 10,
} as const;

/**
 * Create a LYD Currency instance
 * @returns Currency instance configured for Libyan Dinars
 */
export function createLYD(): Currency {
  return createCurrency(LYD_CONFIG);
}

/**
 * Default LYD Currency instance
 * Ready to use for most common scenarios
 */
export const LYD = createLYD();

/**
 * Type-safe LYD currency code
 */
export const LYD_CODE = 'LYD' as const;
export type LYDCode = typeof LYD_CODE;
