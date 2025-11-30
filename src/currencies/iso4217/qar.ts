import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * QAR Currency Configuration
 * Qatari Riyal (ISO 4217: QAR)
 */
export const QAR_CONFIG: CurrencyConfig = {
  code: 'QAR',
  numeric: 634,
  precision: 2,
  symbol: 'ر.ق ',
  name: 'Qatari Riyal',
  base: 10,
} as const;

/**
 * Create a QAR Currency instance
 * @returns Currency instance configured for Qatari Riyals
 */
export function createQAR(): Currency {
  return createCurrency(QAR_CONFIG);
}

/**
 * Default QAR Currency instance
 * Ready to use for most common scenarios
 */
export const QAR = createQAR();

/**
 * Type-safe QAR currency code
 */
export const QAR_CODE = 'QAR' as const;
export type QARCode = typeof QAR_CODE;
