import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BND Currency Configuration
 * Brunei Dollar (ISO 4217: BND)
 */
export const BND_CONFIG: CurrencyConfig = {
  code: 'BND',
  numeric: 96,
  precision: 2,
  symbol: '$',
  name: 'Brunei Dollar',
  base: 10,
} as const;

/**
 * Create a BND Currency instance
 * @returns Currency instance configured for Brunei Dollars
 */
export function createBND(): Currency {
  return createCurrency(BND_CONFIG);
}

/**
 * Default BND Currency instance
 * Ready to use for most common scenarios
 */
export const BND = createBND();

/**
 * Type-safe BND currency code
 */
export const BND_CODE = 'BND' as const;
export type BNDCode = typeof BND_CODE;
