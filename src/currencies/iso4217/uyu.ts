import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * UYU Currency Configuration
 * Uruguayan Peso (ISO 4217: UYU)
 */
export const UYU_CONFIG: CurrencyConfig = {
  code: 'UYU',
  numeric: 858,
  precision: 2,
  symbol: '$',
  name: 'Uruguayan Peso',
  base: 10,
} as const;

/**
 * Create a UYU Currency instance
 * @returns Currency instance configured for Uruguayan Pesos
 */
export function createUYU(): Currency {
  return createCurrency(UYU_CONFIG);
}

/**
 * Default UYU Currency instance
 * Ready to use for most common scenarios
 */
export const UYU = createUYU();

/**
 * Type-safe UYU currency code
 */
export const UYU_CODE = 'UYU' as const;
export type UYUCode = typeof UYU_CODE;
