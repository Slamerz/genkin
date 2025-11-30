import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * NOK Currency Configuration
 * Norwegian Krone (ISO 4217: NOK)
 */
export const NOK_CONFIG: CurrencyConfig = {
  code: 'NOK',
  numeric: 578,
  precision: 2,
  symbol: 'kr',
  name: 'Norwegian Krone',
  base: 10,
} as const;

/**
 * Create a NOK Currency instance
 * @returns Currency instance configured for Norwegian Kroner
 */
export function createNOK(): Currency {
  return createCurrency(NOK_CONFIG);
}

/**
 * Default NOK Currency instance
 * Ready to use for most common scenarios
 */
export const NOK = createNOK();

/**
 * Type-safe NOK currency code
 */
export const NOK_CODE = 'NOK' as const;
export type NOKCode = typeof NOK_CODE;
