import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * GIP Currency Configuration
 * Gibraltar Pound (ISO 4217: GIP)
 */
export const GIP_CONFIG: CurrencyConfig = {
  code: 'GIP',
  numeric: 292,
  precision: 2,
  symbol: '£',
  name: 'Gibraltar Pound',
  base: 10,
} as const;

/**
 * Create a GIP Currency instance
 * @returns Currency instance configured for Gibraltar Pounds
 */
export function createGIP(): Currency {
  return createCurrency(GIP_CONFIG);
}

/**
 * Default GIP Currency instance
 * Ready to use for most common scenarios
 */
export const GIP = createGIP();

/**
 * Type-safe GIP currency code
 */
export const GIP_CODE = 'GIP' as const;
export type GIPCode = typeof GIP_CODE;
