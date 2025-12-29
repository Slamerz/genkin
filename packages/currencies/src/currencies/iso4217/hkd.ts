import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * HKD Currency Configuration
 * Hong Kong Dollar (ISO 4217: HKD)
 */
export const HKD_CONFIG: CurrencyConfig = {
  code: 'HKD',
  numeric: 344,
  precision: 2,
  symbol: '$',
  name: 'Hong Kong Dollar',
  base: 10,
} as const;

/**
 * Create a HKD Currency instance
 * @returns Currency instance configured for Hong Kong Dollars
 */
export function createHKD(): Currency {
  return createCurrency(HKD_CONFIG);
}

/**
 * Default HKD Currency instance
 * Ready to use for most common scenarios
 */
export const HKD = createHKD();

/**
 * Type-safe HKD currency code
 */
export const HKD_CODE = 'HKD' as const;
export type HKDCode = typeof HKD_CODE;
