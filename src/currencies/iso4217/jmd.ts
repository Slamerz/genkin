import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * JMD Currency Configuration
 * Jamaican Dollar (ISO 4217: JMD)
 */
export const JMD_CONFIG: CurrencyConfig = {
  code: 'JMD',
  numeric: 388,
  precision: 2,
  symbol: '$',
  name: 'Jamaican Dollar',
  base: 10,
} as const;

/**
 * Create a JMD Currency instance
 * @returns Currency instance configured for Jamaican Dollars
 */
export function createJMD(): Currency {
  return createCurrency(JMD_CONFIG);
}

/**
 * Default JMD Currency instance
 * Ready to use for most common scenarios
 */
export const JMD = createJMD();

/**
 * Type-safe JMD currency code
 */
export const JMD_CODE = 'JMD' as const;
export type JMDCode = typeof JMD_CODE;
