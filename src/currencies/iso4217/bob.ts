import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BOB Currency Configuration
 * Bolivian Boliviano (ISO 4217: BOB)
 */
export const BOB_CONFIG: CurrencyConfig = {
  code: 'BOB',
  numeric: 68,
  precision: 2,
  symbol: 'Bs.',
  name: 'Bolivian Boliviano',
  base: 10,
} as const;

/**
 * Create a BOB Currency instance
 * @returns Currency instance configured for Bolivian Bolivianos
 */
export function createBOB(): Currency {
  return createCurrency(BOB_CONFIG);
}

/**
 * Default BOB Currency instance
 * Ready to use for most common scenarios
 */
export const BOB = createBOB();

/**
 * Type-safe BOB currency code
 */
export const BOB_CODE = 'BOB' as const;
export type BOBCode = typeof BOB_CODE;
