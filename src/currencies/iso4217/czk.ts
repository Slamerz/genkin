import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CZK Currency Configuration
 * Czech Koruna (ISO 4217: CZK)
 */
export const CZK_CONFIG: CurrencyConfig = {
  code: 'CZK',
  numeric: 203,
  precision: 2,
  symbol: 'Kč',
  name: 'Czech Koruna',
  base: 10,
} as const;

/**
 * Create a CZK Currency instance
 * @returns Currency instance configured for Czech Koruny
 */
export function createCZK(): Currency {
  return createCurrency(CZK_CONFIG);
}

/**
 * Default CZK Currency instance
 * Ready to use for most common scenarios
 */
export const CZK = createCZK();

/**
 * Type-safe CZK currency code
 */
export const CZK_CODE = 'CZK' as const;
export type CZKCode = typeof CZK_CODE;
