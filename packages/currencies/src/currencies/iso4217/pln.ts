import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * PLN Currency Configuration
 * Polish Złoty (ISO 4217: PLN)
 */
export const PLN_CONFIG: CurrencyConfig = {
  code: 'PLN',
  numeric: 985,
  precision: 2,
  symbol: 'zł',
  name: 'Polish Złoty',
  base: 10,
} as const;

/**
 * Create a PLN Currency instance
 * @returns Currency instance configured for Polish Złoty
 */
export function createPLN(): Currency {
  return createCurrency(PLN_CONFIG);
}

/**
 * Default PLN Currency instance
 * Ready to use for most common scenarios
 */
export const PLN = createPLN();

/**
 * Type-safe PLN currency code
 */
export const PLN_CODE = 'PLN' as const;
export type PLNCode = typeof PLN_CODE;
