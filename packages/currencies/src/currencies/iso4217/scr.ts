import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * SCR Currency Configuration
 * Seychellois Rupee (ISO 4217: SCR)
 */
export const SCR_CONFIG: CurrencyConfig = {
  code: 'SCR',
  numeric: 690,
  precision: 2,
  symbol: '₨',
  name: 'Seychellois Rupee',
  base: 10,
} as const;

/**
 * Create a SCR Currency instance
 * @returns Currency instance configured for Seychellois Rupees
 */
export function createSCR(): Currency {
  return createCurrency(SCR_CONFIG);
}

/**
 * Default SCR Currency instance
 * Ready to use for most common scenarios
 */
export const SCR = createSCR();

/**
 * Type-safe SCR currency code
 */
export const SCR_CODE = 'SCR' as const;
export type SCRCode = typeof SCR_CODE;
