import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * COP Currency Configuration
 * Colombian Peso (ISO 4217: COP)
 */
export const COP_CONFIG: CurrencyConfig = {
  code: 'COP',
  numeric: 170,
  precision: 2,
  symbol: '$',
  name: 'Colombian Peso',
  base: 10,
} as const;

/**
 * Create a COP Currency instance
 * @returns Currency instance configured for Colombian Pesos
 */
export function createCOP(): Currency {
  return createCurrency(COP_CONFIG);
}

/**
 * Default COP Currency instance
 * Ready to use for most common scenarios
 */
export const COP = createCOP();

/**
 * Type-safe COP currency code
 */
export const COP_CODE = 'COP' as const;
export type COPCode = typeof COP_CODE;
