import {
	type Currency,
	type CurrencyConfig,
	createCurrency,
} from "@genkin/core";

/**
 * USD Currency Configuration.
 *
 * Configuration object for United States Dollar following ISO 4217 standard.
 * The USD has 2 decimal places (cents) and uses the $ symbol.
 *
 * @constant
 * @type {CurrencyConfig}
 *
 * @example
 * ```typescript
 * import { USD_CONFIG, genkin } from '@genkin/currencies';
 *
 * // Use the config directly
 * const amount = genkin(10.50, { currency: USD_CONFIG });
 * ```
 */
export const USD_CONFIG: CurrencyConfig = {
	code: "USD",
	numeric: 840,
	precision: 2,
	symbol: "$",
	name: "US Dollar",
	base: 10,
} as const;

/**
 * Create a USD Currency instance.
 *
 * Factory function that creates a Currency object for US Dollars with
 * formatting and parsing capabilities.
 *
 * @returns {Currency} Currency instance configured for US Dollars
 *
 * @example
 * ```typescript
 * import { createUSD } from '@genkin/currencies';
 *
 * const usd = createUSD();
 * const formatted = usd.format(1234.56);
 * console.log(formatted); // "$1,234.56"
 * ```
 */
export function createUSD(): Currency {
	return createCurrency(USD_CONFIG);
}

/**
 * Default USD Currency instance.
 *
 * Pre-configured Currency object for US Dollars, ready to use for monetary
 * operations. This is the most convenient way to work with USD in Genkin.
 *
 * @constant
 * @type {Currency}
 *
 * @example
 * ```typescript
 * import { genkin } from '@genkin/core';
 * import { USD } from '@genkin/currencies';
 *
 * // Create USD amount
 * const price = genkin(29.99, { currency: USD });
 * console.log(price.toString()); // "$29.99"
 *
 * // Format amount
 * console.log(USD.format(1234.56)); // "$1,234.56"
 *
 * // Parse string
 * console.log(USD.parse('$1,234.56')); // 1234.56
 * ```
 *
 * @example
 * ```typescript
 * // Use with arithmetic operations
 * import { genkin, add, multiply } from '@genkin/core';
 * import { USD } from '@genkin/currencies';
 *
 * const price = genkin(100, { currency: USD });
 * const tax = multiply(price, 0.08); // 8% tax
 * const total = add(price, tax);
 *
 * console.log(total.toString()); // "$108.00"
 * ```
 */
export const USD = createUSD();

/**
 * Type-safe USD currency code.
 *
 * Literal type for the USD currency code, useful for type-safe currency
 * code comparisons and function parameters.
 *
 * @constant
 * @type {'USD'}
 *
 * @example
 * ```typescript
 * import { USD_CODE, type USDCode } from '@genkin/currencies';
 *
 * function processUSD(code: USDCode) {
 *   console.log(`Processing ${code}`);
 * }
 *
 * processUSD(USD_CODE); // OK
 * processUSD('USD'); // OK
 * processUSD('EUR'); // Type error!
 * ```
 */
export const USD_CODE = "USD" as const;

/**
 * Type alias for USD currency code.
 *
 * @typedef {typeof USD_CODE} USDCode
 */
export type USDCode = typeof USD_CODE;
