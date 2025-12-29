import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * FKP Currency Configuration
 * Falkland Islands Pound (ISO 4217: FKP)
 */
export const FKP_CONFIG: CurrencyConfig = {
  code: 'FKP',
  numeric: 238,
  precision: 2,
  symbol: '£',
  name: 'Falkland Islands Pound',
  base: 10,
} as const;

/**
 * Create a FKP Currency instance
 * @returns Currency instance configured for Falkland Islands Pounds
 */
export function createFKP(): Currency {
  return createCurrency(FKP_CONFIG);
}

/**
 * Default FKP Currency instance
 * Ready to use for most common scenarios
 */
export const FKP = createFKP();

/**
 * Type-safe FKP currency code
 */
export const FKP_CODE = 'FKP' as const;
export type FKPCode = typeof FKP_CODE;
