import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SGD Currency Configuration
 * Singapore Dollar (ISO 4217: SGD)
 */
export const SGD_CONFIG: CurrencyConfig = {
  code: 'SGD',
  numeric: 702,
  precision: 2,
  symbol: '$',
  name: 'Singapore Dollar',
  base: 10,
} as const;

/**
 * Create a SGD Currency instance
 * @returns Currency instance configured for Singapore Dollars
 */
export function createSGD(): Currency {
  return createCurrency(SGD_CONFIG);
}

/**
 * Default SGD Currency instance
 * Ready to use for most common scenarios
 */
export const SGD = createSGD();

/**
 * Type-safe SGD currency code
 */
export const SGD_CODE = 'SGD' as const;
export type SGDCode = typeof SGD_CODE;
