import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * CAD Currency Configuration
 * Canadian Dollar (ISO 4217: CAD)
 */
export const CAD_CONFIG: CurrencyConfig = {
  code: 'CAD',
  numeric: 124,
  precision: 2,
  symbol: '$',
  name: 'Canadian Dollar',
  base: 10,
} as const;

/**
 * Create a CAD Currency instance
 * @returns Currency instance configured for Canadian Dollars
 */
export function createCAD(): Currency {
  return createCurrency(CAD_CONFIG);
}

/**
 * Default CAD Currency instance
 * Ready to use for most common scenarios
 */
export const CAD = createCAD();

/**
 * Type-safe CAD currency code
 */
export const CAD_CODE = 'CAD' as const;
export type CADCode = typeof CAD_CODE;
