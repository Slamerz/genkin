import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * USN Currency Configuration
 * United States Dollar (Next day) (ISO 4217: USN)
 */
export const USN_CONFIG: CurrencyConfig = {
  code: 'USN',
  numeric: 997,
  precision: 2,
  symbol: '$',
  name: 'United States Dollar (Next day)',
  base: 10,
} as const;

/**
 * Create a USN Currency instance
 * @returns Currency instance configured for United States Dollars (Next day)
 */
export function createUSN(): Currency {
  return createCurrency(USN_CONFIG);
}

/**
 * Default USN Currency instance
 * Ready to use for most common scenarios
 */
export const USN = createUSN();

/**
 * Type-safe USN currency code
 */
export const USN_CODE = 'USN' as const;
export type USNCode = typeof USN_CODE;
