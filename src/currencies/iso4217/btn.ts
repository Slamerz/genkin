import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * BTN Currency Configuration
 * Bhutanese Ngultrum (ISO 4217: BTN)
 */
export const BTN_CONFIG: CurrencyConfig = {
  code: 'BTN',
  numeric: 64,
  precision: 2,
  symbol: 'Nu.',
  name: 'Bhutanese Ngultrum',
  base: 10,
} as const;

/**
 * Create a BTN Currency instance
 * @returns Currency instance configured for Bhutanese Ngultrum
 */
export function createBTN(): Currency {
  return createCurrency(BTN_CONFIG);
}

/**
 * Default BTN Currency instance
 * Ready to use for most common scenarios
 */
export const BTN = createBTN();

/**
 * Type-safe BTN currency code
 */
export const BTN_CODE = 'BTN' as const;
export type BTNCode = typeof BTN_CODE;
