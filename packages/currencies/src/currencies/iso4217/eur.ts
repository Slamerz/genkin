import {
	type Currency,
	type CurrencyConfig,
	createCurrency,
} from "@genkin/core";

/**
 * EUR Currency Configuration.
 *
 * Configuration object for Euro following ISO 4217 standard.
 * The EUR has 2 decimal places (cents) and uses the € symbol.
 *
 * @constant
 * @type {CurrencyConfig}
 *
 * @example
 * ```typescript
 * import { EUR_CONFIG, genkin } from '@genkin/currencies';
 *
 * const amount = genkin(10.50, { currency: EUR_CONFIG });
 * ```
 */
export const EUR_CONFIG: CurrencyConfig = {
	code: "EUR",
	numeric: 978,
	precision: 2,
	symbol: "€",
	name: "Euro",
	base: 10,
} as const;

/**
 * Create a EUR Currency instance.
 *
 * Factory function that creates a Currency object for Euros with
 * formatting and parsing capabilities.
 *
 * @returns {Currency} Currency instance configured for Euros
 *
 * @example
 * ```typescript
 * import { createEUR } from '@genkin/currencies';
 *
 * const eur = createEUR();
 * console.log(eur.format(1234.56)); // "€1,234.56"
 * ```
 */
export function createEUR(): Currency {
	return createCurrency(EUR_CONFIG);
}

/**
 * Default EUR Currency instance.
 *
 * Pre-configured Currency object for Euros, ready to use for monetary
 * operations throughout the Eurozone.
 *
 * @constant
 * @type {Currency}
 *
 * @example
 * ```typescript
 * import { genkin } from '@genkin/core';
 * import { EUR } from '@genkin/currencies';
 *
 * const price = genkin(29.99, { currency: EUR });
 * console.log(price.toString()); // "€29.99"
 * ```
 */
export const EUR = createEUR();

/**
 * Type-safe EUR currency code.
 *
 * @constant
 * @type {'EUR'}
 */
export const EUR_CODE = "EUR" as const;

/**
 * Type alias for EUR currency code.
 *
 * @typedef {typeof EUR_CODE} EURCode
 */
export type EURCode = typeof EUR_CODE;
