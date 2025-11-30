import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * KWD Currency Configuration
 * Kuwaiti Dinar (ISO 4217: KWD)
 */
export const KWD_CONFIG: CurrencyConfig = {
  code: 'KWD',
  numeric: 414,
  precision: 3,
  symbol: 'د.ك',
  name: 'Kuwaiti Dinar',
  base: 10,
} as const;

/**
 * Create a KWD Currency instance
 * @returns Currency instance configured for Kuwaiti Dinars
 */
export function createKWD(): Currency {
  return createCurrency(KWD_CONFIG);
}

/**
 * Default KWD Currency instance
 * Ready to use for most common scenarios
 */
export const KWD = createKWD();

/**
 * Type-safe KWD currency code
 */
export const KWD_CODE = 'KWD' as const;
export type KWDCode = typeof KWD_CODE;
