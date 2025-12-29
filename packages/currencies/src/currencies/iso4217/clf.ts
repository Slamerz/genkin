import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * CLF Currency Configuration
 * Unidad de Fomento (ISO 4217: CLF)
 */
export const CLF_CONFIG: CurrencyConfig = {
  code: 'CLF',
  numeric: 990,
  precision: 4,
  symbol: '',
  name: 'Unidad de Fomento',
  base: 10,
} as const;

/**
 * Create a CLF Currency instance
 * @returns Currency instance configured for Unidad de Fomento
 */
export function createCLF(): Currency {
  return createCurrency(CLF_CONFIG);
}

/**
 * Default CLF Currency instance
 * Ready to use for most common scenarios
 */
export const CLF = createCLF();

/**
 * Type-safe CLF currency code
 */
export const CLF_CODE = 'CLF' as const;
export type CLFCode = typeof CLF_CODE;
