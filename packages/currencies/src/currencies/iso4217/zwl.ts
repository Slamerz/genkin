import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ZWL Currency Configuration
 * Zimbabwean Dollar (ISO 4217: ZWL)
 */
export const ZWL_CONFIG: CurrencyConfig = {
  code: 'ZWL',
  numeric: 932,
  precision: 2,
  symbol: '$',
  name: 'Zimbabwean Dollar',
  base: 10,
} as const;

/**
 * Create a ZWL Currency instance
 * @returns Currency instance configured for Zimbabwean Dollars
 */
export function createZWL(): Currency {
  return createCurrency(ZWL_CONFIG);
}

/**
 * Default ZWL Currency instance
 * Ready to use for most common scenarios
 */
export const ZWL = createZWL();

/**
 * Type-safe ZWL currency code
 */
export const ZWL_CODE = 'ZWL' as const;
export type ZWLCode = typeof ZWL_CODE;
