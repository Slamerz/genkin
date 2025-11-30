import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * TTD Currency Configuration
 * Trinidad and Tobago Dollar (ISO 4217: TTD)
 */
export const TTD_CONFIG: CurrencyConfig = {
  code: 'TTD',
  numeric: 780,
  precision: 2,
  symbol: '$',
  name: 'Trinidad and Tobago Dollar',
  base: 10,
} as const;

/**
 * Create a TTD Currency instance
 * @returns Currency instance configured for Trinidad and Tobago Dollars
 */
export function createTTD(): Currency {
  return createCurrency(TTD_CONFIG);
}

/**
 * Default TTD Currency instance
 * Ready to use for most common scenarios
 */
export const TTD = createTTD();

/**
 * Type-safe TTD currency code
 */
export const TTD_CODE = 'TTD' as const;
export type TTDCode = typeof TTD_CODE;
