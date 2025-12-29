import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ETB Currency Configuration
 * Ethiopian Birr (ISO 4217: ETB)
 */
export const ETB_CONFIG: CurrencyConfig = {
  code: 'ETB',
  numeric: 230,
  precision: 2,
  symbol: 'Br',
  name: 'Ethiopian Birr',
  base: 10,
} as const;

/**
 * Create a ETB Currency instance
 * @returns Currency instance configured for Ethiopian Birrs
 */
export function createETB(): Currency {
  return createCurrency(ETB_CONFIG);
}

/**
 * Default ETB Currency instance
 * Ready to use for most common scenarios
 */
export const ETB = createETB();

/**
 * Type-safe ETB currency code
 */
export const ETB_CODE = 'ETB' as const;
export type ETBCode = typeof ETB_CODE;
