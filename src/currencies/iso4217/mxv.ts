import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * MXV Currency Configuration
 * Mexican Unidad de Inversion (UDI) (ISO 4217: MXV)
 */
export const MXV_CONFIG: CurrencyConfig = {
  code: 'MXV',
  numeric: 979,
  precision: 2,
  symbol: '-',
  name: 'Mexican Unidad de Inversion (UDI)',
  base: 10,
} as const;

/**
 * Create a MXV Currency instance
 * @returns Currency instance configured for Mexican Unidad de Inversion (UDI)
 */
export function createMXV(): Currency {
  return createCurrency(MXV_CONFIG);
}

/**
 * Default MXV Currency instance
 * Ready to use for most common scenarios
 */
export const MXV = createMXV();

/**
 * Type-safe MXV currency code
 */
export const MXV_CODE = 'MXV' as const;
export type MXVCode = typeof MXV_CODE;
