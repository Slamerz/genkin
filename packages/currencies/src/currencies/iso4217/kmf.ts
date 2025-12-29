import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * KMF Currency Configuration
 * Comorian Franc (ISO 4217: KMF)
 */
export const KMF_CONFIG: CurrencyConfig = {
  code: 'KMF',
  numeric: 174,
  precision: 0,
  symbol: 'FC',
  name: 'Comorian Franc',
  base: 10,
} as const;

/**
 * Create a KMF Currency instance
 * @returns Currency instance configured for Comorian Francs
 */
export function createKMF(): Currency {
  return createCurrency(KMF_CONFIG);
}

/**
 * Default KMF Currency instance
 * Ready to use for most common scenarios
 */
export const KMF = createKMF();

/**
 * Type-safe KMF currency code
 */
export const KMF_CODE = 'KMF' as const;
export type KMFCode = typeof KMF_CODE;
