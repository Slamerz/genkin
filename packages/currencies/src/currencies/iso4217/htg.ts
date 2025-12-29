import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * HTG Currency Configuration
 * Haitian Gourde (ISO 4217: HTG)
 */
export const HTG_CONFIG: CurrencyConfig = {
  code: 'HTG',
  numeric: 332,
  precision: 2,
  symbol: 'G',
  name: 'Haitian Gourde',
  base: 10,
} as const;

/**
 * Create a HTG Currency instance
 * @returns Currency instance configured for Haitian Gourdes
 */
export function createHTG(): Currency {
  return createCurrency(HTG_CONFIG);
}

/**
 * Default HTG Currency instance
 * Ready to use for most common scenarios
 */
export const HTG = createHTG();

/**
 * Type-safe HTG currency code
 */
export const HTG_CODE = 'HTG' as const;
export type HTGCode = typeof HTG_CODE;
