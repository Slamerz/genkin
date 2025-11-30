import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * LRD Currency Configuration
 * Liberian Dollar (ISO 4217: LRD)
 */
export const LRD_CONFIG: CurrencyConfig = {
  code: 'LRD',
  numeric: 430,
  precision: 2,
  symbol: '$',
  name: 'Liberian Dollar',
  base: 10,
} as const;

/**
 * Create a LRD Currency instance
 * @returns Currency instance configured for Liberian Dollars
 */
export function createLRD(): Currency {
  return createCurrency(LRD_CONFIG);
}

/**
 * Default LRD Currency instance
 * Ready to use for most common scenarios
 */
export const LRD = createLRD();

/**
 * Type-safe LRD currency code
 */
export const LRD_CODE = 'LRD' as const;
export type LRDCode = typeof LRD_CODE;
