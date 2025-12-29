import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * JOD Currency Configuration
 * Jordanian Dinar (ISO 4217: JOD)
 */
export const JOD_CONFIG: CurrencyConfig = {
  code: 'JOD',
  numeric: 400,
  precision: 3,
  symbol: 'د.ا',
  name: 'Jordanian Dinar',
  base: 10,
} as const;

/**
 * Create a JOD Currency instance
 * @returns Currency instance configured for Jordanian Dinars
 */
export function createJOD(): Currency {
  return createCurrency(JOD_CONFIG);
}

/**
 * Default JOD Currency instance
 * Ready to use for most common scenarios
 */
export const JOD = createJOD();

/**
 * Type-safe JOD currency code
 */
export const JOD_CODE = 'JOD' as const;
export type JODCode = typeof JOD_CODE;
