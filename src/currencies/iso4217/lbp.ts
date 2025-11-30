import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * LBP Currency Configuration
 * Lebanese Pound (ISO 4217: LBP)
 */
export const LBP_CONFIG: CurrencyConfig = {
  code: 'LBP',
  numeric: 422,
  precision: 2,
  symbol: 'ل.ل',
  name: 'Lebanese Pound',
  base: 10,
} as const;

/**
 * Create a LBP Currency instance
 * @returns Currency instance configured for Lebanese Pounds
 */
export function createLBP(): Currency {
  return createCurrency(LBP_CONFIG);
}

/**
 * Default LBP Currency instance
 * Ready to use for most common scenarios
 */
export const LBP = createLBP();

/**
 * Type-safe LBP currency code
 */
export const LBP_CODE = 'LBP' as const;
export type LBPCode = typeof LBP_CODE;
