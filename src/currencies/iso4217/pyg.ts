import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * PYG Currency Configuration
 * Paraguayan Guarani (ISO 4217: PYG)
 */
export const PYG_CONFIG: CurrencyConfig = {
  code: 'PYG',
  numeric: 600,
  precision: 0,
  symbol: '₲',
  name: 'Paraguayan Guarani',
  base: 10,
} as const;

/**
 * Create a PYG Currency instance
 * @returns Currency instance configured for Paraguayan Guaranis
 */
export function createPYG(): Currency {
  return createCurrency(PYG_CONFIG);
}

/**
 * Default PYG Currency instance
 * Ready to use for most common scenarios
 */
export const PYG = createPYG();

/**
 * Type-safe PYG currency code
 */
export const PYG_CODE = 'PYG' as const;
export type PYGCode = typeof PYG_CODE;
