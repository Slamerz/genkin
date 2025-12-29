import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ZAR Currency Configuration
 * South African Rand (ISO 4217: ZAR)
 */
export const ZAR_CONFIG: CurrencyConfig = {
  code: 'ZAR',
  numeric: 710,
  precision: 2,
  symbol: 'R',
  name: 'South African Rand',
  base: 10,
} as const;

/**
 * Create a ZAR Currency instance
 * @returns Currency instance configured for South African Rand
 */
export function createZAR(): Currency {
  return createCurrency(ZAR_CONFIG);
}

/**
 * Default ZAR Currency instance
 * Ready to use for most common scenarios
 */
export const ZAR = createZAR();

/**
 * Type-safe ZAR currency code
 */
export const ZAR_CODE = 'ZAR' as const;
export type ZARCode = typeof ZAR_CODE;
