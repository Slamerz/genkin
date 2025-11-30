import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * USD Currency Configuration
 * United States Dollar (ISO 4217: USD)
 */
export const USD_CONFIG: CurrencyConfig = {
  code: 'USD',
  numeric: 840,
  precision: 2,
  symbol: '$',
  name: 'US Dollar',
  base: 10,
} as const;

/**
 * Create a USD Currency instance
 * @returns Currency instance configured for US Dollars
 */
export function createUSD(): Currency {
  return createCurrency(USD_CONFIG);
}

/**
 * Default USD Currency instance
 * Ready to use for most common scenarios
 */
export const USD = createUSD();

/**
 * Type-safe USD currency code
 */
export const USD_CODE = 'USD' as const;
export type USDCode = typeof USD_CODE; 