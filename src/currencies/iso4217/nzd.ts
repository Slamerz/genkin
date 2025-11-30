import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * NZD Currency Configuration
 * New Zealand Dollar (ISO 4217: NZD)
 */
export const NZD_CONFIG: CurrencyConfig = {
  code: 'NZD',
  numeric: 554,
  precision: 2,
  symbol: '$',
  name: 'New Zealand Dollar',
  base: 10,
} as const;

/**
 * Create a NZD Currency instance
 * @returns Currency instance configured for New Zealand Dollars
 */
export function createNZD(): Currency {
  return createCurrency(NZD_CONFIG);
}

/**
 * Default NZD Currency instance
 * Ready to use for most common scenarios
 */
export const NZD = createNZD();

/**
 * Type-safe NZD currency code
 */
export const NZD_CODE = 'NZD' as const;
export type NZDCode = typeof NZD_CODE;
