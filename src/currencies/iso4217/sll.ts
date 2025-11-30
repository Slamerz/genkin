import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SLL Currency Configuration
 * Sierra Leonean Leone (ISO 4217: SLL)
 */
export const SLL_CONFIG: CurrencyConfig = {
  code: 'SLL',
  numeric: 694,
  precision: 2,
  symbol: 'Le',
  name: 'Sierra Leonean Leone',
  base: 10,
} as const;

/**
 * Create a SLL Currency instance
 * @returns Currency instance configured for Sierra Leonean Leones
 */
export function createSLL(): Currency {
  return createCurrency(SLL_CONFIG);
}

/**
 * Default SLL Currency instance
 * Ready to use for most common scenarios
 */
export const SLL = createSLL();

/**
 * Type-safe SLL currency code
 */
export const SLL_CODE = 'SLL' as const;
export type SLLCode = typeof SLL_CODE;
