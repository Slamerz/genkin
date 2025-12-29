import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * SZL Currency Configuration
 * Swazi Lilangeni (ISO 4217: SZL)
 */
export const SZL_CONFIG: CurrencyConfig = {
  code: 'SZL',
  numeric: 748,
  precision: 2,
  symbol: 'L',
  name: 'Swazi Lilangeni',
  base: 10,
} as const;

/**
 * Create a SZL Currency instance
 * @returns Currency instance configured for Swazi Lilangenis
 */
export function createSZL(): Currency {
  return createCurrency(SZL_CONFIG);
}

/**
 * Default SZL Currency instance
 * Ready to use for most common scenarios
 */
export const SZL = createSZL();

/**
 * Type-safe SZL currency code
 */
export const SZL_CODE = 'SZL' as const;
export type SZLCode = typeof SZL_CODE;
