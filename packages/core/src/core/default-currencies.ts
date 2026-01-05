import { type CurrencyConfig, createCurrency } from "./currency.js";
import { currencyRegistry } from "./registry.js";

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
 * Default Currency objects for common currencies.
 *
 * These are pre-configured Currency instances that can be imported and used directly.
 *
 * @example
 * ```typescript
 * import { USD } from '@genkin/core';
 *
 * const formatted = USD.format(1234.56);
 * console.log(formatted); // "$1,234.56"
 * ```
 */
export const USD = createCurrency(DEFAULT_CURRENCIES.USD);
export const EUR = createCurrency(DEFAULT_CURRENCIES.EUR);
export const GBP = createCurrency(DEFAULT_CURRENCIES.GBP);
export const JPY = createCurrency(DEFAULT_CURRENCIES.JPY);
