import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CHF Currency Configuration
 * Swiss Franc (ISO 4217: CHF)
 */
export const CHF_CONFIG: CurrencyConfig = {
  code: 'CHF',
  numeric: 756,
  precision: 2,
  symbol: '₣',
  name: 'Swiss Franc',
  base: 10,
} as const;

/**
 * Create a CHF Currency instance
 * @returns Currency instance configured for Swiss Francs
 */
export function createCHF(): Currency {
  return createCurrency(CHF_CONFIG);
}

/**
 * Default CHF Currency instance
 * Ready to use for most common scenarios
 */
export const CHF = createCHF();

/**
 * Type-safe CHF currency code
 */
export const CHF_CODE = 'CHF' as const;
export type CHFCode = typeof CHF_CODE;
