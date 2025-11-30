import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * GHS Currency Configuration
 * Ghanaian Cedi (ISO 4217: GHS)
 */
export const GHS_CONFIG: CurrencyConfig = {
  code: 'GHS',
  numeric: 936,
  precision: 2,
  symbol: '₵',
  name: 'Ghanaian Cedi',
  base: 10,
} as const;

/**
 * Create a GHS Currency instance
 * @returns Currency instance configured for Ghanaian Cedis
 */
export function createGHS(): Currency {
  return createCurrency(GHS_CONFIG);
}

/**
 * Default GHS Currency instance
 * Ready to use for most common scenarios
 */
export const GHS = createGHS();

/**
 * Type-safe GHS currency code
 */
export const GHS_CODE = 'GHS' as const;
export type GHSCode = typeof GHS_CODE;
