import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ALL Currency Configuration
 * Albanian Lek (ISO 4217: ALL)
 */
export const ALL_CONFIG: CurrencyConfig = {
  code: 'ALL',
  numeric: 8,
  precision: 2,
  symbol: 'Lek',
  name: 'Albanian Lek',
  base: 10,
} as const;

/**
 * Create a ALL Currency instance
 * @returns Currency instance configured for Albanian Lek
 */
export function createALL(): Currency {
  return createCurrency(ALL_CONFIG);
}

/**
 * Default ALL Currency instance
 * Ready to use for most common scenarios
 */
export const ALL = createALL();

/**
 * Type-safe ALL currency code
 */
export const ALL_CODE = 'ALL' as const;
export type ALLCode = typeof ALL_CODE;
