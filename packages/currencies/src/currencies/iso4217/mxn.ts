import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * MXN Currency Configuration
 * Mexican Peso (ISO 4217: MXN)
 */
export const MXN_CONFIG: CurrencyConfig = {
  code: 'MXN',
  numeric: 484,
  precision: 2,
  symbol: '$',
  name: 'Mexican Peso',
  base: 10,
} as const;

/**
 * Create a MXN Currency instance
 * @returns Currency instance configured for Mexican Pesos
 */
export function createMXN(): Currency {
  return createCurrency(MXN_CONFIG);
}

/**
 * Default MXN Currency instance
 * Ready to use for most common scenarios
 */
export const MXN = createMXN();

/**
 * Type-safe MXN currency code
 */
export const MXN_CODE = 'MXN' as const;
export type MXNCode = typeof MXN_CODE;
