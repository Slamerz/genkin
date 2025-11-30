import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * XOF Currency Configuration
 * West African CFA Franc (ISO 4217: XOF)
 */
export const XOF_CONFIG: CurrencyConfig = {
  code: 'XOF',
  numeric: 952,
  precision: 0,
  symbol: 'Franc',
  name: 'West African CFA Franc',
  base: 10,
} as const;

/**
 * Create a XOF Currency instance
 * @returns Currency instance configured for West African CFA Francs
 */
export function createXOF(): Currency {
  return createCurrency(XOF_CONFIG);
}

/**
 * Default XOF Currency instance
 * Ready to use for most common scenarios
 */
export const XOF = createXOF();

/**
 * Type-safe XOF currency code
 */
export const XOF_CODE = 'XOF' as const;
export type XOFCode = typeof XOF_CODE;
