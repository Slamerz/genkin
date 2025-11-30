import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * FJD Currency Configuration
 * Fiji Dollar (ISO 4217: FJD)
 */
export const FJD_CONFIG: CurrencyConfig = {
  code: 'FJD',
  numeric: 242,
  precision: 2,
  symbol: '$',
  name: 'Fiji Dollar',
  base: 10,
} as const;

/**
 * Create a FJD Currency instance
 * @returns Currency instance configured for Fiji Dollars
 */
export function createFJD(): Currency {
  return createCurrency(FJD_CONFIG);
}

/**
 * Default FJD Currency instance
 * Ready to use for most common scenarios
 */
export const FJD = createFJD();

/**
 * Type-safe FJD currency code
 */
export const FJD_CODE = 'FJD' as const;
export type FJDCode = typeof FJD_CODE;
