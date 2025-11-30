import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * EUR Currency Configuration
 * Euro (ISO 4217: EUR)
 */
export const EUR_CONFIG: CurrencyConfig = {
  code: 'EUR',
  numeric: 978,
  precision: 2,
  symbol: '€',
  name: 'Euro',
  base: 10,
} as const;

/**
 * Create a EUR Currency instance
 * @returns Currency instance configured for Euros
 */
export function createEUR(): Currency {
  return createCurrency(EUR_CONFIG);
}

/**
 * Default EUR Currency instance
 * Ready to use for most common scenarios
 */
export const EUR = createEUR();

/**
 * Type-safe EUR currency code
 */
export const EUR_CODE = 'EUR' as const;
export type EURCode = typeof EUR_CODE;
