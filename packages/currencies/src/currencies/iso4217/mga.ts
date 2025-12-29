import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * MGA Currency Configuration
 * Malagasy Ariary (ISO 4217: MGA)
 */
export const MGA_CONFIG: CurrencyConfig = {
  code: 'MGA',
  numeric: 969,
  precision: 1,
  symbol: '',
  name: 'Malagasy Ariary',
  base: 5,
} as const;

/**
 * Create a MGA Currency instance
 * @returns Currency instance configured for Malagasy Ariary
 */
export function createMGA(): Currency {
  return createCurrency(MGA_CONFIG);
}

/**
 * Default MGA Currency instance
 * Ready to use for most common scenarios
 */
export const MGA = createMGA();

/**
 * Type-safe MGA currency code
 */
export const MGA_CODE = 'MGA' as const;
export type MGACode = typeof MGA_CODE;
