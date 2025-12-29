import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * PHP Currency Configuration
 * Philippine Peso (ISO 4217: PHP)
 */
export const PHP_CONFIG: CurrencyConfig = {
  code: 'PHP',
  numeric: 608,
  precision: 2,
  symbol: '₱',
  name: 'Philippine Peso',
  base: 10,
} as const;

/**
 * Create a PHP Currency instance
 * @returns Currency instance configured for Philippine Pesos
 */
export function createPHP(): Currency {
  return createCurrency(PHP_CONFIG);
}

/**
 * Default PHP Currency instance
 * Ready to use for most common scenarios
 */
export const PHP = createPHP();

/**
 * Type-safe PHP currency code
 */
export const PHP_CODE = 'PHP' as const;
export type PHPCode = typeof PHP_CODE;
