import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * IQD Currency Configuration
 * Iraqi Dinar (ISO 4217: IQD)
 */
export const IQD_CONFIG: CurrencyConfig = {
  code: 'IQD',
  numeric: 368,
  precision: 3,
  symbol: 'ع.د',
  name: 'Iraqi Dinar',
  base: 10,
} as const;

/**
 * Create a IQD Currency instance
 * @returns Currency instance configured for Iraqi Dinars
 */
export function createIQD(): Currency {
  return createCurrency(IQD_CONFIG);
}

/**
 * Default IQD Currency instance
 * Ready to use for most common scenarios
 */
export const IQD = createIQD();

/**
 * Type-safe IQD currency code
 */
export const IQD_CODE = 'IQD' as const;
export type IQDCode = typeof IQD_CODE;
