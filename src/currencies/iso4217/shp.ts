import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SHP Currency Configuration
 * Saint Helena Pound (ISO 4217: SHP)
 */
export const SHP_CONFIG: CurrencyConfig = {
  code: 'SHP',
  numeric: 654,
  precision: 2,
  symbol: '£',
  name: 'Saint Helena Pound',
  base: 10,
} as const;

/**
 * Create a SHP Currency instance
 * @returns Currency instance configured for Saint Helena Pounds
 */
export function createSHP(): Currency {
  return createCurrency(SHP_CONFIG);
}

/**
 * Default SHP Currency instance
 * Ready to use for most common scenarios
 */
export const SHP = createSHP();

/**
 * Type-safe SHP currency code
 */
export const SHP_CODE = 'SHP' as const;
export type SHPCode = typeof SHP_CODE;
