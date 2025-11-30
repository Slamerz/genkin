import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SYP Currency Configuration
 * Syrian Pound (ISO 4217: SYP)
 */
export const SYP_CONFIG: CurrencyConfig = {
  code: 'SYP',
  numeric: 760,
  precision: 2,
  symbol: '£',
  name: 'Syrian Pound',
  base: 10,
} as const;

/**
 * Create a SYP Currency instance
 * @returns Currency instance configured for Syrian Pounds
 */
export function createSYP(): Currency {
  return createCurrency(SYP_CONFIG);
}

/**
 * Default SYP Currency instance
 * Ready to use for most common scenarios
 */
export const SYP = createSYP();

/**
 * Type-safe SYP currency code
 */
export const SYP_CODE = 'SYP' as const;
export type SYPCode = typeof SYP_CODE;
