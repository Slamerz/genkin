import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * XAF Currency Configuration
 * Central African CFA Franc (ISO 4217: XAF)
 */
export const XAF_CONFIG: CurrencyConfig = {
  code: 'XAF',
  numeric: 950,
  precision: 0,
  symbol: 'CFA Franc BEAC',
  name: 'Central African CFA Franc',
  base: 10,
} as const;

/**
 * Create a XAF Currency instance
 * @returns Currency instance configured for Central African CFA Francs
 */
export function createXAF(): Currency {
  return createCurrency(XAF_CONFIG);
}

/**
 * Default XAF Currency instance
 * Ready to use for most common scenarios
 */
export const XAF = createXAF();

/**
 * Type-safe XAF currency code
 */
export const XAF_CODE = 'XAF' as const;
export type XAFCode = typeof XAF_CODE;
