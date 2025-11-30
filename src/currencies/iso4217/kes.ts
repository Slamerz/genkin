import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * KES Currency Configuration
 * Kenyan Shilling (ISO 4217: KES)
 */
export const KES_CONFIG: CurrencyConfig = {
  code: 'KES',
  numeric: 404,
  precision: 2,
  symbol: 'Sh',
  name: 'Kenyan Shilling',
  base: 10,
} as const;

/**
 * Create a KES Currency instance
 * @returns Currency instance configured for Kenyan Shillings
 */
export function createKES(): Currency {
  return createCurrency(KES_CONFIG);
}

/**
 * Default KES Currency instance
 * Ready to use for most common scenarios
 */
export const KES = createKES();

/**
 * Type-safe KES currency code
 */
export const KES_CODE = 'KES' as const;
export type KESCode = typeof KES_CODE;
