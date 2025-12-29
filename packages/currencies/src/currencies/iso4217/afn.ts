import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * AFN Currency Configuration
 * Afghan Afghani (ISO 4217: AFN)
 */
export const AFN_CONFIG: CurrencyConfig = {
  code: 'AFN',
  numeric: 971,
  precision: 2,
  symbol: '؋',
  name: 'Afghan Afghani',
  base: 10,
} as const;

/**
 * Create a AFN Currency instance
 * @returns Currency instance configured for Afghan Afghanis
 */
export function createAFN(): Currency {
  return createCurrency(AFN_CONFIG);
}

/**
 * Default AFN Currency instance
 * Ready to use for most common scenarios
 */
export const AFN = createAFN();

/**
 * Type-safe AFN currency code
 */
export const AFN_CODE = 'AFN' as const;
export type AFNCode = typeof AFN_CODE;
