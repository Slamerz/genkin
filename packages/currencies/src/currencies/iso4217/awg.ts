import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * AWG Currency Configuration
 * Aruban Florin (ISO 4217: AWG)
 */
export const AWG_CONFIG: CurrencyConfig = {
  code: 'AWG',
  numeric: 533,
  precision: 2,
  symbol: 'ƒ',
  name: 'Aruban Florin',
  base: 10,
} as const;

/**
 * Create a AWG Currency instance
 * @returns Currency instance configured for Aruban Florins
 */
export function createAWG(): Currency {
  return createCurrency(AWG_CONFIG);
}

/**
 * Default AWG Currency instance
 * Ready to use for most common scenarios
 */
export const AWG = createAWG();

/**
 * Type-safe AWG currency code
 */
export const AWG_CODE = 'AWG' as const;
export type AWGCode = typeof AWG_CODE;
