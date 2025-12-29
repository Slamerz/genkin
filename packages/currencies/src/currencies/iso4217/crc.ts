import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * CRC Currency Configuration
 * Costa Rican Colón (ISO 4217: CRC)
 */
export const CRC_CONFIG: CurrencyConfig = {
  code: 'CRC',
  numeric: 188,
  precision: 2,
  symbol: '₡',
  name: 'Costa Rican Colón',
  base: 10,
} as const;

/**
 * Create a CRC Currency instance
 * @returns Currency instance configured for Costa Rican Colones
 */
export function createCRC(): Currency {
  return createCurrency(CRC_CONFIG);
}

/**
 * Default CRC Currency instance
 * Ready to use for most common scenarios
 */
export const CRC = createCRC();

/**
 * Type-safe CRC currency code
 */
export const CRC_CODE = 'CRC' as const;
export type CRCCode = typeof CRC_CODE;
