import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * NGN Currency Configuration
 * Nigerian Naira (ISO 4217: NGN)
 */
export const NGN_CONFIG: CurrencyConfig = {
  code: 'NGN',
  numeric: 566,
  precision: 2,
  symbol: '₦',
  name: 'Nigerian Naira',
  base: 10,
} as const;

/**
 * Create a NGN Currency instance
 * @returns Currency instance configured for Nigerian Nairas
 */
export function createNGN(): Currency {
  return createCurrency(NGN_CONFIG);
}

/**
 * Default NGN Currency instance
 * Ready to use for most common scenarios
 */
export const NGN = createNGN();

/**
 * Type-safe NGN currency code
 */
export const NGN_CODE = 'NGN' as const;
export type NGNCode = typeof NGN_CODE;
