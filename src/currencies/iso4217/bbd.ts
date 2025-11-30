import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BBD Currency Configuration
 * Barbadian Dollar (ISO 4217: BBD)
 */
export const BBD_CONFIG: CurrencyConfig = {
  code: 'BBD',
  numeric: 52,
  precision: 2,
  symbol: '$',
  name: 'Barbadian Dollar',
  base: 10,
} as const;

/**
 * Create a BBD Currency instance
 * @returns Currency instance configured for Barbadian Dollars
 */
export function createBBD(): Currency {
  return createCurrency(BBD_CONFIG);
}

/**
 * Default BBD Currency instance
 * Ready to use for most common scenarios
 */
export const BBD = createBBD();

/**
 * Type-safe BBD currency code
 */
export const BBD_CODE = 'BBD' as const;
export type BBDCode = typeof BBD_CODE;
