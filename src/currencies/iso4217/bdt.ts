import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BDT Currency Configuration
 * Bangladeshi Taka (ISO 4217: BDT)
 */
export const BDT_CONFIG: CurrencyConfig = {
  code: 'BDT',
  numeric: 50,
  precision: 2,
  symbol: '৳',
  name: 'Bangladeshi Taka',
  base: 10,
} as const;

/**
 * Create a BDT Currency instance
 * @returns Currency instance configured for Bangladeshi Taka
 */
export function createBDT(): Currency {
  return createCurrency(BDT_CONFIG);
}

/**
 * Default BDT Currency instance
 * Ready to use for most common scenarios
 */
export const BDT = createBDT();

/**
 * Type-safe BDT currency code
 */
export const BDT_CODE = 'BDT' as const;
export type BDTCode = typeof BDT_CODE;
