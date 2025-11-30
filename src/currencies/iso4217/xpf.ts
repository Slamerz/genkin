import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * XPF Currency Configuration
 * CFP Franc (ISO 4217: XPF)
 */
export const XPF_CONFIG: CurrencyConfig = {
  code: 'XPF',
  numeric: 953,
  precision: 0,
  symbol: '₣',
  name: 'CFP Franc',
  base: 10,
} as const;

/**
 * Create a XPF Currency instance
 * @returns Currency instance configured for CFP Francs
 */
export function createXPF(): Currency {
  return createCurrency(XPF_CONFIG);
}

/**
 * Default XPF Currency instance
 * Ready to use for most common scenarios
 */
export const XPF = createXPF();

/**
 * Type-safe XPF currency code
 */
export const XPF_CODE = 'XPF' as const;
export type XPFCode = typeof XPF_CODE;
