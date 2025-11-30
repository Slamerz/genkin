import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * KGS Currency Configuration
 * Kyrgystani Som (ISO 4217: KGS)
 */
export const KGS_CONFIG: CurrencyConfig = {
  code: 'KGS',
  numeric: 417,
  precision: 2,
  symbol: 'лв',
  name: 'Kyrgystani Som',
  base: 10,
} as const;

/**
 * Create a KGS Currency instance
 * @returns Currency instance configured for Kyrgystani Som
 */
export function createKGS(): Currency {
  return createCurrency(KGS_CONFIG);
}

/**
 * Default KGS Currency instance
 * Ready to use for most common scenarios
 */
export const KGS = createKGS();

/**
 * Type-safe KGS currency code
 */
export const KGS_CODE = 'KGS' as const;
export type KGSCode = typeof KGS_CODE;
