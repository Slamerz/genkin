import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * AZN Currency Configuration
 * Azerbaijani Manat (ISO 4217: AZN)
 */
export const AZN_CONFIG: CurrencyConfig = {
  code: 'AZN',
  numeric: 944,
  precision: 2,
  symbol: '₼',
  name: 'Azerbaijani Manat',
  base: 10,
} as const;

/**
 * Create a AZN Currency instance
 * @returns Currency instance configured for Azerbaijani Manat
 */
export function createAZN(): Currency {
  return createCurrency(AZN_CONFIG);
}

/**
 * Default AZN Currency instance
 * Ready to use for most common scenarios
 */
export const AZN = createAZN();

/**
 * Type-safe AZN currency code
 */
export const AZN_CODE = 'AZN' as const;
export type AZNCode = typeof AZN_CODE;
