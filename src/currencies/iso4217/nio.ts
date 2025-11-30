import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * NIO Currency Configuration
 * Nicaraguan Córdoba (ISO 4217: NIO)
 */
export const NIO_CONFIG: CurrencyConfig = {
  code: 'NIO',
  numeric: 558,
  precision: 2,
  symbol: 'C$',
  name: 'Nicaraguan Córdoba',
  base: 10,
} as const;

/**
 * Create a NIO Currency instance
 * @returns Currency instance configured for Nicaraguan Córdobas
 */
export function createNIO(): Currency {
  return createCurrency(NIO_CONFIG);
}

/**
 * Default NIO Currency instance
 * Ready to use for most common scenarios
 */
export const NIO = createNIO();

/**
 * Type-safe NIO currency code
 */
export const NIO_CODE = 'NIO' as const;
export type NIOCode = typeof NIO_CODE;
