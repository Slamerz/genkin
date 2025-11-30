import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * HUF Currency Configuration
 * Hungarian Forint (ISO 4217: HUF)
 */
export const HUF_CONFIG: CurrencyConfig = {
  code: 'HUF',
  numeric: 348,
  precision: 2,
  symbol: 'Ft',
  name: 'Hungarian Forint',
  base: 10,
} as const;

/**
 * Create a HUF Currency instance
 * @returns Currency instance configured for Hungarian Forints
 */
export function createHUF(): Currency {
  return createCurrency(HUF_CONFIG);
}

/**
 * Default HUF Currency instance
 * Ready to use for most common scenarios
 */
export const HUF = createHUF();

/**
 * Type-safe HUF currency code
 */
export const HUF_CODE = 'HUF' as const;
export type HUFCode = typeof HUF_CODE;
