import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * SRD Currency Configuration
 * Surinamese Dollar (ISO 4217: SRD)
 */
export const SRD_CONFIG: CurrencyConfig = {
  code: 'SRD',
  numeric: 968,
  precision: 2,
  symbol: '$',
  name: 'Surinamese Dollar',
  base: 10,
} as const;

/**
 * Create a SRD Currency instance
 * @returns Currency instance configured for Surinamese Dollars
 */
export function createSRD(): Currency {
  return createCurrency(SRD_CONFIG);
}

/**
 * Default SRD Currency instance
 * Ready to use for most common scenarios
 */
export const SRD = createSRD();

/**
 * Type-safe SRD currency code
 */
export const SRD_CODE = 'SRD' as const;
export type SRDCode = typeof SRD_CODE;
