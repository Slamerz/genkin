import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BGN Currency Configuration
 * Bulgarian Lev (ISO 4217: BGN)
 */
export const BGN_CONFIG: CurrencyConfig = {
  code: 'BGN',
  numeric: 975,
  precision: 2,
  symbol: 'лв',
  name: 'Bulgarian Lev',
  base: 10,
} as const;

/**
 * Create a BGN Currency instance
 * @returns Currency instance configured for Bulgarian Lev
 */
export function createBGN(): Currency {
  return createCurrency(BGN_CONFIG);
}

/**
 * Default BGN Currency instance
 * Ready to use for most common scenarios
 */
export const BGN = createBGN();

/**
 * Type-safe BGN currency code
 */
export const BGN_CODE = 'BGN' as const;
export type BGNCode = typeof BGN_CODE;
