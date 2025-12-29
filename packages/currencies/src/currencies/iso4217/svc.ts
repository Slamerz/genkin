import { Currency, CurrencyConfig, createCurrency } from '@genkin/core';

/**
 * SVC Currency Configuration
 * Salvadoran Colón (ISO 4217: SVC)
 */
export const SVC_CONFIG: CurrencyConfig = {
  code: 'SVC',
  numeric: 222,
  precision: 2,
  symbol: '₡',
  name: 'Salvadoran Colón',
  base: 10,
} as const;

/**
 * Create a SVC Currency instance
 * @returns Currency instance configured for Salvadoran Colones
 */
export function createSVC(): Currency {
  return createCurrency(SVC_CONFIG);
}

/**
 * Default SVC Currency instance
 * Ready to use for most common scenarios
 */
export const SVC = createSVC();

/**
 * Type-safe SVC currency code
 */
export const SVC_CODE = 'SVC' as const;
export type SVCCode = typeof SVC_CODE;
