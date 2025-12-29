import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * KRW Currency Configuration
 * South Korean Won (ISO 4217: KRW)
 */
export const KRW_CONFIG: CurrencyConfig = {
  code: 'KRW',
  numeric: 410,
  precision: 0,
  symbol: '₩',
  name: 'South Korean Won',
  base: 10,
} as const;

/**
 * Create a KRW Currency instance
 * @returns Currency instance configured for South Korean Won
 */
export function createKRW(): Currency {
  return createCurrency(KRW_CONFIG);
}

/**
 * Default KRW Currency instance
 * Ready to use for most common scenarios
 */
export const KRW = createKRW();

/**
 * Type-safe KRW currency code
 */
export const KRW_CODE = 'KRW' as const;
export type KRWCode = typeof KRW_CODE;
