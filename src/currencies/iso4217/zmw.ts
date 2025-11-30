import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * ZMW Currency Configuration
 * Zambian Kwacha (ISO 4217: ZMW)
 */
export const ZMW_CONFIG: CurrencyConfig = {
  code: 'ZMW',
  numeric: 967,
  precision: 2,
  symbol: 'ZK',
  name: 'Zambian Kwacha',
  base: 10,
} as const;

/**
 * Create a ZMW Currency instance
 * @returns Currency instance configured for Zambian Kwachas
 */
export function createZMW(): Currency {
  return createCurrency(ZMW_CONFIG);
}

/**
 * Default ZMW Currency instance
 * Ready to use for most common scenarios
 */
export const ZMW = createZMW();

/**
 * Type-safe ZMW currency code
 */
export const ZMW_CODE = 'ZMW' as const;
export type ZMWCode = typeof ZMW_CODE;
