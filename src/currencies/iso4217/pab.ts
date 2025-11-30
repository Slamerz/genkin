import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * PAB Currency Configuration
 * Panamanian Balboa (ISO 4217: PAB)
 */
export const PAB_CONFIG: CurrencyConfig = {
  code: 'PAB',
  numeric: 590,
  precision: 2,
  symbol: 'B/.',
  name: 'Panamanian Balboa',
  base: 10,
} as const;

/**
 * Create a PAB Currency instance
 * @returns Currency instance configured for Panamanian Balboas
 */
export function createPAB(): Currency {
  return createCurrency(PAB_CONFIG);
}

/**
 * Default PAB Currency instance
 * Ready to use for most common scenarios
 */
export const PAB = createPAB();

/**
 * Type-safe PAB currency code
 */
export const PAB_CODE = 'PAB' as const;
export type PABCode = typeof PAB_CODE;
