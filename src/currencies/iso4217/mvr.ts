import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MVR Currency Configuration
 * Maldivian Rufiyaa (ISO 4217: MVR)
 */
export const MVR_CONFIG: CurrencyConfig = {
  code: 'MVR',
  numeric: 462,
  precision: 2,
  symbol: 'ރ',
  name: 'Maldivian Rufiyaa',
  base: 10,
} as const;

/**
 * Create a MVR Currency instance
 * @returns Currency instance configured for Maldivian Rufiyaas
 */
export function createMVR(): Currency {
  return createCurrency(MVR_CONFIG);
}

/**
 * Default MVR Currency instance
 * Ready to use for most common scenarios
 */
export const MVR = createMVR();

/**
 * Type-safe MVR currency code
 */
export const MVR_CODE = 'MVR' as const;
export type MVRCode = typeof MVR_CODE;
