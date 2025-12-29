import { type CurrencyRegistry, currencyRegistry } from "./registry.js";

/**
 * Currency code following ISO 4217 standard.
 *
 * A three-letter alphabetic code that uniquely identifies a currency. Examples
 * include 'USD' for US Dollar, 'EUR' for Euro, 'JPY' for Japanese Yen, etc.
 *
 * @example
 * ```typescript
 * const usdCode: CurrencyCode = 'USD';
 * const eurCode: CurrencyCode = 'EUR';
 * const btcCode: CurrencyCode = 'BTC'; // Custom currencies are also supported
 * ```
 */
export type CurrencyCode = string;

/**
 * Currency exchange rate representation.
 *
 * Can be either a simple number (e.g., 0.89) or a scaled rate with precision
 * control (e.g., { amount: 89, scale: 2 } for 0.89).
 *
 * @example
 * ```typescript
 * // Simple rate
 * const rate: CurrencyRate = 0.89;
 *
 * // Scaled rate for precision
 * const preciseRate: CurrencyRate = { amount: 89, scale: 2 };
 * ```
 */
export type CurrencyRate = number | { amount: number; scale: number };

/**
 * Currency configuration interface.
 *
 * Defines the essential properties of a currency including its code, precision,
 * symbol, and other metadata. This configuration is used to create Currency
 * instances with formatting and parsing capabilities.
 *
 * @interface CurrencyConfig
 *
 * @example
 * ```typescript
 * const usdConfig: CurrencyConfig = {
 *   code: 'USD',
 *   numeric: 840,
 *   precision: 2,
 *   symbol: '$',
 *   name: 'US Dollar',
 *   base: 10
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Custom cryptocurrency configuration
 * const btcConfig: CurrencyConfig = {
 *   code: 'BTC',
 *   numeric: 0,
 *   precision: 8,
 *   symbol: '₿',
 *   name: 'Bitcoin',
 *   base: 10
 * };
 * ```
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
	/** The base, or radix of the currency (default: 10 for decimal) */
	base?: number;
}

/**
 * Formatting options for currency display.
 *
 * Controls how monetary amounts are formatted as strings, including symbol
 * display, grouping separators, decimal separators, and precision.
 *
 * @interface CurrencyFormatOptions
 *
 * @example
 * ```typescript
 * const options: CurrencyFormatOptions = {
 *   showSymbol: true,
 *   useGrouping: true,
 *   decimalPlaces: 2
 * };
 * ```
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
 * Currency interface that extends the basic config with formatting capabilities.
 *
 * Provides a complete currency object with both configuration data and methods
 * for formatting monetary amounts as strings and parsing strings back to numbers.
 *
 * @interface Currency
 * @extends CurrencyConfig
 *
 * @example
 * ```typescript
 * import { createCurrency, getCurrencyConfig } from '@genkin/core';
 *
 * const usd: Currency = createCurrency(getCurrencyConfig('USD'));
 *
 * // Format a number
 * const formatted = usd.format(1234.56);
 * console.log(formatted); // "$1,234.56"
 *
 * // Parse a string
 * const parsed = usd.parse('$1,234.56');
 * console.log(parsed); // 1234.56
 * ```
 */
export interface Currency extends CurrencyConfig {
	/**
	 * Format a number as a currency string.
	 *
	 * Converts a numeric amount to a formatted string representation according to
	 * the currency's conventions and the provided formatting options.
	 *
	 * @param {number} amount - The amount to format
	 * @param {CurrencyFormatOptions} [options] - Formatting options
	 * @returns {string} Formatted currency string
	 *
	 * @example
	 * ```typescript
	 * const usd = createCurrency(getCurrencyConfig('USD'));
	 * usd.format(1234.56); // "$1,234.56"
	 * usd.format(1234.56, { showSymbol: false }); // "1,234.56"
	 * ```
	 */
	format(amount: number, options?: CurrencyFormatOptions): string;

	/**
	 * Parse a currency string back into a number.
	 *
	 * Extracts the numeric value from a formatted currency string, removing
	 * symbols, separators, and other formatting characters.
	 *
	 * @param {string} value - The currency string to parse
	 * @returns {number} The parsed numeric value
	 *
	 * @example
	 * ```typescript
	 * const usd = createCurrency(getCurrencyConfig('USD'));
	 * usd.parse('$1,234.56'); // 1234.56
	 * usd.parse('1234.56'); // 1234.56
	 * ```
	 */
	parse(value: string): number;
}

/**
 * Rounding mode for currency calculations.
 *
 * Defines various strategies for rounding fractional monetary amounts. Different
 * rounding modes are appropriate for different financial contexts. For example,
 * ROUND_HALF_EVEN (banker's rounding) is commonly used in accounting to minimize
 * bias, while ROUND_DOWN is often used for discounts.
 *
 * @enum {string}
 *
 * @example
 * ```typescript
 * import { RoundingMode, genkin } from '@genkin/core';
 *
 * const amount = genkin(10.125, {
 *   currency: 'USD',
 *   precision: 3,
 *   rounding: RoundingMode.ROUND_HALF_UP
 * });
 * ```
 */
export enum RoundingMode {
	/** Round towards positive infinity */
	ROUND_UP = "ROUND_UP",
	/** Round towards negative infinity */
	ROUND_DOWN = "ROUND_DOWN",
	/** Round towards zero */
	ROUND_TOWARDS_ZERO = "ROUND_TOWARDS_ZERO",
	/** Round away from zero */
	ROUND_AWAY_FROM_ZERO = "ROUND_AWAY_FROM_ZERO",
	/** Round to nearest, ties to even */
	ROUND_HALF_EVEN = "ROUND_HALF_EVEN",
	/** Round to nearest, ties away from zero */
	ROUND_HALF_UP = "ROUND_HALF_UP",
	/** Round to nearest, ties towards zero */
	ROUND_HALF_DOWN = "ROUND_HALF_DOWN",
	/** Round to nearest, ties to odd */
	ROUND_HALF_ODD = "ROUND_HALF_ODD",
	/** Round to nearest, ties towards zero */
	ROUND_HALF_TOWARDS_ZERO = "ROUND_HALF_TOWARDS_ZERO",
	/** Round to nearest, ties away from zero */
	ROUND_HALF_AWAY_FROM_ZERO = "ROUND_HALF_AWAY_FROM_ZERO",
}

/**
 * Default currency configurations
 */
export const DEFAULT_CURRENCIES: Record<string, CurrencyConfig> = {
	USD: {
		code: "USD",
		numeric: 840,
		precision: 2,
		symbol: "$",
		name: "US Dollar",
	},
	EUR: { code: "EUR", numeric: 978, precision: 2, symbol: "€", name: "Euro" },
	GBP: {
		code: "GBP",
		numeric: 826,
		precision: 2,
		symbol: "£",
		name: "British Pound",
	},
	JPY: {
		code: "JPY",
		numeric: 392,
		precision: 0,
		symbol: "¥",
		name: "Japanese Yen",
	},
};

// Pre-register default currencies in the global registry
for (const config of Object.values(DEFAULT_CURRENCIES)) {
	currencyRegistry.register(config);
}

/**
 * Get currency configuration by code.
 *
 * Looks up a currency configuration in the registry by its ISO 4217 code. If the
 * currency is not found in the registry, returns a basic fallback configuration
 * with default values. Supports both built-in currencies (USD, EUR, GBP, JPY, etc.)
 * and custom currencies registered via the currency registry.
 *
 * @param {CurrencyCode} code - The ISO 4217 currency code to look up (e.g., 'USD')
 * @param {CurrencyRegistry} [registry=currencyRegistry] - Optional registry to use
 * @returns {CurrencyConfig} The currency configuration
 *
 * @example
 * ```typescript
 * import { getCurrencyConfig } from '@genkin/core';
 *
 * const usdConfig = getCurrencyConfig('USD');
 * console.log(usdConfig);
 * // {
 * //   code: 'USD',
 * //   numeric: 840,
 * //   precision: 2,
 * //   symbol: '$',
 * //   name: 'US Dollar',
 * //   base: 10
 * // }
 * ```
 *
 * @example
 * ```typescript
 * // Unknown currencies get default configuration
 * const customConfig = getCurrencyConfig('XYZ');
 * console.log(customConfig);
 * // {
 * //   code: 'XYZ',
 * //   numeric: 0,
 * //   precision: 2,
 * //   symbol: 'XYZ',
 * //   name: 'XYZ',
 * //   base: 10
 * // }
 * ```
 */
export function getCurrencyConfig(
	code: CurrencyCode,
	registry: CurrencyRegistry = currencyRegistry,
): CurrencyConfig {
	return (
		registry.get(code) ?? {
			code,
			numeric: 0,
			precision: 2,
			symbol: code,
			name: code,
			base: 10,
		}
	);
}

/**
 * Create a Currency instance from a CurrencyConfig.
 *
 * Converts a basic currency configuration into a full Currency object with
 * formatting and parsing methods. The created Currency can format numbers as
 * currency strings and parse currency strings back to numbers.
 *
 * @param {CurrencyConfig} config - The currency configuration
 * @returns {Currency} A Currency instance with format and parse methods
 *
 * @example
 * ```typescript
 * import { createCurrency, getCurrencyConfig } from '@genkin/core';
 *
 * const usdConfig = getCurrencyConfig('USD');
 * const usd = createCurrency(usdConfig);
 *
 * // Now you can format and parse
 * const formatted = usd.format(1234.56);
 * console.log(formatted); // "$1,234.56"
 *
 * const parsed = usd.parse('$1,234.56');
 * console.log(parsed); // 1234.56
 * ```
 *
 * @example
 * ```typescript
 * // Create custom currency
 * const customCurrency = createCurrency({
 *   code: 'BTC',
 *   numeric: 0,
 *   precision: 8,
 *   symbol: '₿',
 *   name: 'Bitcoin',
 *   base: 10
 * });
 *
 * console.log(customCurrency.format(0.12345678)); // "₿0.12345678"
 * ```
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
				groupingSeparator = ",",
				decimalSeparator = ".",
				decimalPlaces = config.precision,
			} = options;

			// Format the number with the specified precision
			const formattedNumber = amount.toFixed(decimalPlaces);

			// Split into integer and decimal parts
			const [integerPart, decimalPart] = formattedNumber.split(".");

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
				.replace(new RegExp(`[${config.symbol || ""}]`, "g"), "")
				.replace(new RegExp(config.code, "g"), "")
				.replace(/,/g, "") // Remove commas used as grouping separators
				.replace(/\s+/g, "") // Remove any whitespace
				.trim();

			// Parse the number
			return parseFloat(cleanValue) || 0;
		},
	};
}
