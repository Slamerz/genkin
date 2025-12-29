import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * SAR Currency Configuration
 * Saudi Riyal (ISO 4217: SAR)
 */
export const SAR_CONFIG: CurrencyConfig = {
  code: 'SAR',
  numeric: 682,
  precision: 2,
  symbol: 'ر.س ',
  name: 'Saudi Riyal',
  base: 10,
} as const;

/**
 * Create a SAR Currency instance
 * @returns Currency instance configured for Saudi Riyals
 */
export function createSAR(): Currency {
  return createCurrency(SAR_CONFIG);
}

/**
 * Default SAR Currency instance
 * Ready to use for most common scenarios
 */
export const SAR = createSAR();

/**
 * Type-safe SAR currency code
 */
export const SAR_CODE = 'SAR' as const;
export type SARCode = typeof SAR_CODE;
