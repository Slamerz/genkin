import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * RSD Currency Configuration
 * Serbian Dinar (ISO 4217: RSD)
 */
export const RSD_CONFIG: CurrencyConfig = {
  code: 'RSD',
  numeric: 941,
  precision: 2,
  symbol: 'din.',
  name: 'Serbian Dinar',
  base: 10,
} as const;

/**
 * Create a RSD Currency instance
 * @returns Currency instance configured for Serbian Dinars
 */
export function createRSD(): Currency {
  return createCurrency(RSD_CONFIG);
}

/**
 * Default RSD Currency instance
 * Ready to use for most common scenarios
 */
export const RSD = createRSD();

/**
 * Type-safe RSD currency code
 */
export const RSD_CODE = 'RSD' as const;
export type RSDCode = typeof RSD_CODE;
