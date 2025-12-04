import { CurrencyRegistry, currencyRegistry } from './registry.js';

/**
 * Currency code following ISO 4217 standard
 */
export type CurrencyCode = string;

/**
 * Currency configuration interface
 */
export interface CurrencyConfig {
  /** ISO 4217 currency code (e.g., 'USD', 'EUR') */
  code: CurrencyCode;
  /** ISO 4217 numeric code (e.g., 840 for USD) */
  numeric: number;
  /** Number of decimal digits for this currency */
  precision: number;
  /** Currency symbol (e.g., '$', '€') */
  symbol?: string;
  /** Currency name (e.g., 'US Dollar', 'Euro') */
  name?: string;
  /** The base, or radix of the currency. */
  base?: number;
}

/**
 * Formatting options for currency display
 */
export interface CurrencyFormatOptions {
  /** Whether to show the currency symbol */
  showSymbol?: boolean;
  /** Whether to show the currency code */
  showCode?: boolean;
  /** Whether to show the currency name */
  showName?: boolean;
  /** Whether to use grouping separators (e.g., 1,000,000) */
  useGrouping?: boolean;
  /** The character to use for grouping (default: ',') */
  groupingSeparator?: string;
  /** The character to use for decimal point (default: '.') */
  decimalSeparator?: string;
  /** The number of decimal places to show (defaults to currency precision) */
  decimalPlaces?: number;
}

/**
 * Currency interface that extends the basic config with formatting capabilities
 */
export interface Currency extends CurrencyConfig {
  /**
   * Format a number as a currency string
   * @param amount The amount to format
   * @param options Formatting options
   * @returns Formatted currency string
   */
  format(amount: number, options?: CurrencyFormatOptions): string;
  
  /**
   * Parse a currency string back into a number
   * @param value The currency string to parse
   * @returns The parsed number
   */
  parse(value: string): number;
}

/**
 * Rounding mode for currency calculations
 */
export enum RoundingMode {
  /** Round towards positive infinity */
  ROUND_UP = 'ROUND_UP',
  /** Round towards negative infinity */
  ROUND_DOWN = 'ROUND_DOWN',
  /** Round towards zero */
  ROUND_TOWARDS_ZERO = 'ROUND_TOWARDS_ZERO',
  /** Round away from zero */
  ROUND_AWAY_FROM_ZERO = 'ROUND_AWAY_FROM_ZERO',
  /** Round to nearest, ties to even */
  ROUND_HALF_EVEN = 'ROUND_HALF_EVEN',
  /** Round to nearest, ties away from zero */
  ROUND_HALF_UP = 'ROUND_HALF_UP',
  /** Round to nearest, ties towards zero */
  ROUND_HALF_DOWN = 'ROUND_HALF_DOWN',
  /** Round to nearest, ties to odd */
  ROUND_HALF_ODD = 'ROUND_HALF_ODD',
  /** Round to nearest, ties towards zero */
  ROUND_HALF_TOWARDS_ZERO = 'ROUND_HALF_TOWARDS_ZERO',
  /** Round to nearest, ties away from zero */
  ROUND_HALF_AWAY_FROM_ZERO = 'ROUND_HALF_AWAY_FROM_ZERO',
}

/**
 * Default currency configurations
 */
export const DEFAULT_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', numeric: 840, precision: 2, symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', numeric: 978, precision: 2, symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', numeric: 826, precision: 2, symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', numeric: 392, precision: 0, symbol: '¥', name: 'Japanese Yen' },
};

// Pre-register default currencies in the global registry
for (const config of Object.values(DEFAULT_CURRENCIES)) {
  currencyRegistry.register(config);
}

/**
 * Get currency configuration by code.
 * Looks up the currency in the provided registry (or global registry by default).
 * Falls back to a basic configuration if the currency is not found.
 * @param code The currency code to look up
 * @param registry Optional registry to use (defaults to global currencyRegistry)
 * @returns The currency configuration
 */
export function getCurrencyConfig(
  code: CurrencyCode,
  registry: CurrencyRegistry = currencyRegistry
): CurrencyConfig {
  return registry.get(code) ?? {
    code,
    numeric: 0,
    precision: 2,
    symbol: code,
    name: code,
    base: 10,
  };
}

/**
 * Create a Currency instance from a CurrencyConfig
 */
export function createCurrency(config: CurrencyConfig): Currency {
  return {
    ...config,
    format: (amount: number, options: CurrencyFormatOptions = {}) => {
      const {
        showSymbol = true,
        showCode = false,
        showName = false,
        useGrouping = true,
        groupingSeparator = ',',
        decimalSeparator = '.',
        decimalPlaces = config.precision,
      } = options;

      // Format the number with the specified precision
      const formattedNumber = amount.toFixed(decimalPlaces);
      
      // Split into integer and decimal parts
      const [integerPart, decimalPart] = formattedNumber.split('.');
      
      // Add grouping if enabled
      const groupedInteger = useGrouping
        ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupingSeparator)
        : integerPart;
      
      // Combine parts
      const formattedAmount = decimalPart
        ? `${groupedInteger}${decimalSeparator}${decimalPart}`
        : groupedInteger;
      
      // Build the final string
      let result = formattedAmount;
      if (showSymbol && config.symbol) {
        result = `${config.symbol}${result}`;
      }
      if (showCode) {
        result = `${result} ${config.code}`;
      }
      if (showName) {
        result = `${result} (${config.name})`;
      }
      
      return result;
    },
    parse: (value: string): number => {
      // Remove currency symbols, codes, and common grouping separators
      const cleanValue = value
        .replace(new RegExp(`[${config.symbol || ''}]`, 'g'), '')
        .replace(new RegExp(config.code, 'g'), '')
        .replace(/,/g, '') // Remove commas used as grouping separators
        .replace(/\s+/g, '') // Remove any whitespace
        .trim();
      
      // Parse the number
      return parseFloat(cleanValue) || 0;
    },
  };
} 