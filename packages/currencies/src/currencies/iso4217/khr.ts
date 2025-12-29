import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * KHR Currency Configuration
 * Cambodian Riel (ISO 4217: KHR)
 */
export const KHR_CONFIG: CurrencyConfig = {
  code: 'KHR',
  numeric: 116,
  precision: 2,
  symbol: '៛',
  name: 'Cambodian Riel',
  base: 10,
} as const;

/**
 * Create a KHR Currency instance
 * @returns Currency instance configured for Cambodian Riels
 */
export function createKHR(): Currency {
  return createCurrency(KHR_CONFIG);
}

/**
 * Default KHR Currency instance
 * Ready to use for most common scenarios
 */
export const KHR = createKHR();

/**
 * Type-safe KHR currency code
 */
export const KHR_CODE = 'KHR' as const;
export type KHRCode = typeof KHR_CODE;
