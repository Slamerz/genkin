import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * UYW Currency Configuration
 * Unidad Previsional (ISO 4217: UYW)
 */
export const UYW_CONFIG: CurrencyConfig = {
  code: 'UYW',
  numeric: 927,
  precision: 4,
  symbol: '',
  name: 'Unidad Previsional',
  base: 10,
} as const;

/**
 * Create a UYW Currency instance
 * @returns Currency instance configured for Unidad Previsional
 */
export function createUYW(): Currency {
  return createCurrency(UYW_CONFIG);
}

/**
 * Default UYW Currency instance
 * Ready to use for most common scenarios
 */
export const UYW = createUYW();

/**
 * Type-safe UYW currency code
 */
export const UYW_CODE = 'UYW' as const;
export type UYWCode = typeof UYW_CODE;
