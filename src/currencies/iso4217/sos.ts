import { Currency, CurrencyConfig, createCurrency } from '../../core/currency.js';

/**
 * SOS Currency Configuration
 * Somali Shilling (ISO 4217: SOS)
 */
export const SOS_CONFIG: CurrencyConfig = {
  code: 'SOS',
  numeric: 706,
  precision: 2,
  symbol: 'Sh',
  name: 'Somali Shilling',
  base: 10,
} as const;

/**
 * Create a SOS Currency instance
 * @returns Currency instance configured for Somali Shillings
 */
export function createSOS(): Currency {
  return createCurrency(SOS_CONFIG);
}

/**
 * Default SOS Currency instance
 * Ready to use for most common scenarios
 */
export const SOS = createSOS();

/**
 * Type-safe SOS currency code
 */
export const SOS_CODE = 'SOS' as const;
export type SOSCode = typeof SOS_CODE;
