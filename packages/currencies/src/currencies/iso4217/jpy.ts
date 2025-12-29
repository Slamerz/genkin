import {
	type Currency,
	type CurrencyConfig,
	createCurrency,
} from "@genkin/core";

/**
 * JPY Currency Configuration.
 *
 * Configuration object for Japanese Yen following ISO 4217 standard.
 * The JPY has 0 decimal places (no sub-units) and uses the ¥ symbol.
 *
 * Note: Unlike most currencies, Japanese Yen doesn't have fractional units,
 * so amounts are always whole numbers.
 *
 * @constant
 * @type {CurrencyConfig}
 *
 * @example
 * ```typescript
 * import { JPY_CONFIG, genkin } from '@genkin/currencies';
 *
 * const amount = genkin(1000, { currency: JPY_CONFIG });
 * ```
 */
export const JPY_CONFIG: CurrencyConfig = {
	code: "JPY",
	numeric: 392,
	precision: 0,
	symbol: "¥",
	name: "Japanese Yen",
	base: 10,
} as const;

/**
 * Create a JPY Currency instance.
 *
 * Factory function that creates a Currency object for Japanese Yen with
 * formatting and parsing capabilities.
 *
 * @returns {Currency} Currency instance configured for Japanese Yen
 *
 * @example
 * ```typescript
 * import { createJPY } from '@genkin/currencies';
 *
 * const jpy = createJPY();
 * console.log(jpy.format(1000)); // "¥1,000"
 * ```
 */
export function createJPY(): Currency {
	return createCurrency(JPY_CONFIG);
}

/**
 * Default JPY Currency instance.
 *
 * Pre-configured Currency object for Japanese Yen, ready to use for
 * monetary operations in Japan. Note that JPY has no fractional units.
 *
 * @constant
 * @type {Currency}
 *
 * @example
 * ```typescript
 * import { genkin } from '@genkin/core';
 * import { JPY } from '@genkin/currencies';
 *
 * // JPY amounts are always whole numbers
 * const price = genkin(1000, { currency: JPY });
 * console.log(price.toString()); // "1000 JPY"
 * ```
 */
export const JPY = createJPY();

/**
 * Type-safe JPY currency code.
 *
 * @constant
 * @type {'JPY'}
 */
export const JPY_CODE = "JPY" as const;

/**
 * Type alias for JPY currency code.
 *
 * @typedef {typeof JPY_CODE} JPYCode
 */
export type JPYCode = typeof JPY_CODE;
