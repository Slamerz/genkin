import { describe, expect, it } from 'vitest';
import { genkin } from '../../src/core/index.js';
import { add, subtract, multiply, divide, abs, negate, allocate } from '../../src/operations/arithmetic.js';
import type { ScaledRatio } from '../../src/operations/arithmetic.js';
import { USD } from '../../src/currencies/index.js';
import { createCurrency, getCurrencyConfig } from '../../src/core/currency.js';

describe('Arithmetic Operations', () => {
  // Create currency objects for testing
  const EUR = createCurrency(getCurrencyConfig('EUR'));

  describe('Addition', () => {
    it('should add two amounts with same currency', () => {
      const a = genkin(12.34, { currency: USD });
      const b = genkin(5.67, { currency: USD });
      const result = add(a, b);

      expect(result.amount).toBe(18.01);
      expect(result.currencyCode).toBe('USD');
      expect(result.precision).toBe(2);
    });

    it('should handle different precisions by using the higher one', () => {
      const a = genkin(12.34, { currency: 'USD', precision: 2 });
      const b = genkin(5.678, { currency: 'USD', precision: 3 });
      const result = add(a, b);

      expect(result.amount).toBe(18.018);
      expect(result.precision).toBe(3);
    });

    it('should throw error for different currencies', () => {
      const usd = genkin(10, { currency: 'USD' });
      const eur = genkin(10, { currency: 'EUR' });

      expect(() => add(usd, eur)).toThrow('Cannot add different currencies: USD and EUR');
    });

    it('should handle zero values', () => {
      const a = genkin(10, { currency: 'USD' });
      const b = genkin(0, { currency: 'USD' });
      const result = add(a, b);

      expect(result.amount).toBe(10);
    });

    it('should handle negative values', () => {
      const a = genkin(10, { currency: 'USD' });
      const b = genkin(-3, { currency: 'USD' });
      const result = add(a, b);

      expect(result.amount).toBe(7);
    });
  });

  describe('Subtraction', () => {
    it('should subtract two amounts with same currency', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(5.67, { currency: 'USD' });
      const result = subtract(a, b);

      expect(result.amount).toBe(6.67);
      expect(result.currencyCode).toBe('USD');
      expect(result.precision).toBe(2);
    });

    it('should handle different precisions by using the higher one', () => {
      const a = genkin(12.345, { currency: 'USD', precision: 3 });
      const b = genkin(5.67, { currency: 'USD', precision: 2 });
      const result = subtract(a, b);

      expect(result.amount).toBe(6.675);
      expect(result.precision).toBe(3);
    });

    it('should throw error for different currencies', () => {
      const usd = genkin(10, { currency: 'USD' });
      const eur = genkin(5, { currency: 'EUR' });

      expect(() => subtract(usd, eur)).toThrow('Cannot subtract different currencies: USD and EUR');
    });

    it('should handle negative results', () => {
      const a = genkin(5, { currency: 'USD' });
      const b = genkin(10, { currency: 'USD' });
      const result = subtract(a, b);

      expect(result.amount).toBe(-5);
    });

    it('should handle zero subtraction', () => {
      const a = genkin(10, { currency: 'USD' });
      const b = genkin(0, { currency: 'USD' });
      const result = subtract(a, b);

      expect(result.amount).toBe(10);
    });
  });

  describe('Multiplication', () => {
    it('should multiply by a positive number', () => {
      const money = genkin(12.34, { currency: 'USD' });
      const result = multiply(money, 2);

      expect(result.amount).toBe(24.68);
      expect(result.currencyCode).toBe('USD');
      expect(result.precision).toBe(2);
    });

    it('should multiply by a decimal', () => {
      const money = genkin(10, { currency: 'USD' });
      const result = multiply(money, 0.5);

      expect(result.amount).toBe(5);
    });

    it('should multiply by zero', () => {
      const money = genkin(12.34, { currency: 'USD' });
      const result = multiply(money, 0);

      expect(result.amount).toBe(0);
    });

    it('should multiply by negative number', () => {
      const money = genkin(10, { currency: 'USD' });
      const result = multiply(money, -1.5);

      expect(result.amount).toBe(-15);
    });

    it('should throw error for invalid multiplier', () => {
      const money = genkin(10, { currency: 'USD' });

      expect(() => multiply(money, NaN)).toThrow('Multiplier must be a finite number');
      expect(() => multiply(money, Infinity)).toThrow('Multiplier must be a finite number');
    });

    it('should preserve currency and precision', () => {
      const money = genkin(12.345, { currency: 'EUR', precision: 3 });
      const result = multiply(money, 2);

      expect(result.currencyCode).toBe('EUR');
      expect(result.precision).toBe(3);
    });
  });

  describe('Division', () => {
    it('should divide by a positive number', () => {
      const money = genkin(12.34, { currency: 'USD' });
      const result = divide(money, 2);

      expect(result.amount).toBe(6.17);
      expect(result.currencyCode).toBe('USD');
      expect(result.precision).toBe(2);
    });

    it('should divide by a decimal', () => {
      const money = genkin(10, { currency: 'USD' });
      const result = divide(money, 0.5);

      expect(result.amount).toBe(20);
    });

    it('should handle division resulting in recurring decimal', () => {
      const money = genkin(10, { currency: 'USD' });
      const result = divide(money, 3);

      expect(result.amount).toBeCloseTo(3.33, 2);
    });

    it('should throw error for division by zero', () => {
      const money = genkin(10, { currency: 'USD' });

      expect(() => divide(money, 0)).toThrow('Cannot divide by zero');
    });

    it('should throw error for invalid divisor', () => {
      const money = genkin(10, { currency: 'USD' });

      expect(() => divide(money, NaN)).toThrow('Divisor must be a finite number');
      expect(() => divide(money, Infinity)).toThrow('Divisor must be a finite number');
    });

    it('should preserve currency and precision', () => {
      const money = genkin(12.345, { currency: 'EUR', precision: 3 });
      const result = divide(money, 2);

      expect(result.currencyCode).toBe('EUR');
      expect(result.precision).toBe(3);
    });
  });

  describe('Absolute Value', () => {
    it('should return absolute value of positive number', () => {
      const money = genkin(12.34, { currency: 'USD' });
      const result = abs(money);

      expect(result.amount).toBe(12.34);
      expect(result).toBe(money); // Should return same instance for positive values
    });

    it('should return absolute value of negative number', () => {
      const money = genkin(-12.34, { currency: 'USD' });
      const result = abs(money);

      expect(result.amount).toBe(12.34);
      expect(result.currencyCode).toBe('USD');
      expect(result.precision).toBe(2);
    });

    it('should handle zero', () => {
      const money = genkin(0, { currency: 'USD' });
      const result = abs(money);

      expect(result.amount).toBe(0);
      expect(result).toBe(money); // Should return same instance for zero
    });
  });

  describe('Negation', () => {
    it('should negate positive number', () => {
      const money = genkin(12.34, { currency: 'USD' });
      const result = negate(money);

      expect(result.amount).toBe(-12.34);
      expect(result.currencyCode).toBe('USD');
      expect(result.precision).toBe(2);
    });

    it('should negate negative number', () => {
      const money = genkin(-12.34, { currency: 'USD' });
      const result = negate(money);

      expect(result.amount).toBe(12.34);
    });

    it('should handle zero', () => {
      const money = genkin(0, { currency: 'USD' });
      const result = negate(money);

      expect(result.amount).toBe(-0); // JavaScript has -0 and 0
      expect(Object.is(result.amount, -0) || result.amount === 0).toBe(true);
    });
  });

  describe('Immutability', () => {
    it('should not modify original instances in addition', () => {
      const a = genkin(10, { currency: 'USD' });
      const b = genkin(5, { currency: 'USD' });
      const originalA = a.amount;
      const originalB = b.amount;

      add(a, b);

      expect(a.amount).toBe(originalA);
      expect(b.amount).toBe(originalB);
    });

    it('should not modify original instance in multiplication', () => {
      const money = genkin(10, { currency: 'USD' });
      const original = money.amount;

      multiply(money, 2);

      expect(money.amount).toBe(original);
    });
  });

  describe('Allocation', () => {
    it('should allocate with simple ratios', () => {
      const money = genkin(100, { currency: 'USD' });
      const result = allocate(money, [25, 75]);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(25);
      expect(result[1].amount).toBe(75);
      
      // Verify currency and precision are preserved
      result.forEach(allocated => {
        expect(allocated.currencyCode).toBe('USD');
        expect(allocated.precision).toBe(2);
      });

      // Verify sum equals original
      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
    });

    it('should allocate with percentage ratios', () => {
      const money = genkin(100, { currency: 'USD' });
      const result = allocate(money, [1, 3]); // Same as [25, 75]

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(25);
      expect(result[1].amount).toBe(75);
    });

    it('should handle indivisible amounts with remainder distribution', () => {
      const money = genkin(10, { currency: 'USD' });
      const result = allocate(money, [1, 1, 1]); // Split $10 three ways

      expect(result).toHaveLength(3);
      
      // Should be [3.34, 3.33, 3.33] or similar distribution
      const amounts = result.map(r => r.amount);
      const sum = amounts.reduce((acc, curr) => acc + curr, 0);
      
      expect(sum).toBe(10); // Sum should equal original
      
      // Check that remainder is distributed fairly
      const minAmount = Math.min(...amounts);
      const maxAmount = Math.max(...amounts);
      expect(maxAmount - minAmount).toBeLessThanOrEqual(0.01); // Difference should be at most 1 cent
    });

    it('should handle zero ratios', () => {
      const money = genkin(100, { currency: 'USD' });
      const result = allocate(money, [0, 50, 50]);

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(0);
      expect(result[1].amount).toBe(50);
      expect(result[2].amount).toBe(50);

      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
    });

    it('should handle scaled ratios', () => {
      const money = genkin(100, { currency: 'USD' });
      const scaledRatios: ScaledRatio[] = [
        { amount: 505, scale: 1 }, // 50.5%
        { amount: 495, scale: 1 }  // 49.5%
      ];
      const result = allocate(money, scaledRatios);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBeCloseTo(50.5, 2);
      expect(result[1].amount).toBeCloseTo(49.5, 2);

      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
    });

    it('should handle mixed simple and scaled ratios', () => {
      const money = genkin(100, { currency: 'USD' });
      const mixedRatios = [
        25,
        { amount: 755, scale: 1 } // 75.5% scaled
      ];
      const result = allocate(money, mixedRatios);

      expect(result).toHaveLength(2);
      
      // With scale 1, the ratios become [250, 755] which is roughly [24.9%, 75.1%]
      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
    });

    it('should handle complex remainder distribution', () => {
      // Test case that would create uneven remainders
      const money = genkin(10.01, { currency: 'USD' });
      const result = allocate(money, [1, 1, 1]);

      expect(result).toHaveLength(3);
      
      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(10.01);
      
      // Check that all amounts are reasonable (should be around 3.34, 3.34, 3.33)
      result.forEach(allocated => {
        expect(allocated.amount).toBeGreaterThanOrEqual(3.33);
        expect(allocated.amount).toBeLessThanOrEqual(3.34);
      });
    });

    it('should preserve precision from original Genkin', () => {
      const money = genkin(100.123, { currency: 'USD', precision: 3 });
      const result = allocate(money, [1, 1]);

      result.forEach(allocated => {
        expect(allocated.precision).toBe(3);
        expect(allocated.currencyCode).toBe('USD');
      });
    });

    it('should handle negative amounts', () => {
      const money = genkin(-100, { currency: 'USD' });
      const result = allocate(money, [25, 75]);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(-25);
      expect(result[1].amount).toBe(-75);

      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(-100);
    });

    it('should throw error for empty ratios array', () => {
      const money = genkin(100, { currency: 'USD' });
      
      expect(() => allocate(money, [])).toThrow('Ratios array cannot be empty');
    });

    it('should throw error for all zero ratios', () => {
      const money = genkin(100, { currency: 'USD' });
      
      expect(() => allocate(money, [0, 0, 0])).toThrow('Total ratio cannot be zero');
    });

    it('should not modify original Genkin instance', () => {
      const money = genkin(100, { currency: 'USD' });
      const original = money.amount;

      allocate(money, [1, 1]);

      expect(money.amount).toBe(original);
    });

    it('should handle large scale differences', () => {
      const money = genkin(100, { currency: 'USD' });
      const ratios = [
        { amount: 1, scale: 0 },    // 1
        { amount: 50, scale: 2 }    // 0.5
      ];
      const result = allocate(money, ratios);

      expect(result).toHaveLength(2);
      
      // Ratios normalize to [100, 50] so roughly 2:1 ratio
      expect(result[0].amount).toBeCloseTo(66.67, 1);
      expect(result[1].amount).toBeCloseTo(33.33, 1);

      const sum = result.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
    });
  });
}); 