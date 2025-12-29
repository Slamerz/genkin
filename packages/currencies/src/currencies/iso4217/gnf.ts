import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * GNF Currency Configuration
 * Guinean Franc (ISO 4217: GNF)
 */
export const GNF_CONFIG: CurrencyConfig = {
  code: 'GNF',
  numeric: 324,
  precision: 0,
  symbol: '₣',
  name: 'Guinean Franc',
  base: 10,
} as const;

/**
 * Create a GNF Currency instance
 * @returns Currency instance configured for Guinean Francs
 */
export function createGNF(): Currency {
  return createCurrency(GNF_CONFIG);
}

/**
 * Default GNF Currency instance
 * Ready to use for most common scenarios
 */
export const GNF = createGNF();

/**
 * Type-safe GNF currency code
 */
export const GNF_CODE = 'GNF' as const;
export type GNFCode = typeof GNF_CODE;
