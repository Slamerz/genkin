import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * KZT Currency Configuration
 * Kazakhstani Tenge (ISO 4217: KZT)
 */
export const KZT_CONFIG: CurrencyConfig = {
  code: 'KZT',
  numeric: 398,
  precision: 2,
  symbol: '₸',
  name: 'Kazakhstani Tenge',
  base: 10,
} as const;

/**
 * Create a KZT Currency instance
 * @returns Currency instance configured for Kazakhstani Tenge
 */
export function createKZT(): Currency {
  return createCurrency(KZT_CONFIG);
}

/**
 * Default KZT Currency instance
 * Ready to use for most common scenarios
 */
export const KZT = createKZT();

/**
 * Type-safe KZT currency code
 */
export const KZT_CODE = 'KZT' as const;
export type KZTCode = typeof KZT_CODE;
