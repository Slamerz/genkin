import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * KPW Currency Configuration
 * North Korean Won (ISO 4217: KPW)
 */
export const KPW_CONFIG: CurrencyConfig = {
  code: 'KPW',
  numeric: 408,
  precision: 2,
  symbol: '₩',
  name: 'North Korean Won',
  base: 10,
} as const;

/**
 * Create a KPW Currency instance
 * @returns Currency instance configured for North Korean Won
 */
export function createKPW(): Currency {
  return createCurrency(KPW_CONFIG);
}

/**
 * Default KPW Currency instance
 * Ready to use for most common scenarios
 */
export const KPW = createKPW();

/**
 * Type-safe KPW currency code
 */
export const KPW_CODE = 'KPW' as const;
export type KPWCode = typeof KPW_CODE;
