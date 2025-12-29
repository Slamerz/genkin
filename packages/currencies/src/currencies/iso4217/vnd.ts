import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * VND Currency Configuration
 * Vietnamese Dong (ISO 4217: VND)
 */
export const VND_CONFIG: CurrencyConfig = {
  code: 'VND',
  numeric: 704,
  precision: 0,
  symbol: '₫',
  name: 'Vietnamese Dong',
  base: 10,
} as const;

/**
 * Create a VND Currency instance
 * @returns Currency instance configured for Vietnamese Dong
 */
export function createVND(): Currency {
  return createCurrency(VND_CONFIG);
}

/**
 * Default VND Currency instance
 * Ready to use for most common scenarios
 */
export const VND = createVND();

/**
 * Type-safe VND currency code
 */
export const VND_CODE = 'VND' as const;
export type VNDCode = typeof VND_CODE;
