import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * RWF Currency Configuration
 * Rwandan Franc (ISO 4217: RWF)
 */
export const RWF_CONFIG: CurrencyConfig = {
  code: 'RWF',
  numeric: 646,
  precision: 0,
  symbol: '₣',
  name: 'Rwandan Franc',
  base: 10,
} as const;

/**
 * Create a RWF Currency instance
 * @returns Currency instance configured for Rwandan Francs
 */
export function createRWF(): Currency {
  return createCurrency(RWF_CONFIG);
}

/**
 * Default RWF Currency instance
 * Ready to use for most common scenarios
 */
export const RWF = createRWF();

/**
 * Type-safe RWF currency code
 */
export const RWF_CODE = 'RWF' as const;
export type RWFCode = typeof RWF_CODE;
