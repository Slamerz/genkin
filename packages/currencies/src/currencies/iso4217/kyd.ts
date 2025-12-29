import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * KYD Currency Configuration
 * Cayman Islands Dollar (ISO 4217: KYD)
 */
export const KYD_CONFIG: CurrencyConfig = {
  code: 'KYD',
  numeric: 136,
  precision: 2,
  symbol: '$',
  name: 'Cayman Islands Dollar',
  base: 10,
} as const;

/**
 * Create a KYD Currency instance
 * @returns Currency instance configured for Cayman Islands Dollars
 */
export function createKYD(): Currency {
  return createCurrency(KYD_CONFIG);
}

/**
 * Default KYD Currency instance
 * Ready to use for most common scenarios
 */
export const KYD = createKYD();

/**
 * Type-safe KYD currency code
 */
export const KYD_CODE = 'KYD' as const;
export type KYDCode = typeof KYD_CODE;
