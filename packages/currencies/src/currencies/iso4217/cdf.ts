import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * CDF Currency Configuration
 * Congolese Franc (ISO 4217: CDF)
 */
export const CDF_CONFIG: CurrencyConfig = {
  code: 'CDF',
  numeric: 976,
  precision: 2,
  symbol: '₣',
  name: 'Congolese Franc',
  base: 10,
} as const;

/**
 * Create a CDF Currency instance
 * @returns Currency instance configured for Congolese Francs
 */
export function createCDF(): Currency {
  return createCurrency(CDF_CONFIG);
}

/**
 * Default CDF Currency instance
 * Ready to use for most common scenarios
 */
export const CDF = createCDF();

/**
 * Type-safe CDF currency code
 */
export const CDF_CODE = 'CDF' as const;
export type CDFCode = typeof CDF_CODE;
