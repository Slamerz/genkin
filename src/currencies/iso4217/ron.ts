import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * RON Currency Configuration
 * Romanian Leu (ISO 4217: RON)
 */
export const RON_CONFIG: CurrencyConfig = {
  code: 'RON',
  numeric: 946,
  precision: 2,
  symbol: 'L',
  name: 'Romanian Leu',
  base: 10,
} as const;

/**
 * Create a RON Currency instance
 * @returns Currency instance configured for Romanian Lei
 */
export function createRON(): Currency {
  return createCurrency(RON_CONFIG);
}

/**
 * Default RON Currency instance
 * Ready to use for most common scenarios
 */
export const RON = createRON();

/**
 * Type-safe RON currency code
 */
export const RON_CODE = 'RON' as const;
export type RONCode = typeof RON_CODE;
