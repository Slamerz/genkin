import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * PEN Currency Configuration
 * Peruvian Sol (ISO 4217: PEN)
 */
export const PEN_CONFIG: CurrencyConfig = {
  code: 'PEN',
  numeric: 604,
  precision: 2,
  symbol: 'S/.',
  name: 'Peruvian Sol',
  base: 10,
} as const;

/**
 * Create a PEN Currency instance
 * @returns Currency instance configured for Peruvian Soles
 */
export function createPEN(): Currency {
  return createCurrency(PEN_CONFIG);
}

/**
 * Default PEN Currency instance
 * Ready to use for most common scenarios
 */
export const PEN = createPEN();

/**
 * Type-safe PEN currency code
 */
export const PEN_CODE = 'PEN' as const;
export type PENCode = typeof PEN_CODE;
