import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MWK Currency Configuration
 * Malawian Kwacha (ISO 4217: MWK)
 */
export const MWK_CONFIG: CurrencyConfig = {
  code: 'MWK',
  numeric: 454,
  precision: 2,
  symbol: 'MK',
  name: 'Malawian Kwacha',
  base: 10,
} as const;

/**
 * Create a MWK Currency instance
 * @returns Currency instance configured for Malawian Kwachas
 */
export function createMWK(): Currency {
  return createCurrency(MWK_CONFIG);
}

/**
 * Default MWK Currency instance
 * Ready to use for most common scenarios
 */
export const MWK = createMWK();

/**
 * Type-safe MWK currency code
 */
export const MWK_CODE = 'MWK' as const;
export type MWKCode = typeof MWK_CODE;
