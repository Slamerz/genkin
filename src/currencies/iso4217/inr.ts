import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * INR Currency Configuration
 * Indian Rupee (ISO 4217: INR)
 */
export const INR_CONFIG: CurrencyConfig = {
  code: 'INR',
  numeric: 356,
  precision: 2,
  symbol: '₨',
  name: 'Indian Rupee',
  base: 10,
} as const;

/**
 * Create a INR Currency instance
 * @returns Currency instance configured for Indian Rupees
 */
export function createINR(): Currency {
  return createCurrency(INR_CONFIG);
}

/**
 * Default INR Currency instance
 * Ready to use for most common scenarios
 */
export const INR = createINR();

/**
 * Type-safe INR currency code
 */
export const INR_CODE = 'INR' as const;
export type INRCode = typeof INR_CODE;
