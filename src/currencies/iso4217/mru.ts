import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MRU Currency Configuration
 * Mauritanian Ouguiya (ISO 4217: MRU)
 */
export const MRU_CONFIG: CurrencyConfig = {
  code: 'MRU',
  numeric: 929,
  precision: 2,
  symbol: 'UM',
  name: 'Mauritanian Ouguiya',
  base: 10,
} as const;

/**
 * Create a MRU Currency instance
 * @returns Currency instance configured for Mauritanian Ouguiyas
 */
export function createMRU(): Currency {
  return createCurrency(MRU_CONFIG);
}

/**
 * Default MRU Currency instance
 * Ready to use for most common scenarios
 */
export const MRU = createMRU();

/**
 * Type-safe MRU currency code
 */
export const MRU_CODE = 'MRU' as const;
export type MRUCode = typeof MRU_CODE;
