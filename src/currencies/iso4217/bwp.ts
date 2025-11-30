import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BWP Currency Configuration
 * Botswana Pula (ISO 4217: BWP)
 */
export const BWP_CONFIG: CurrencyConfig = {
  code: 'BWP',
  numeric: 72,
  precision: 2,
  symbol: 'P',
  name: 'Botswana Pula',
  base: 10,
} as const;

/**
 * Create a BWP Currency instance
 * @returns Currency instance configured for Botswana Pula
 */
export function createBWP(): Currency {
  return createCurrency(BWP_CONFIG);
}

/**
 * Default BWP Currency instance
 * Ready to use for most common scenarios
 */
export const BWP = createBWP();

/**
 * Type-safe BWP currency code
 */
export const BWP_CODE = 'BWP' as const;
export type BWPCode = typeof BWP_CODE;
