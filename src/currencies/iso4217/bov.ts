import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BOV Currency Configuration
 * Bolivian Mvdol (ISO 4217: BOV)
 */
export const BOV_CONFIG: CurrencyConfig = {
  code: 'BOV',
  numeric: 984,
  precision: 2,
  symbol: 'Mvdol',
  name: 'Bolivian Mvdol',
  base: 10,
} as const;

/**
 * Create a BOV Currency instance
 * @returns Currency instance configured for Bolivian Mvdol
 */
export function createBOV(): Currency {
  return createCurrency(BOV_CONFIG);
}

/**
 * Default BOV Currency instance
 * Ready to use for most common scenarios
 */
export const BOV = createBOV();

/**
 * Type-safe BOV currency code
 */
export const BOV_CODE = 'BOV' as const;
export type BOVCode = typeof BOV_CODE;
