import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MZN Currency Configuration
 * Mozambican Metical (ISO 4217: MZN)
 */
export const MZN_CONFIG: CurrencyConfig = {
  code: 'MZN',
  numeric: 943,
  precision: 2,
  symbol: 'MTn',
  name: 'Mozambican Metical',
  base: 10,
} as const;

/**
 * Create a MZN Currency instance
 * @returns Currency instance configured for Mozambican Meticals
 */
export function createMZN(): Currency {
  return createCurrency(MZN_CONFIG);
}

/**
 * Default MZN Currency instance
 * Ready to use for most common scenarios
 */
export const MZN = createMZN();

/**
 * Type-safe MZN currency code
 */
export const MZN_CODE = 'MZN' as const;
export type MZNCode = typeof MZN_CODE;
