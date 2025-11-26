import { describe, expect, it } from 'vitest';
import { dinero, toDecimal, add, subtract, multiply, divide, equals, lessThan, greaterThan, isZero, isPositive, isNegative, allocate } from '../../src/dinero-v2/index.js';
import type { DineroCurrency } from '../../src/dinero-v2/index.js';

describe('Dinero V2 Compatibility Layer', () => {
  // Test currencies similar to @dinero.js/currencies
  const USD: DineroCurrency = { code: 'USD', scale: 2 };
  const EUR: DineroCurrency = { code: 'EUR', scale: 2 };
  const JPY: DineroCurrency = { code: 'JPY', scale: 0 };

  describe('Core API', () => {
    it('should create dinero instances compatible with v2 API', () => {
      const money = dinero({ amount: 500, currency: USD });
      
      expect(money.toJSON().amount).toBe(500);
      expect(money.toJSON().currency.code).toBe('USD');
      expect(money.toJSON().scale).toBe(2);
    });

    it('should handle precision correctly', () => {
      const highPrecision = dinero({ amount: 123456, currency: USD, scale: 4 });
      
      expect(highPrecision.toJSON().amount).toBe(123456);
      expect(highPrecision.toJSON().scale).toBe(4);
    });

    it('should handle zero precision currencies', () => {
      const jpyMoney = dinero({ amount: 1000, currency: JPY });
      
      expect(jpyMoney.toJSON().amount).toBe(1000);
      expect(jpyMoney.toJSON().scale).toBe(0);
    });

    it('should provide toDecimal conversion', () => {
      const money = dinero({ amount: 2599, currency: USD });
      const decimal = toDecimal(money);
      
      expect(decimal).toBe('25.99');
    });

    it('should handle toDecimal for high precision', () => {
      const money = dinero({ amount: 123456, currency: USD, scale: 4 });
      const decimal = toDecimal(money);
      
      expect(decimal).toBe('12.3456');
    });

    it('should handle toDecimal for zero precision', () => {
      const money = dinero({ amount: 1000, currency: JPY });
      const decimal = toDecimal(money);
      
      expect(decimal).toBe('1000');
    });
  });

  describe('Arithmetic Operations', () => {
    it('should add two dinero instances', () => {
      const money1 = dinero({ amount: 1050, currency: USD });
      const money2 = dinero({ amount: 525, currency: USD });
      const result = add(money1, money2);
      
      expect(result.toJSON().amount).toBe(1575);
      expect(result.toJSON().currency.code).toBe('USD');
    });

    it('should subtract two dinero instances', () => {
      const money1 = dinero({ amount: 2075, currency: USD });
      const money2 = dinero({ amount: 825, currency: USD });
      const result = subtract(money1, money2);
      
      expect(result.toJSON().amount).toBe(1250);
      expect(result.toJSON().currency.code).toBe('USD');
    });

    it('should multiply a dinero instance', () => {
      const money = dinero({ amount: 1234, currency: USD });
      const result = multiply(money, 3);
      
      expect(result.toJSON().amount).toBe(3702);
      expect(result.toJSON().currency.code).toBe('USD');
    });

    it('should divide a dinero instance', () => {
      const money = dinero({ amount: 10000, currency: USD });
      const result = divide(money, 4);
      
      expect(result.toJSON().amount).toBe(2500);
      expect(result.toJSON().currency.code).toBe('USD');
    });

    it('should handle currency mismatch errors', () => {
      const usdMoney = dinero({ amount: 1000, currency: USD });
      const eurMoney = dinero({ amount: 1000, currency: EUR });
      
      expect(() => add(usdMoney, eurMoney)).toThrow();
      expect(() => subtract(usdMoney, eurMoney)).toThrow();
    });

    it('should handle precision differences in operations', () => {
      const lowPrec = dinero({ amount: 105, currency: USD, scale: 1 });
      const highPrec = dinero({ amount: 1055, currency: USD, scale: 2 });
      
      const result = add(lowPrec, highPrec);
      expect(result.toJSON().scale).toBe(2);
      expect(result.toJSON().amount).toBe(2105); // 10.5 + 10.55 = 21.05
    });
  });

  describe('Comparison Operations', () => {
    it('should compare equality correctly', () => {
      const money1 = dinero({ amount: 1550, currency: USD });
      const money2 = dinero({ amount: 1550, currency: USD });
      const money3 = dinero({ amount: 2000, currency: USD });
      
      expect(equals(money1, money2)).toBe(true);
      expect(equals(money1, money3)).toBe(false);
    });

    it('should compare less than correctly', () => {
      const money1 = dinero({ amount: 1000, currency: USD });
      const money2 = dinero({ amount: 2000, currency: USD });
      
      expect(lessThan(money1, money2)).toBe(true);
      expect(lessThan(money2, money1)).toBe(false);
    });

    it('should compare greater than correctly', () => {
      const money1 = dinero({ amount: 1000, currency: USD });
      const money2 = dinero({ amount: 2000, currency: USD });
      
      expect(greaterThan(money2, money1)).toBe(true);
      expect(greaterThan(money1, money2)).toBe(false);
    });

    it('should check zero values correctly', () => {
      const zeroMoney = dinero({ amount: 0, currency: USD });
      const positiveMoney = dinero({ amount: 1000, currency: USD });
      const negativeMoney = dinero({ amount: -500, currency: USD });
      
      expect(isZero(zeroMoney)).toBe(true);
      expect(isPositive(positiveMoney)).toBe(true);
      expect(isNegative(negativeMoney)).toBe(true);
      
      expect(isZero(positiveMoney)).toBe(false);
      expect(isPositive(zeroMoney)).toBe(false);
      expect(isNegative(zeroMoney)).toBe(false);
    });
  });

  describe('Allocation', () => {
    it('should allocate money equally', () => {
      const money = dinero({ amount: 1000, currency: USD });
      const result = allocate(money, [1, 1, 1]);
      
      expect(result).toHaveLength(3);
      
      const sum = result.reduce((acc, curr) => acc + curr.toJSON().amount, 0);
      expect(sum).toBe(1000);
      
      result.forEach(part => {
        expect(part.toJSON().currency.code).toBe('USD');
        expect(part.toJSON().scale).toBe(2);
      });
    });

    it('should allocate money proportionally', () => {
      const money = dinero({ amount: 10000, currency: USD });
      const result = allocate(money, [25, 75]);
      
      expect(result).toHaveLength(2);
      expect(result[0].toJSON().amount).toBe(2500); // 25%
      expect(result[1].toJSON().amount).toBe(7500); // 75%
    });

    it('should handle indivisible amounts correctly', () => {
      const money = dinero({ amount: 1003, currency: USD });
      const result = allocate(money, [1, 1, 1]);
      
      expect(result).toHaveLength(3);
      
      const sum = result.reduce((acc, curr) => acc + curr.toJSON().amount, 0);
      expect(sum).toBe(1003);
    });

    it('should handle zero ratios', () => {
      const money = dinero({ amount: 10000, currency: USD });
      const result = allocate(money, [0, 50, 50]);
      
      expect(result).toHaveLength(3);
      expect(result[0].toJSON().amount).toBe(0);
      expect(result[1].toJSON().amount).toBe(5000);
      expect(result[2].toJSON().amount).toBe(5000);
    });

    it('should handle negative amounts', () => {
      const money = dinero({ amount: -5000, currency: USD });
      const result = allocate(money, [1, 3]);
      
      expect(result).toHaveLength(2);
      expect(result[0].toJSON().amount).toBe(-1250);
      expect(result[1].toJSON().amount).toBe(-3750);
      
      const sum = result.reduce((acc, curr) => acc + curr.toJSON().amount, 0);
      expect(sum).toBe(-5000);
    });

    it('should throw on invalid allocation', () => {
      const money = dinero({ amount: 1000, currency: USD });
      
      expect(() => allocate(money, [])).toThrow('Ratios array cannot be empty');
      expect(() => allocate(money, [0, 0, 0])).toThrow('Total ratio cannot be zero');
    });
  });

  describe('Edge Cases', () => {
    it('should handle large numbers', () => {
      const largeMoney = dinero({ amount: 99999999999, currency: USD });
      
      expect(largeMoney.toJSON().amount).toBe(99999999999);
      expect(toDecimal(largeMoney)).toBe('999999999.99');
    });

    it('should maintain immutability', () => {
      const original = dinero({ amount: 10000, currency: USD });
      const modified = add(original, dinero({ amount: 5000, currency: USD }));
      
      expect(original.toJSON().amount).toBe(10000);
      expect(modified.toJSON().amount).toBe(15000);
    });

    it('should handle chained operations', () => {
      const base = dinero({ amount: 1000, currency: USD });
      const doubled = multiply(base, 2);
      const result = add(doubled, dinero({ amount: 500, currency: USD }));
      
      expect(result.toJSON().amount).toBe(2500);
    });

    it('should work with different currencies', () => {
      const eurMoney = dinero({ amount: 4250, currency: EUR });
      const jpyMoney = dinero({ amount: 1000, currency: JPY });
      
      expect(eurMoney.toJSON().currency.code).toBe('EUR');
      expect(jpyMoney.toJSON().currency.code).toBe('JPY');
      expect(eurMoney.toJSON().scale).toBe(2);
      expect(jpyMoney.toJSON().scale).toBe(0);
    });
  });
});
