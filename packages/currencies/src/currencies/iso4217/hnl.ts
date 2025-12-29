import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * HNL Currency Configuration
 * Honduran Lempira (ISO 4217: HNL)
 */
export const HNL_CONFIG: CurrencyConfig = {
  code: 'HNL',
  numeric: 340,
  precision: 2,
  symbol: 'L',
  name: 'Honduran Lempira',
  base: 10,
} as const;

/**
 * Create a HNL Currency instance
 * @returns Currency instance configured for Honduran Lempiras
 */
export function createHNL(): Currency {
  return createCurrency(HNL_CONFIG);
}

/**
 * Default HNL Currency instance
 * Ready to use for most common scenarios
 */
export const HNL = createHNL();

/**
 * Type-safe HNL currency code
 */
export const HNL_CODE = 'HNL' as const;
export type HNLCode = typeof HNL_CODE;
