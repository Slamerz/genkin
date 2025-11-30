import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * JPY Currency Configuration
 * Japanese Yen (ISO 4217: JPY)
 */
export const JPY_CONFIG: CurrencyConfig = {
  code: 'JPY',
  numeric: 392,
  precision: 0,
  symbol: '¥',
  name: 'Japanese Yen',
  base: 10,
} as const;

/**
 * Create a JPY Currency instance
 * @returns Currency instance configured for Japanese Yen
 */
export function createJPY(): Currency {
  return createCurrency(JPY_CONFIG);
}

/**
 * Default JPY Currency instance
 * Ready to use for most common scenarios
 */
export const JPY = createJPY();

/**
 * Type-safe JPY currency code
 */
export const JPY_CODE = 'JPY' as const;
export type JPYCode = typeof JPY_CODE;
