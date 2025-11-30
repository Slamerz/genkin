import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * UYI Currency Configuration
 * Uruguayan Peso en Unidades Indexadas (ISO 4217: UYI)
 */
export const UYI_CONFIG: CurrencyConfig = {
  code: 'UYI',
  numeric: 940,
  precision: 0,
  symbol: '',
  name: 'Uruguayan Peso en Unidades Indexadas',
  base: 10,
} as const;

/**
 * Create a UYI Currency instance
 * @returns Currency instance configured for Uruguayan Peso en Unidades Indexadas
 */
export function createUYI(): Currency {
  return createCurrency(UYI_CONFIG);
}

/**
 * Default UYI Currency instance
 * Ready to use for most common scenarios
 */
export const UYI = createUYI();

/**
 * Type-safe UYI currency code
 */
export const UYI_CODE = 'UYI' as const;
export type UYICode = typeof UYI_CODE;
