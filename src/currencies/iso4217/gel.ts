import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * GEL Currency Configuration
 * Georgian Lari (ISO 4217: GEL)
 */
export const GEL_CONFIG: CurrencyConfig = {
  code: 'GEL',
  numeric: 981,
  precision: 2,
  symbol: 'ლ',
  name: 'Georgian Lari',
  base: 10,
} as const;

/**
 * Create a GEL Currency instance
 * @returns Currency instance configured for Georgian Lari
 */
export function createGEL(): Currency {
  return createCurrency(GEL_CONFIG);
}

/**
 * Default GEL Currency instance
 * Ready to use for most common scenarios
 */
export const GEL = createGEL();

/**
 * Type-safe GEL currency code
 */
export const GEL_CODE = 'GEL' as const;
export type GELCode = typeof GEL_CODE;
