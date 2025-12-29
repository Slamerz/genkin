import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * VUV Currency Configuration
 * Vanuatu Vatu (ISO 4217: VUV)
 */
export const VUV_CONFIG: CurrencyConfig = {
  code: 'VUV',
  numeric: 548,
  precision: 0,
  symbol: 'VT',
  name: 'Vanuatu Vatu',
  base: 10,
} as const;

/**
 * Create a VUV Currency instance
 * @returns Currency instance configured for Vanuatu Vatus
 */
export function createVUV(): Currency {
  return createCurrency(VUV_CONFIG);
}

/**
 * Default VUV Currency instance
 * Ready to use for most common scenarios
 */
export const VUV = createVUV();

/**
 * Type-safe VUV currency code
 */
export const VUV_CODE = 'VUV' as const;
export type VUVCode = typeof VUV_CODE;
