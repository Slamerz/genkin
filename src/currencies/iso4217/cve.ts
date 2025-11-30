import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * CVE Currency Configuration
 * Cape Verdean Escudo (ISO 4217: CVE)
 */
export const CVE_CONFIG: CurrencyConfig = {
  code: 'CVE',
  numeric: 132,
  precision: 2,
  symbol: '$',
  name: 'Cape Verdean Escudo',
  base: 10,
} as const;

/**
 * Create a CVE Currency instance
 * @returns Currency instance configured for Cape Verdean Escudos
 */
export function createCVE(): Currency {
  return createCurrency(CVE_CONFIG);
}

/**
 * Default CVE Currency instance
 * Ready to use for most common scenarios
 */
export const CVE = createCVE();

/**
 * Type-safe CVE currency code
 */
export const CVE_CODE = 'CVE' as const;
export type CVECode = typeof CVE_CODE;
