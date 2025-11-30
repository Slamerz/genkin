import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * NPR Currency Configuration
 * Nepalese Rupee (ISO 4217: NPR)
 */
export const NPR_CONFIG: CurrencyConfig = {
  code: 'NPR',
  numeric: 524,
  precision: 2,
  symbol: '₨',
  name: 'Nepalese Rupee',
  base: 10,
} as const;

/**
 * Create a NPR Currency instance
 * @returns Currency instance configured for Nepalese Rupees
 */
export function createNPR(): Currency {
  return createCurrency(NPR_CONFIG);
}

/**
 * Default NPR Currency instance
 * Ready to use for most common scenarios
 */
export const NPR = createNPR();

/**
 * Type-safe NPR currency code
 */
export const NPR_CODE = 'NPR' as const;
export type NPRCode = typeof NPR_CODE;
