import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SSP Currency Configuration
 * South Sudanese Pound (ISO 4217: SSP)
 */
export const SSP_CONFIG: CurrencyConfig = {
  code: 'SSP',
  numeric: 728,
  precision: 2,
  symbol: 'SS£',
  name: 'South Sudanese Pound',
  base: 10,
} as const;

/**
 * Create a SSP Currency instance
 * @returns Currency instance configured for South Sudanese Pounds
 */
export function createSSP(): Currency {
  return createCurrency(SSP_CONFIG);
}

/**
 * Default SSP Currency instance
 * Ready to use for most common scenarios
 */
export const SSP = createSSP();

/**
 * Type-safe SSP currency code
 */
export const SSP_CODE = 'SSP' as const;
export type SSPCode = typeof SSP_CODE;
