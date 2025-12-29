import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * AED Currency Configuration
 * United Arab Emirates Dirham (ISO 4217: AED)
 */
export const AED_CONFIG: CurrencyConfig = {
  code: 'AED',
  numeric: 784,
  precision: 2,
  symbol: 'د.م.',
  name: 'United Arab Emirates Dirham',
  base: 10,
} as const;

/**
 * Create a AED Currency instance
 * @returns Currency instance configured for United Arab Emirates Dirham
 */
export function createAED(): Currency {
  return createCurrency(AED_CONFIG);
}

/**
 * Default AED Currency instance
 * Ready to use for most common scenarios
 */
export const AED = createAED();

/**
 * Type-safe AED currency code
 */
export const AED_CODE = 'AED' as const;
export type AEDCode = typeof AED_CODE; 
