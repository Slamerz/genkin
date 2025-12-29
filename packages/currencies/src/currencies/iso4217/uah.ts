import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * UAH Currency Configuration
 * Ukrainian Hryvnia (ISO 4217: UAH)
 */
export const UAH_CONFIG: CurrencyConfig = {
  code: 'UAH',
  numeric: 980,
  precision: 2,
  symbol: '₴',
  name: 'Ukrainian Hryvnia',
  base: 10,
} as const;

/**
 * Create a UAH Currency instance
 * @returns Currency instance configured for Ukrainian Hryvnias
 */
export function createUAH(): Currency {
  return createCurrency(UAH_CONFIG);
}

/**
 * Default UAH Currency instance
 * Ready to use for most common scenarios
 */
export const UAH = createUAH();

/**
 * Type-safe UAH currency code
 */
export const UAH_CODE = 'UAH' as const;
export type UAHCode = typeof UAH_CODE;
