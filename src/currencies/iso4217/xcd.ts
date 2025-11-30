import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * XCD Currency Configuration
 * East Caribbean Dollar (ISO 4217: XCD)
 */
export const XCD_CONFIG: CurrencyConfig = {
  code: 'XCD',
  numeric: 951,
  precision: 2,
  symbol: '$',
  name: 'East Caribbean Dollar',
  base: 10,
} as const;

/**
 * Create a XCD Currency instance
 * @returns Currency instance configured for East Caribbean Dollars
 */
export function createXCD(): Currency {
  return createCurrency(XCD_CONFIG);
}

/**
 * Default XCD Currency instance
 * Ready to use for most common scenarios
 */
export const XCD = createXCD();

/**
 * Type-safe XCD currency code
 */
export const XCD_CODE = 'XCD' as const;
export type XCDCode = typeof XCD_CODE;
