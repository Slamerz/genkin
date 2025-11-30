import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CHE Currency Configuration
 * WIR Euro (ISO 4217: CHE)
 */
export const CHE_CONFIG: CurrencyConfig = {
  code: 'CHE',
  numeric: 947,
  precision: 2,
  symbol: '',
  name: 'WIR Euro',
  base: 10,
} as const;

/**
 * Create a CHE Currency instance
 * @returns Currency instance configured for WIR Euros
 */
export function createCHE(): Currency {
  return createCurrency(CHE_CONFIG);
}

/**
 * Default CHE Currency instance
 * Ready to use for most common scenarios
 */
export const CHE = createCHE();

/**
 * Type-safe CHE currency code
 */
export const CHE_CODE = 'CHE' as const;
export type CHECode = typeof CHE_CODE;
