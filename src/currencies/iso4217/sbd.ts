import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SBD Currency Configuration
 * Solomon Islands Dollar (ISO 4217: SBD)
 */
export const SBD_CONFIG: CurrencyConfig = {
  code: 'SBD',
  numeric: 90,
  precision: 2,
  symbol: '$',
  name: 'Solomon Islands Dollar',
  base: 10,
} as const;

/**
 * Create a SBD Currency instance
 * @returns Currency instance configured for Solomon Islands Dollars
 */
export function createSBD(): Currency {
  return createCurrency(SBD_CONFIG);
}

/**
 * Default SBD Currency instance
 * Ready to use for most common scenarios
 */
export const SBD = createSBD();

/**
 * Type-safe SBD currency code
 */
export const SBD_CODE = 'SBD' as const;
export type SBDCode = typeof SBD_CODE;
