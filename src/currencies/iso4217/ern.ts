import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * ERN Currency Configuration
 * Eritrean Nakfa (ISO 4217: ERN)
 */
export const ERN_CONFIG: CurrencyConfig = {
  code: 'ERN',
  numeric: 232,
  precision: 2,
  symbol: 'Nfk',
  name: 'Eritrean Nakfa',
  base: 10,
} as const;

/**
 * Create a ERN Currency instance
 * @returns Currency instance configured for Eritrean Nakfas
 */
export function createERN(): Currency {
  return createCurrency(ERN_CONFIG);
}

/**
 * Default ERN Currency instance
 * Ready to use for most common scenarios
 */
export const ERN = createERN();

/**
 * Type-safe ERN currency code
 */
export const ERN_CODE = 'ERN' as const;
export type ERNCode = typeof ERN_CODE;
