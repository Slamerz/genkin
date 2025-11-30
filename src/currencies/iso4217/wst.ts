import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * WST Currency Configuration
 * Samoan Tala (ISO 4217: WST)
 */
export const WST_CONFIG: CurrencyConfig = {
  code: 'WST',
  numeric: 882,
  precision: 2,
  symbol: '$',
  name: 'Samoan Tala',
  base: 10,
} as const;

/**
 * Create a WST Currency instance
 * @returns Currency instance configured for Samoan Talas
 */
export function createWST(): Currency {
  return createCurrency(WST_CONFIG);
}

/**
 * Default WST Currency instance
 * Ready to use for most common scenarios
 */
export const WST = createWST();

/**
 * Type-safe WST currency code
 */
export const WST_CODE = 'WST' as const;
export type WSTCode = typeof WST_CODE;
