import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * IDR Currency Configuration
 * Indonesian Rupiah (ISO 4217: IDR)
 */
export const IDR_CONFIG: CurrencyConfig = {
  code: 'IDR',
  numeric: 360,
  precision: 0,
  symbol: 'Rp',
  name: 'Indonesian Rupiah',
  base: 10,
} as const;

/**
 * Create a IDR Currency instance
 * @returns Currency instance configured for Indonesian Rupiah
 */
export function createIDR(): Currency {
  return createCurrency(IDR_CONFIG);
}

/**
 * Default IDR Currency instance
 * Ready to use for most common scenarios
 */
export const IDR = createIDR();

/**
 * Type-safe IDR currency code
 */
export const IDR_CODE = 'IDR' as const;
export type IDRCode = typeof IDR_CODE;
