import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * AUD Currency Configuration
 * Australian Dollar (ISO 4217: AUD)
 */
export const AUD_CONFIG: CurrencyConfig = {
  code: 'AUD',
  numeric: 36,
  precision: 2,
  symbol: '$',
  name: 'Australian Dollar',
  base: 10,
} as const;

/**
 * Create a AUD Currency instance
 * @returns Currency instance configured for Australian Dollars
 */
export function createAUD(): Currency {
  return createCurrency(AUD_CONFIG);
}

/**
 * Default AUD Currency instance
 * Ready to use for most common scenarios
 */
export const AUD = createAUD();

/**
 * Type-safe AUD currency code
 */
export const AUD_CODE = 'AUD' as const;
export type AUDCode = typeof AUD_CODE;
