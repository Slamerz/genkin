import { USD as USD_DINERO } from "@dinero.js/currencies";
import {
	createCurrency,
	EUR,
	Genkin,
	genkin,
	getCurrencyConfig,
	JPY,
	RoundingMode,
	USD,
} from "@genkin/core";
import { dinero, toDecimal } from "dinero.js";
import { describe, expect, it } from "vitest";

describe("Genkin Core", () => {
	const XYZ = createCurrency({
		code: "XYZ",
		numeric: 999,
		precision: 2,
		symbol: "XYZ",
		name: "Test Currency",
	});

	describe("Construction", () => {
		it("should create a Genkin instance with default options", () => {
			const money = genkin(12.34);

			expect(money).toBeInstanceOf(Genkin);
			expect(money.amount).toBe(12.34);
			expect(money.currencyCode).toBe("USD");
			expect(money.precision).toBe(2);
			expect(money.rounding).toBe(RoundingMode.ROUND_HALF_EVEN);
		});

		it("should create a Genkin instance with custom currency", () => {
			const money = genkin(10.5, { currency: EUR });

			expect(money.currencyCode).toBe("EUR");
			expect(money.amount).toBe(10.5);
			expect(money.precision).toBe(2);
		});

		it("should handle Japanese Yen (0 precision currency)", () => {
			const money = genkin(1000, { currency: JPY });

			expect(money.currencyCode).toBe("JPY");
			expect(money.amount).toBe(1000);
			expect(money.precision).toBe(0);
			expect(money.minorUnits).toBe(1000);
		});

		it("should create with custom precision", () => {
			const money = genkin(12.3456, { currency: USD, precision: 4 });

			expect(money.precision).toBe(4);
			expect(money.amount).toBe(12.3456);
			expect(money.minorUnits).toBe(123456);
		});

		it("should accept string amounts", () => {
			const money = genkin("12.34", { currency: USD });

			expect(money.amount).toBe(12.34);
			expect(money.currencyCode).toBe("USD");
		});

		it("should throw error for invalid amounts", () => {
			expect(() => genkin(NaN)).toThrow("Amount must be a finite number");
			expect(() => genkin(Infinity)).toThrow("Amount must be a finite number");
			expect(() => genkin("invalid")).toThrow("Amount must be a finite number");
		});
	});

	describe("Properties", () => {
		const money = genkin(12.34, { currency: USD, precision: 2 });
		const dineroMoney = dinero({ amount: 1234, currency: USD_DINERO });

		it("should have correct amount property", () => {
			expect(money.amount).toBe(12.34);
		});

		it("should have correct minorUnits property", () => {
			expect(money.minorUnits).toBe(1234);
		});

		it("should have correct currency property", () => {
			expect(money.currencyCode).toBe("USD");
		});

		it("should have correct precision property", () => {
			expect(money.precision).toBe(2);
		});

		it("should have correct currencyConfig property", () => {
			const config = money.currencyConfig;
			expect(config.code).toBe("USD");
			expect(config.symbol).toBe("$");
			expect(config.precision).toBe(2);
		});

		describe("Dinero.js comparison", () => {
			it("should have the same minorUnits amount", () => {
				expect(money.minorUnits).toBe(dineroMoney.toJSON().amount);
			});

			it("should handle decimal places", () => {
				expect(money.amount).toBe(+toDecimal(dineroMoney));
			});

			it("should match Dinero.js precision handling", () => {
				const genkinHP = genkin(12.3456, { currency: USD, precision: 4 });
				const dineroHP = dinero({
					amount: 123456,
					currency: USD_DINERO,
					scale: 4,
				});

				expect(genkinHP.minorUnits).toBe(dineroHP.toJSON().amount);
				expect(genkinHP.precision).toBe(dineroHP.toJSON().scale);
				expect(genkinHP.amount).toBe(+toDecimal(dineroHP));
			});

			it("should match Dinero.js zero precision currencies", () => {
				const JPY = createCurrency(getCurrencyConfig("JPY"));
				const genkinJPY = genkin(1000, { currency: JPY });
				const dineroJPY = dinero({
					amount: 1000,
					currency: USD_DINERO,
					scale: 0,
				});

				expect(genkinJPY.minorUnits).toBe(dineroJPY.toJSON().amount);
				expect(genkinJPY.precision).toBe(dineroJPY.toJSON().scale);
			});

			it("should match Dinero.js serialization format", () => {
				const genkinJSON = money.toJSON();
				const dineroJSON = dineroMoney.toJSON();

				expect(genkinJSON.amount).toBe(+toDecimal(dineroMoney));
				expect(genkinJSON.currency).toBe(dineroJSON.currency.code);
				expect(genkinJSON.precision).toBe(dineroJSON.scale);
			});
		});
	});

	describe("Currency and Precision Comparison", () => {
		it("should correctly identify same currency", () => {
			const usd1 = genkin(10, { currency: USD });
			const usd2 = genkin(20, { currency: USD });
			const eur = genkin(10, { currency: EUR });

			expect(usd1.hasSameCurrency(usd2)).toBe(true);
			expect(usd1.hasSameCurrency(eur)).toBe(false);
		});

		it("should correctly identify same precision", () => {
			const money1 = genkin(10, { precision: 2 });
			const money2 = genkin(20, { precision: 2 });
			const money3 = genkin(10, { precision: 4 });

			expect(money1.hasSamePrecision(money2)).toBe(true);
			expect(money1.hasSamePrecision(money3)).toBe(false);
		});
	});

	describe("Utility Methods", () => {
		const money = genkin(12.34, { currency: USD });

		it("should create new instance with different amount", () => {
			const newMoney = money.withAmount(56.78);

			expect(newMoney.amount).toBe(56.78);
			expect(newMoney.currencyCode).toBe("USD");
			expect(newMoney.precision).toBe(2);
			expect(newMoney).not.toBe(money); // Should be different instance
		});

		it("should create new instance with different currency", () => {
			const newMoney = money.withCurrency(EUR);

			expect(newMoney.amount).toBe(12.34);
			expect(newMoney.currencyCode).toBe("EUR");
			expect(newMoney.precision).toBe(2);
			expect(newMoney).not.toBe(money); // Should be different instance
		});
	});

	describe("Serialization", () => {
		const money = genkin(12.34, { currency: USD, precision: 2 });

		it("should convert to object", () => {
			const obj = money.toObject();

			expect(obj).toEqual({
				amount: 12.34,
				currency: "USD",
				precision: 2,
			});
		});

		it("should convert to JSON", () => {
			const json = money.toJSON();

			expect(json).toEqual({
				amount: 12.34,
				currency: "USD",
				precision: 2,
			});
		});

		it("should serialize to JSON string correctly", () => {
			const jsonString = JSON.stringify(money);
			const parsed = JSON.parse(jsonString);

			expect(parsed.amount).toBe(12.34);
			expect(parsed.currency).toBe("USD");
			expect(parsed.precision).toBe(2);
		});
	});

	describe("String Representation", () => {
		it("should format USD with symbol", () => {
			const money = genkin(12.34, { currency: USD });
			expect(money.toString()).toBe("$12.34");
		});

		it("should format EUR with symbol", () => {
			const money = genkin(10.5, { currency: EUR });
			expect(money.toString()).toBe("€10.50");
		});

		it("should format JPY without decimals", () => {
			const money = genkin(1000, { currency: JPY });
			expect(money.toString()).toBe("¥1000");
		});

		it("should format unknown currency with code", () => {
			const money = genkin(12.34, { currency: XYZ });
			expect(money.toString()).toBe("12.34 XYZ");
		});

		it("should handle high precision formatting", () => {
			const money = genkin(12.3456, { currency: USD, precision: 4 });
			expect(money.toString()).toBe("$12.3456");
		});
	});

	describe("Value Conversion", () => {
		it("should convert to number (valueOf)", () => {
			const money = genkin(12.34, { currency: USD });
			expect(+money).toBe(12.34); // Uses valueOf()
			expect(Number(money)).toBe(12.34);
		});

		it("should work with explicit conversion", () => {
			const money = genkin(10, { currency: USD });
			expect(money.valueOf()).toBe(10);
			expect(money.amount).toBe(10);
		});
	});
});
