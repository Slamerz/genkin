import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MKD Currency Configuration
 * Macedonian Denar (ISO 4217: MKD)
 */
export const MKD_CONFIG: CurrencyConfig = {
  code: 'MKD',
  numeric: 807,
  precision: 2,
  symbol: 'ден',
  name: 'Macedonian Denar',
  base: 10,
} as const;

/**
 * Create a MKD Currency instance
 * @returns Currency instance configured for Macedonian Denars
 */
export function createMKD(): Currency {
  return createCurrency(MKD_CONFIG);
}

/**
 * Default MKD Currency instance
 * Ready to use for most common scenarios
 */
export const MKD = createMKD();

/**
 * Type-safe MKD currency code
 */
export const MKD_CODE = 'MKD' as const;
export type MKDCode = typeof MKD_CODE;
