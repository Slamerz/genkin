import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * DOP Currency Configuration
 * Dominican Peso (ISO 4217: DOP)
 */
export const DOP_CONFIG: CurrencyConfig = {
  code: 'DOP',
  numeric: 214,
  precision: 2,
  symbol: '$',
  name: 'Dominican Peso',
  base: 10,
} as const;

/**
 * Create a DOP Currency instance
 * @returns Currency instance configured for Dominican Pesos
 */
export function createDOP(): Currency {
  return createCurrency(DOP_CONFIG);
}

/**
 * Default DOP Currency instance
 * Ready to use for most common scenarios
 */
export const DOP = createDOP();

/**
 * Type-safe DOP currency code
 */
export const DOP_CODE = 'DOP' as const;
export type DOPCode = typeof DOP_CODE;
