import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * GMD Currency Configuration
 * Gambian Dalasi (ISO 4217: GMD)
 */
export const GMD_CONFIG: CurrencyConfig = {
  code: 'GMD',
  numeric: 270,
  precision: 2,
  symbol: 'D',
  name: 'Gambian Dalasi',
  base: 10,
} as const;

/**
 * Create a GMD Currency instance
 * @returns Currency instance configured for Gambian Dalasis
 */
export function createGMD(): Currency {
  return createCurrency(GMD_CONFIG);
}

/**
 * Default GMD Currency instance
 * Ready to use for most common scenarios
 */
export const GMD = createGMD();

/**
 * Type-safe GMD currency code
 */
export const GMD_CODE = 'GMD' as const;
export type GMDCode = typeof GMD_CODE;
