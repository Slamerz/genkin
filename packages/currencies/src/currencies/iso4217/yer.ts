import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * YER Currency Configuration
 * Yemeni Rial (ISO 4217: YER)
 */
export const YER_CONFIG: CurrencyConfig = {
  code: 'YER',
  numeric: 886,
  precision: 2,
  symbol: '﷼',
  name: 'Yemeni Rial',
  base: 10,
} as const;

/**
 * Create a YER Currency instance
 * @returns Currency instance configured for Yemeni Rials
 */
export function createYER(): Currency {
  return createCurrency(YER_CONFIG);
}

/**
 * Default YER Currency instance
 * Ready to use for most common scenarios
 */
export const YER = createYER();

/**
 * Type-safe YER currency code
 */
export const YER_CODE = 'YER' as const;
export type YERCode = typeof YER_CODE;
