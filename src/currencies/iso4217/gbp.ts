import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * GBP Currency Configuration
 * British Pound Sterling (ISO 4217: GBP)
 */
export const GBP_CONFIG: CurrencyConfig = {
  code: 'GBP',
  numeric: 826,
  precision: 2,
  symbol: '£',
  name: 'British Pound Sterling',
  base: 10,
} as const;

/**
 * Create a GBP Currency instance
 * @returns Currency instance configured for British Pounds
 */
export function createGBP(): Currency {
  return createCurrency(GBP_CONFIG);
}

/**
 * Default GBP Currency instance
 * Ready to use for most common scenarios
 */
export const GBP = createGBP();

/**
 * Type-safe GBP currency code
 */
export const GBP_CODE = 'GBP' as const;
export type GBPCode = typeof GBP_CODE;
