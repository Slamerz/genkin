import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * STN Currency Configuration
 * São Tomé and Príncipe Dobra (ISO 4217: STN)
 */
export const STN_CONFIG: CurrencyConfig = {
  code: 'STN',
  numeric: 930,
  precision: 2,
  symbol: 'Db',
  name: 'São Tomé and Príncipe Dobra',
  base: 10,
} as const;

/**
 * Create a STN Currency instance
 * @returns Currency instance configured for São Tomé and Príncipe Dobras
 */
export function createSTN(): Currency {
  return createCurrency(STN_CONFIG);
}

/**
 * Default STN Currency instance
 * Ready to use for most common scenarios
 */
export const STN = createSTN();

/**
 * Type-safe STN currency code
 */
export const STN_CODE = 'STN' as const;
export type STNCode = typeof STN_CODE;
