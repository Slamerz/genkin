import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * OMR Currency Configuration
 * Omani Rial (ISO 4217: OMR)
 */
export const OMR_CONFIG: CurrencyConfig = {
  code: 'OMR',
  numeric: 512,
  precision: 3,
  symbol: '﷼',
  name: 'Omani Rial',
  base: 10,
} as const;

/**
 * Create a OMR Currency instance
 * @returns Currency instance configured for Omani Rials
 */
export function createOMR(): Currency {
  return createCurrency(OMR_CONFIG);
}

/**
 * Default OMR Currency instance
 * Ready to use for most common scenarios
 */
export const OMR = createOMR();

/**
 * Type-safe OMR currency code
 */
export const OMR_CODE = 'OMR' as const;
export type OMRCode = typeof OMR_CODE;
