import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * MOP Currency Configuration
 * Macanese Pataca (ISO 4217: MOP)
 */
export const MOP_CONFIG: CurrencyConfig = {
  code: 'MOP',
  numeric: 446,
  precision: 2,
  symbol: 'P',
  name: 'Macanese Pataca',
  base: 10,
} as const;

/**
 * Create a MOP Currency instance
 * @returns Currency instance configured for Macanese Patacas
 */
export function createMOP(): Currency {
  return createCurrency(MOP_CONFIG);
}

/**
 * Default MOP Currency instance
 * Ready to use for most common scenarios
 */
export const MOP = createMOP();

/**
 * Type-safe MOP currency code
 */
export const MOP_CODE = 'MOP' as const;
export type MOPCode = typeof MOP_CODE;
