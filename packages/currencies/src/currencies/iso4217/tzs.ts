import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * TZS Currency Configuration
 * Tanzanian Shilling (ISO 4217: TZS)
 */
export const TZS_CONFIG: CurrencyConfig = {
  code: 'TZS',
  numeric: 834,
  precision: 2,
  symbol: 'Sh',
  name: 'Tanzanian Shilling',
  base: 10,
} as const;

/**
 * Create a TZS Currency instance
 * @returns Currency instance configured for Tanzanian Shillings
 */
export function createTZS(): Currency {
  return createCurrency(TZS_CONFIG);
}

/**
 * Default TZS Currency instance
 * Ready to use for most common scenarios
 */
export const TZS = createTZS();

/**
 * Type-safe TZS currency code
 */
export const TZS_CODE = 'TZS' as const;
export type TZSCode = typeof TZS_CODE;
