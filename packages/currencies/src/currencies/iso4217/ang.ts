import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ANG Currency Configuration
 * Netherlands Antillean Guilder (ISO 4217: ANG)
 */
export const ANG_CONFIG: CurrencyConfig = {
  code: 'ANG',
  numeric: 532,
  precision: 2,
  symbol: 'ƒ',
  name: 'Netherlands Antillean Guilder',
  base: 10,
} as const;

/**
 * Create a ANG Currency instance
 * @returns Currency instance configured for Netherlands Antillean Guilders
 */
export function createANG(): Currency {
  return createCurrency(ANG_CONFIG);
}

/**
 * Default ANG Currency instance
 * Ready to use for most common scenarios
 */
export const ANG = createANG();

/**
 * Type-safe ANG currency code
 */
export const ANG_CODE = 'ANG' as const;
export type ANGCode = typeof ANG_CODE;
