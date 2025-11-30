import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * DKK Currency Configuration
 * Danish Krone (ISO 4217: DKK)
 */
export const DKK_CONFIG: CurrencyConfig = {
  code: 'DKK',
  numeric: 208,
  precision: 2,
  symbol: 'kr.',
  name: 'Danish Krone',
  base: 10,
} as const;

/**
 * Create a DKK Currency instance
 * @returns Currency instance configured for Danish Kroner
 */
export function createDKK(): Currency {
  return createCurrency(DKK_CONFIG);
}

/**
 * Default DKK Currency instance
 * Ready to use for most common scenarios
 */
export const DKK = createDKK();

/**
 * Type-safe DKK currency code
 */
export const DKK_CODE = 'DKK' as const;
export type DKKCode = typeof DKK_CODE;
