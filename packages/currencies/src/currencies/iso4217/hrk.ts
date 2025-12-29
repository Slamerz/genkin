import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * HRK Currency Configuration
 * Croatian Kuna (ISO 4217: HRK)
 */
export const HRK_CONFIG: CurrencyConfig = {
  code: 'HRK',
  numeric: 191,
  precision: 2,
  symbol: 'Kn',
  name: 'Croatian Kuna',
  base: 10,
} as const;

/**
 * Create a HRK Currency instance
 * @returns Currency instance configured for Croatian Kunas
 */
export function createHRK(): Currency {
  return createCurrency(HRK_CONFIG);
}

/**
 * Default HRK Currency instance
 * Ready to use for most common scenarios
 */
export const HRK = createHRK();

/**
 * Type-safe HRK currency code
 */
export const HRK_CODE = 'HRK' as const;
export type HRKCode = typeof HRK_CODE;
