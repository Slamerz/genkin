import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * BYN Currency Configuration
 * Belarusian Ruble (ISO 4217: BYN)
 */
export const BYN_CONFIG: CurrencyConfig = {
  code: 'BYN',
  numeric: 933,
  precision: 2,
  symbol: 'p.',
  name: 'Belarusian Ruble',
  base: 10,
} as const;

/**
 * Create a BYN Currency instance
 * @returns Currency instance configured for Belarusian Rubles
 */
export function createBYN(): Currency {
  return createCurrency(BYN_CONFIG);
}

/**
 * Default BYN Currency instance
 * Ready to use for most common scenarios
 */
export const BYN = createBYN();

/**
 * Type-safe BYN currency code
 */
export const BYN_CODE = 'BYN' as const;
export type BYNCode = typeof BYN_CODE;
