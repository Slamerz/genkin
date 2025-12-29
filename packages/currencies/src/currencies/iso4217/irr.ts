import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * IRR Currency Configuration
 * Iranian Rial (ISO 4217: IRR)
 */
export const IRR_CONFIG: CurrencyConfig = {
  code: 'IRR',
  numeric: 364,
  precision: 2,
  symbol: '﷼',
  name: 'Iranian Rial',
  base: 10,
} as const;

/**
 * Create a IRR Currency instance
 * @returns Currency instance configured for Iranian Rials
 */
export function createIRR(): Currency {
  return createCurrency(IRR_CONFIG);
}

/**
 * Default IRR Currency instance
 * Ready to use for most common scenarios
 */
export const IRR = createIRR();

/**
 * Type-safe IRR currency code
 */
export const IRR_CODE = 'IRR' as const;
export type IRRCode = typeof IRR_CODE;
