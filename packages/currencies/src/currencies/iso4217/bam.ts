import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * BAM Currency Configuration
 * Bosnia and Herzegovina Convertible Mark (ISO 4217: BAM)
 */
export const BAM_CONFIG: CurrencyConfig = {
  code: 'BAM',
  numeric: 977,
  precision: 2,
  symbol: 'KM',
  name: 'Bosnia and Herzegovina Convertible Mark',
  base: 10,
} as const;

/**
 * Create a BAM Currency instance
 * @returns Currency instance configured for Bosnia and Herzegovina Convertible Marks
 */
export function createBAM(): Currency {
  return createCurrency(BAM_CONFIG);
}

/**
 * Default BAM Currency instance
 * Ready to use for most common scenarios
 */
export const BAM = createBAM();

/**
 * Type-safe BAM currency code
 */
export const BAM_CODE = 'BAM' as const;
export type BAMCode = typeof BAM_CODE;
