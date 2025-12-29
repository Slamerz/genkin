import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * CUC Currency Configuration
 * Cuban Convertible Peso (ISO 4217: CUC)
 */
export const CUC_CONFIG: CurrencyConfig = {
  code: 'CUC',
  numeric: 931,
  precision: 2,
  symbol: '',
  name: 'Cuban Convertible Peso',
  base: 10,
} as const;

/**
 * Create a CUC Currency instance
 * @returns Currency instance configured for Cuban Convertible Pesos
 */
export function createCUC(): Currency {
  return createCurrency(CUC_CONFIG);
}

/**
 * Default CUC Currency instance
 * Ready to use for most common scenarios
 */
export const CUC = createCUC();

/**
 * Type-safe CUC currency code
 */
export const CUC_CODE = 'CUC' as const;
export type CUCCode = typeof CUC_CODE;
