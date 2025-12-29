import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * LKR Currency Configuration
 * Sri Lankan Rupee (ISO 4217: LKR)
 */
export const LKR_CONFIG: CurrencyConfig = {
  code: 'LKR',
  numeric: 144,
  precision: 2,
  symbol: 'Rs',
  name: 'Sri Lankan Rupee',
  base: 10,
} as const;

/**
 * Create a LKR Currency instance
 * @returns Currency instance configured for Sri Lankan Rupees
 */
export function createLKR(): Currency {
  return createCurrency(LKR_CONFIG);
}

/**
 * Default LKR Currency instance
 * Ready to use for most common scenarios
 */
export const LKR = createLKR();

/**
 * Type-safe LKR currency code
 */
export const LKR_CODE = 'LKR' as const;
export type LKRCode = typeof LKR_CODE;
