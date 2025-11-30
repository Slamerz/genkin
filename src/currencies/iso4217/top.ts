import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * TOP Currency Configuration
 * Tongan Pa'anga (ISO 4217: TOP)
 */
export const TOP_CONFIG: CurrencyConfig = {
  code: 'TOP',
  numeric: 776,
  precision: 2,
  symbol: 'T$',
  name: 'Tongan Pa\'anga',
  base: 10,
} as const;

/**
 * Create a TOP Currency instance
 * @returns Currency instance configured for Tongan Pa'angas
 */
export function createTOP(): Currency {
  return createCurrency(TOP_CONFIG);
}

/**
 * Default TOP Currency instance
 * Ready to use for most common scenarios
 */
export const TOP = createTOP();

/**
 * Type-safe TOP currency code
 */
export const TOP_CODE = 'TOP' as const;
export type TOPCode = typeof TOP_CODE;
