import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MYR Currency Configuration
 * Malaysian Ringgit (ISO 4217: MYR)
 */
export const MYR_CONFIG: CurrencyConfig = {
  code: 'MYR',
  numeric: 458,
  precision: 2,
  symbol: 'RM',
  name: 'Malaysian Ringgit',
  base: 10,
} as const;

/**
 * Create a MYR Currency instance
 * @returns Currency instance configured for Malaysian Ringgit
 */
export function createMYR(): Currency {
  return createCurrency(MYR_CONFIG);
}

/**
 * Default MYR Currency instance
 * Ready to use for most common scenarios
 */
export const MYR = createMYR();

/**
 * Type-safe MYR currency code
 */
export const MYR_CODE = 'MYR' as const;
export type MYRCode = typeof MYR_CODE;
