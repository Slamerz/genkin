import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * GTQ Currency Configuration
 * Guatemalan Quetzal (ISO 4217: GTQ)
 */
export const GTQ_CONFIG: CurrencyConfig = {
  code: 'GTQ',
  numeric: 320,
  precision: 2,
  symbol: 'Q',
  name: 'Guatemalan Quetzal',
  base: 10,
} as const;

/**
 * Create a GTQ Currency instance
 * @returns Currency instance configured for Guatemalan Quetzals
 */
export function createGTQ(): Currency {
  return createCurrency(GTQ_CONFIG);
}

/**
 * Default GTQ Currency instance
 * Ready to use for most common scenarios
 */
export const GTQ = createGTQ();

/**
 * Type-safe GTQ currency code
 */
export const GTQ_CODE = 'GTQ' as const;
export type GTQCode = typeof GTQ_CODE;
