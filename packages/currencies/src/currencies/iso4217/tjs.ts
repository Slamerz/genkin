import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * TJS Currency Configuration
 * Tajikistani Somoni (ISO 4217: TJS)
 */
export const TJS_CONFIG: CurrencyConfig = {
  code: 'TJS',
  numeric: 972,
  precision: 2,
  symbol: 'SM',
  name: 'Tajikistani Somoni',
  base: 10,
} as const;

/**
 * Create a TJS Currency instance
 * @returns Currency instance configured for Tajikistani Somoni
 */
export function createTJS(): Currency {
  return createCurrency(TJS_CONFIG);
}

/**
 * Default TJS Currency instance
 * Ready to use for most common scenarios
 */
export const TJS = createTJS();

/**
 * Type-safe TJS currency code
 */
export const TJS_CODE = 'TJS' as const;
export type TJSCode = typeof TJS_CODE;
