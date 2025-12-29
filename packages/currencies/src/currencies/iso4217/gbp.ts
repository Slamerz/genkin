import {
	type Currency,
	type CurrencyConfig,
	createCurrency,
} from "@genkin/core";

/**
 * GBP Currency Configuration.
 *
 * Configuration object for British Pound Sterling following ISO 4217 standard.
 * The GBP has 2 decimal places (pence) and uses the £ symbol.
 *
 * @constant
 * @type {CurrencyConfig}
 *
 * @example
 * ```typescript
 * import { GBP_CONFIG, genkin } from '@genkin/currencies';
 *
 * const amount = genkin(10.50, { currency: GBP_CONFIG });
 * ```
 */
export const GBP_CONFIG: CurrencyConfig = {
	code: "GBP",
	numeric: 826,
	precision: 2,
	symbol: "£",
	name: "British Pound Sterling",
	base: 10,
} as const;

/**
 * Create a GBP Currency instance.
 *
 * Factory function that creates a Currency object for British Pounds with
 * formatting and parsing capabilities.
 *
 * @returns {Currency} Currency instance configured for British Pounds
 *
 * @example
 * ```typescript
 * import { createGBP } from '@genkin/currencies';
 *
 * const gbp = createGBP();
 * console.log(gbp.format(1234.56)); // "£1,234.56"
 * ```
 */
export function createGBP(): Currency {
	return createCurrency(GBP_CONFIG);
}

/**
 * Default GBP Currency instance.
 *
 * Pre-configured Currency object for British Pounds, ready to use for
 * monetary operations in the United Kingdom.
 *
 * @constant
 * @type {Currency}
 *
 * @example
 * ```typescript
 * import { genkin } from '@genkin/core';
 * import { GBP } from '@genkin/currencies';
 *
 * const price = genkin(29.99, { currency: GBP });
 * console.log(price.toString()); // "£29.99"
 * ```
 */
export const GBP = createGBP();

/**
 * Type-safe GBP currency code.
 *
 * @constant
 * @type {'GBP'}
 */
export const GBP_CODE = "GBP" as const;

/**
 * Type alias for GBP currency code.
 *
 * @typedef {typeof GBP_CODE} GBPCode
 */
export type GBPCode = typeof GBP_CODE;
