import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * DJF Currency Configuration
 * Djiboutian Franc (ISO 4217: DJF)
 */
export const DJF_CONFIG: CurrencyConfig = {
  code: 'DJF',
  numeric: 262,
  precision: 0,
  symbol: '₣',
  name: 'Djiboutian Franc',
  base: 10,
} as const;

/**
 * Create a DJF Currency instance
 * @returns Currency instance configured for Djiboutian Francs
 */
export function createDJF(): Currency {
  return createCurrency(DJF_CONFIG);
}

/**
 * Default DJF Currency instance
 * Ready to use for most common scenarios
 */
export const DJF = createDJF();

/**
 * Type-safe DJF currency code
 */
export const DJF_CODE = 'DJF' as const;
export type DJFCode = typeof DJF_CODE;
