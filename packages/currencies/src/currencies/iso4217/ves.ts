import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * VES Currency Configuration
 * Venezuelan Bolívar Soberano (ISO 4217: VES)
 */
export const VES_CONFIG: CurrencyConfig = {
  code: 'VES',
  numeric: 928,
  precision: 2,
  symbol: '',
  name: 'Venezuelan Bolívar Soberano',
  base: 10,
} as const;

/**
 * Create a VES Currency instance
 * @returns Currency instance configured for Venezuelan Bolívar Soberanos
 */
export function createVES(): Currency {
  return createCurrency(VES_CONFIG);
}

/**
 * Default VES Currency instance
 * Ready to use for most common scenarios
 */
export const VES = createVES();

/**
 * Type-safe VES currency code
 */
export const VES_CODE = 'VES' as const;
export type VESCode = typeof VES_CODE;
