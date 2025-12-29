import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * RUB Currency Configuration
 * Russian Ruble (ISO 4217: RUB)
 */
export const RUB_CONFIG: CurrencyConfig = {
  code: 'RUB',
  numeric: 643,
  precision: 2,
  symbol: '₽',
  name: 'Russian Ruble',
  base: 10,
} as const;

/**
 * Create a RUB Currency instance
 * @returns Currency instance configured for Russian Rubles
 */
export function createRUB(): Currency {
  return createCurrency(RUB_CONFIG);
}

/**
 * Default RUB Currency instance
 * Ready to use for most common scenarios
 */
export const RUB = createRUB();

/**
 * Type-safe RUB currency code
 */
export const RUB_CODE = 'RUB' as const;
export type RUBCode = typeof RUB_CODE;
