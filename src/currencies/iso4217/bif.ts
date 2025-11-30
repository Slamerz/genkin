import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BIF Currency Configuration
 * Burundian Franc (ISO 4217: BIF)
 */
export const BIF_CONFIG: CurrencyConfig = {
  code: 'BIF',
  numeric: 108,
  precision: 0,
  symbol: '₣',
  name: 'Burundian Franc',
  base: 10,
} as const;

/**
 * Create a BIF Currency instance
 * @returns Currency instance configured for Burundian Francs
 */
export function createBIF(): Currency {
  return createCurrency(BIF_CONFIG);
}

/**
 * Default BIF Currency instance
 * Ready to use for most common scenarios
 */
export const BIF = createBIF();

/**
 * Type-safe BIF currency code
 */
export const BIF_CODE = 'BIF' as const;
export type BIFCode = typeof BIF_CODE;
