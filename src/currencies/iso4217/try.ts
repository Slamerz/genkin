import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * TRY Currency Configuration
 * Turkish Lira (ISO 4217: TRY)
 */
export const TRY_CONFIG: CurrencyConfig = {
  code: 'TRY',
  numeric: 949,
  precision: 2,
  symbol: 'TL',
  name: 'Turkish Lira',
  base: 10,
} as const;

/**
 * Create a TRY Currency instance
 * @returns Currency instance configured for Turkish Lira
 */
export function createTRY(): Currency {
  return createCurrency(TRY_CONFIG);
}

/**
 * Default TRY Currency instance
 * Ready to use for most common scenarios
 */
export const TRY = createTRY();

/**
 * Type-safe TRY currency code
 */
export const TRY_CODE = 'TRY' as const;
export type TRYCode = typeof TRY_CODE;
