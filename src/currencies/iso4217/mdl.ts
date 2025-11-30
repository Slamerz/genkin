import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MDL Currency Configuration
 * Moldovan Leu (ISO 4217: MDL)
 */
export const MDL_CONFIG: CurrencyConfig = {
  code: 'MDL',
  numeric: 498,
  precision: 2,
  symbol: 'L',
  name: 'Moldovan Leu',
  base: 10,
} as const;

/**
 * Create a MDL Currency instance
 * @returns Currency instance configured for Moldovan Lei
 */
export function createMDL(): Currency {
  return createCurrency(MDL_CONFIG);
}

/**
 * Default MDL Currency instance
 * Ready to use for most common scenarios
 */
export const MDL = createMDL();

/**
 * Type-safe MDL currency code
 */
export const MDL_CODE = 'MDL' as const;
export type MDLCode = typeof MDL_CODE;
