import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SDG Currency Configuration
 * Sudanese Pound (ISO 4217: SDG)
 */
export const SDG_CONFIG: CurrencyConfig = {
  code: 'SDG',
  numeric: 938,
  precision: 2,
  symbol: '£',
  name: 'Sudanese Pound',
  base: 10,
} as const;

/**
 * Create a SDG Currency instance
 * @returns Currency instance configured for Sudanese Pounds
 */
export function createSDG(): Currency {
  return createCurrency(SDG_CONFIG);
}

/**
 * Default SDG Currency instance
 * Ready to use for most common scenarios
 */
export const SDG = createSDG();

/**
 * Type-safe SDG currency code
 */
export const SDG_CODE = 'SDG' as const;
export type SDGCode = typeof SDG_CODE;
