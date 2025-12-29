import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ARS Currency Configuration
 * Argentine Peso (ISO 4217: ARS)
 */
export const ARS_CONFIG: CurrencyConfig = {
  code: 'ARS',
  numeric: 32,
  precision: 2,
  symbol: '$',
  name: 'Argentine Peso',
  base: 10,
} as const;

/**
 * Create a ARS Currency instance
 * @returns Currency instance configured for Argentine Pesos
 */
export function createARS(): Currency {
  return createCurrency(ARS_CONFIG);
}

/**
 * Default ARS Currency instance
 * Ready to use for most common scenarios
 */
export const ARS = createARS();

/**
 * Type-safe ARS currency code
 */
export const ARS_CODE = 'ARS' as const;
export type ARSCode = typeof ARS_CODE;
