import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * PKR Currency Configuration
 * Pakistani Rupee (ISO 4217: PKR)
 */
export const PKR_CONFIG: CurrencyConfig = {
  code: 'PKR',
  numeric: 586,
  precision: 2,
  symbol: '₨',
  name: 'Pakistani Rupee',
  base: 10,
} as const;

/**
 * Create a PKR Currency instance
 * @returns Currency instance configured for Pakistani Rupees
 */
export function createPKR(): Currency {
  return createCurrency(PKR_CONFIG);
}

/**
 * Default PKR Currency instance
 * Ready to use for most common scenarios
 */
export const PKR = createPKR();

/**
 * Type-safe PKR currency code
 */
export const PKR_CODE = 'PKR' as const;
export type PKRCode = typeof PKR_CODE;
