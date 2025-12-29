import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * AOA Currency Configuration
 * Angolan Kwanza (ISO 4217: AOA)
 */
export const AOA_CONFIG: CurrencyConfig = {
  code: 'AOA',
  numeric: 973,
  precision: 2,
  symbol: 'is',
  name: 'Angolan Kwanza',
  base: 10,
} as const;

/**
 * Create a AOA Currency instance
 * @returns Currency instance configured for Angolan Kwanzas
 */
export function createAOA(): Currency {
  return createCurrency(AOA_CONFIG);
}

/**
 * Default AOA Currency instance
 * Ready to use for most common scenarios
 */
export const AOA = createAOA();

/**
 * Type-safe AOA currency code
 */
export const AOA_CODE = 'AOA' as const;
export type AOACode = typeof AOA_CODE;
