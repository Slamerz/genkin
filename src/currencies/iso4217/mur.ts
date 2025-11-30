import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MUR Currency Configuration
 * Mauritian Rupee (ISO 4217: MUR)
 */
export const MUR_CONFIG: CurrencyConfig = {
  code: 'MUR',
  numeric: 480,
  precision: 2,
  symbol: '₨',
  name: 'Mauritian Rupee',
  base: 10,
} as const;

/**
 * Create a MUR Currency instance
 * @returns Currency instance configured for Mauritian Rupees
 */
export function createMUR(): Currency {
  return createCurrency(MUR_CONFIG);
}

/**
 * Default MUR Currency instance
 * Ready to use for most common scenarios
 */
export const MUR = createMUR();

/**
 * Type-safe MUR currency code
 */
export const MUR_CODE = 'MUR' as const;
export type MURCode = typeof MUR_CODE;
