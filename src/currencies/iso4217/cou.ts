import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * COU Currency Configuration
 * Unidad de Valor Real (ISO 4217: COU)
 */
export const COU_CONFIG: CurrencyConfig = {
  code: 'COU',
  numeric: 970,
  precision: 2,
  symbol: '',
  name: 'Unidad de Valor Real',
  base: 10,
} as const;

/**
 * Create a COU Currency instance
 * @returns Currency instance configured for Unidad de Valor Real
 */
export function createCOU(): Currency {
  return createCurrency(COU_CONFIG);
}

/**
 * Default COU Currency instance
 * Ready to use for most common scenarios
 */
export const COU = createCOU();

/**
 * Type-safe COU currency code
 */
export const COU_CODE = 'COU' as const;
export type COUCode = typeof COU_CODE;
