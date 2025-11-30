import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * LSL Currency Configuration
 * Lesotho Loti (ISO 4217: LSL)
 */
export const LSL_CONFIG: CurrencyConfig = {
  code: 'LSL',
  numeric: 426,
  precision: 2,
  symbol: 'L',
  name: 'Lesotho Loti',
  base: 10,
} as const;

/**
 * Create a LSL Currency instance
 * @returns Currency instance configured for Lesotho Loti
 */
export function createLSL(): Currency {
  return createCurrency(LSL_CONFIG);
}

/**
 * Default LSL Currency instance
 * Ready to use for most common scenarios
 */
export const LSL = createLSL();

/**
 * Type-safe LSL currency code
 */
export const LSL_CODE = 'LSL' as const;
export type LSLCode = typeof LSL_CODE;
