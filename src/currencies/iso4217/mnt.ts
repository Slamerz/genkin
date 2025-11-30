import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MNT Currency Configuration
 * Mongolian Tugrik (ISO 4217: MNT)
 */
export const MNT_CONFIG: CurrencyConfig = {
  code: 'MNT',
  numeric: 496,
  precision: 2,
  symbol: '₮',
  name: 'Mongolian Tugrik',
  base: 10,
} as const;

/**
 * Create a MNT Currency instance
 * @returns Currency instance configured for Mongolian Tugriks
 */
export function createMNT(): Currency {
  return createCurrency(MNT_CONFIG);
}

/**
 * Default MNT Currency instance
 * Ready to use for most common scenarios
 */
export const MNT = createMNT();

/**
 * Type-safe MNT currency code
 */
export const MNT_CODE = 'MNT' as const;
export type MNTCode = typeof MNT_CODE;
