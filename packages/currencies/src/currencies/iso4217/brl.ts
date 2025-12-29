import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * BRL Currency Configuration
 * Brazilian Real (ISO 4217: BRL)
 */
export const BRL_CONFIG: CurrencyConfig = {
  code: 'BRL',
  numeric: 986,
  precision: 2,
  symbol: 'R$',
  name: 'Brazilian Real',
  base: 10,
} as const;

/**
 * Create a BRL Currency instance
 * @returns Currency instance configured for Brazilian Reais
 */
export function createBRL(): Currency {
  return createCurrency(BRL_CONFIG);
}

/**
 * Default BRL Currency instance
 * Ready to use for most common scenarios
 */
export const BRL = createBRL();

/**
 * Type-safe BRL currency code
 */
export const BRL_CODE = 'BRL' as const;
export type BRLCode = typeof BRL_CODE;
