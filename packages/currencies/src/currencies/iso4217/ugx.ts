import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * UGX Currency Configuration
 * Ugandan Shilling (ISO 4217: UGX)
 */
export const UGX_CONFIG: CurrencyConfig = {
  code: 'UGX',
  numeric: 800,
  precision: 0,
  symbol: 'Sh',
  name: 'Ugandan Shilling',
  base: 10,
} as const;

/**
 * Create a UGX Currency instance
 * @returns Currency instance configured for Ugandan Shillings
 */
export function createUGX(): Currency {
  return createCurrency(UGX_CONFIG);
}

/**
 * Default UGX Currency instance
 * Ready to use for most common scenarios
 */
export const UGX = createUGX();

/**
 * Type-safe UGX currency code
 */
export const UGX_CODE = 'UGX' as const;
export type UGXCode = typeof UGX_CODE;
