import { describe, expect, it } from "vitest";
import { genkin, Genkin } from "@genkin/core";

describe('Genkin Main Module', () => {
  describe('Factory Function', () => {
    it('should create a Genkin instance', () => {
      const money = genkin(100);
      
      expect(money).toBeDefined();
      expect(money).toBeInstanceOf(Genkin);
      expect(money.amount).toBe(100);
      expect(money.currencyCode).toBe('USD');
    });

    it('should format correctly by default', () => {
      const money = genkin(1.00);
      expect(money.toString()).toBe('$1.00');
    });

    it('should handle cents properly', () => {
      const money = genkin(1.23);
      expect(money.toString()).toBe('$1.23');
      expect(money.amount).toBe(1.23);
      expect(money.minorUnits).toBe(123);
    });

    it('should handle zero amounts', () => {
      const money = genkin(0);
      expect(money.toString()).toBe('$0.00');
      expect(money.amount).toBe(0);
    });

    it('should handle negative amounts', () => {
      const money = genkin(-12.34);
      expect(money.toString()).toBe('$-12.34');
      expect(money.amount).toBe(-12.34);
    });
  });

  describe('Currency Support', () => {
    it('should support different currencies', () => {
      const usd = genkin(100, { currency: 'USD' });
      const eur = genkin(85, { currency: 'EUR' });
      const jpy = genkin(1000, { currency: 'JPY' });

      expect(usd.toString()).toBe('$100.00');
      expect(eur.toString()).toBe('€85.00');
      expect(jpy.toString()).toBe('¥1000');
    });

    it('should handle unknown currencies', () => {
      const crypto = genkin(0.5, { currency: 'BTC' });
      expect(crypto.toString()).toBe('0.50 BTC');
    });
  });

  describe('Precision Handling', () => {
    it('should handle different precisions', () => {
      const standard = genkin(12.34, { currency: 'USD' });
      const highPrecision = genkin(12.3456, { currency: 'USD', precision: 4 });
      const zeroPrecision = genkin(123, { currency: 'JPY' });

      expect(standard.precision).toBe(2);
      expect(highPrecision.precision).toBe(4);
      expect(zeroPrecision.precision).toBe(0);

      expect(standard.toString()).toBe('$12.34');
      expect(highPrecision.toString()).toBe('$12.3456');
      expect(zeroPrecision.toString()).toBe('¥123');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain basic functionality from original implementation', () => {
      const cash = genkin(100);
      
      // Basic properties that were in the original implementation
      expect(cash).toBeDefined();
      expect(cash.amount).toBe(100);
      expect(cash.currencyCode).toBe('USD');
      expect(cash.toString()).toBe('$100.00');
    });

    it('should handle the original cents-to-dollars behavior', () => {
      // Original implementation assumed cents, new implementation assumes dollars
      const dollars = genkin(1.00);
      expect(dollars.toString()).toBe('$1.00');
      
      // To get the old behavior (100 cents = $1.00), you'd now do:
      const fromCents = genkin(1, { currency: 'USD' });
      expect(fromCents.toString()).toBe('$1.00');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large amounts', () => {
      const large = genkin(999999999999.99);
      expect(large.amount).toBe(999999999999.99);
      expect(large.toString()).toBe('$999999999999.99');
    });

    it('should handle very small amounts', () => {
      const small = genkin(0.01);
      expect(small.amount).toBe(0.01);
      expect(small.toString()).toBe('$0.01');
    });

    it('should handle string inputs', () => {
      const fromString = genkin('12.34');
      expect(fromString.amount).toBe(12.34);
      expect(fromString.toString()).toBe('$12.34');
    });
  });

  describe('Type Safety', () => {
    it('should throw on invalid inputs', () => {
      expect(() => genkin(NaN)).toThrow('Amount must be a finite number');
      expect(() => genkin(Infinity)).toThrow('Amount must be a finite number');
      expect(() => genkin('invalid')).toThrow('Amount must be a finite number');
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const money = genkin(12.34, { currency: 'USD' });
      const json = JSON.stringify(money);
      const parsed = JSON.parse(json);

      expect(parsed.amount).toBe(12.34);
      expect(parsed.currency).toBe('USD');
      expect(parsed.precision).toBe(2);
    });

    it('should convert to object', () => {
      const money = genkin(12.34, { currency: 'EUR' });
      const obj = money.toObject();

      expect(obj).toEqual({
        amount: 12.34,
        currency: 'EUR',
        precision: 2,
      });
    });
  });
});


