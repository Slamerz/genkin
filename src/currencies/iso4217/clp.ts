import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CLP Currency Configuration
 * Chilean Peso (ISO 4217: CLP)
 */
export const CLP_CONFIG: CurrencyConfig = {
  code: 'CLP',
  numeric: 152,
  precision: 0,
  symbol: '$',
  name: 'Chilean Peso',
  base: 10,
} as const;

/**
 * Create a CLP Currency instance
 * @returns Currency instance configured for Chilean Pesos
 */
export function createCLP(): Currency {
  return createCurrency(CLP_CONFIG);
}

/**
 * Default CLP Currency instance
 * Ready to use for most common scenarios
 */
export const CLP = createCLP();

/**
 * Type-safe CLP currency code
 */
export const CLP_CODE = 'CLP' as const;
export type CLPCode = typeof CLP_CODE;
