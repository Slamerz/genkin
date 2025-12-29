import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * ILS Currency Configuration
 * Israeli Shekel (ISO 4217: ILS)
 */
export const ILS_CONFIG: CurrencyConfig = {
  code: 'ILS',
  numeric: 376,
  precision: 2,
  symbol: '₪',
  name: 'Israeli Shekel',
  base: 10,
} as const;

/**
 * Create a ILS Currency instance
 * @returns Currency instance configured for Israeli Shekels
 */
export function createILS(): Currency {
  return createCurrency(ILS_CONFIG);
}

/**
 * Default ILS Currency instance
 * Ready to use for most common scenarios
 */
export const ILS = createILS();

/**
 * Type-safe ILS currency code
 */
export const ILS_CODE = 'ILS' as const;
export type ILSCode = typeof ILS_CODE;
