import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * THB Currency Configuration
 * Thai Baht (ISO 4217: THB)
 */
export const THB_CONFIG: CurrencyConfig = {
  code: 'THB',
  numeric: 764,
  precision: 2,
  symbol: '฿',
  name: 'Thai Baht',
  base: 10,
} as const;

/**
 * Create a THB Currency instance
 * @returns Currency instance configured for Thai Baht
 */
export function createTHB(): Currency {
  return createCurrency(THB_CONFIG);
}

/**
 * Default THB Currency instance
 * Ready to use for most common scenarios
 */
export const THB = createTHB();

/**
 * Type-safe THB currency code
 */
export const THB_CODE = 'THB' as const;
export type THBCode = typeof THB_CODE;
