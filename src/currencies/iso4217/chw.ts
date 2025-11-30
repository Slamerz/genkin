import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CHW Currency Configuration
 * WIR Franc (ISO 4217: CHW)
 */
export const CHW_CONFIG: CurrencyConfig = {
  code: 'CHW',
  numeric: 948,
  precision: 2,
  symbol: '',
  name: 'WIR Franc',
  base: 10,
} as const;

/**
 * Create a CHW Currency instance
 * @returns Currency instance configured for WIR Francs
 */
export function createCHW(): Currency {
  return createCurrency(CHW_CONFIG);
}

/**
 * Default CHW Currency instance
 * Ready to use for most common scenarios
 */
export const CHW = createCHW();

/**
 * Type-safe CHW currency code
 */
export const CHW_CODE = 'CHW' as const;
export type CHWCode = typeof CHW_CODE;
