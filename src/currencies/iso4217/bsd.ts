import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BSD Currency Configuration
 * Bahamian Dollar (ISO 4217: BSD)
 */
export const BSD_CONFIG: CurrencyConfig = {
  code: 'BSD',
  numeric: 44,
  precision: 2,
  symbol: '$',
  name: 'Bahamian Dollar',
  base: 10,
} as const;

/**
 * Create a BSD Currency instance
 * @returns Currency instance configured for Bahamian Dollars
 */
export function createBSD(): Currency {
  return createCurrency(BSD_CONFIG);
}

/**
 * Default BSD Currency instance
 * Ready to use for most common scenarios
 */
export const BSD = createBSD();

/**
 * Type-safe BSD currency code
 */
export const BSD_CODE = 'BSD' as const;
export type BSDCode = typeof BSD_CODE;
