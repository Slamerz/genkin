import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CNY Currency Configuration
 * Chinese Yuan (ISO 4217: CNY)
 */
export const CNY_CONFIG: CurrencyConfig = {
  code: 'CNY',
  numeric: 156,
  precision: 2,
  symbol: '¥',
  name: 'Chinese Yuan',
  base: 10,
} as const;

/**
 * Create a CNY Currency instance
 * @returns Currency instance configured for Chinese Yuan
 */
export function createCNY(): Currency {
  return createCurrency(CNY_CONFIG);
}

/**
 * Default CNY Currency instance
 * Ready to use for most common scenarios
 */
export const CNY = createCNY();

/**
 * Type-safe CNY currency code
 */
export const CNY_CODE = 'CNY' as const;
export type CNYCode = typeof CNY_CODE;
