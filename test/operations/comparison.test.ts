import { describe, expect, it } from 'vitest';
import { genkin } from '../../src/core/index.js';
import {
  equals,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  isZero,
  isPositive,
  isNegative,
  min,
  max,
} from '../../src/operations/comparison.js';

describe('Comparison Operations', () => {
  describe('Equality', () => {
    it('should return true for equal amounts with same currency', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(equals(a, b)).toBe(true);
    });

    it('should return false for different amounts with same currency', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(5.67, { currency: 'USD' });

      expect(equals(a, b)).toBe(false);
    });

    it('should return false for same amounts with different currencies', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'EUR' });

      expect(equals(a, b)).toBe(false);
    });

    it('should handle different precisions correctly', () => {
      const a = genkin(12.34, { currency: 'USD', precision: 2 });
      const b = genkin(12.340, { currency: 'USD', precision: 3 });

      expect(equals(a, b)).toBe(true);
    });

    it('should handle zero values', () => {
      const a = genkin(0, { currency: 'USD' });
      const b = genkin(0, { currency: 'USD' });

      expect(equals(a, b)).toBe(true);
    });

    it('should handle negative values', () => {
      const a = genkin(-12.34, { currency: 'USD' });
      const b = genkin(-12.34, { currency: 'USD' });

      expect(equals(a, b)).toBe(true);
    });
  });

  describe('Less Than', () => {
    it('should return true when first amount is less than second', () => {
      const a = genkin(5.67, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(lessThan(a, b)).toBe(true);
    });

    it('should return false when first amount is greater than second', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(5.67, { currency: 'USD' });

      expect(lessThan(a, b)).toBe(false);
    });

    it('should return false when amounts are equal', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(lessThan(a, b)).toBe(false);
    });

    it('should throw error for different currencies', () => {
      const usd = genkin(10, { currency: 'USD' });
      const eur = genkin(5, { currency: 'EUR' });

      expect(() => lessThan(usd, eur)).toThrow('Cannot compare different currencies: USD and EUR');
    });

    it('should handle negative values', () => {
      const a = genkin(-10, { currency: 'USD' });
      const b = genkin(-5, { currency: 'USD' });

      expect(lessThan(a, b)).toBe(true);
    });
  });

  describe('Less Than Or Equal', () => {
    it('should return true when first amount is less than second', () => {
      const a = genkin(5.67, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(lessThanOrEqual(a, b)).toBe(true);
    });

    it('should return true when amounts are equal', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(lessThanOrEqual(a, b)).toBe(true);
    });

    it('should return false when first amount is greater than second', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(5.67, { currency: 'USD' });

      expect(lessThanOrEqual(a, b)).toBe(false);
    });
  });

  describe('Greater Than', () => {
    it('should return true when first amount is greater than second', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(5.67, { currency: 'USD' });

      expect(greaterThan(a, b)).toBe(true);
    });

    it('should return false when first amount is less than second', () => {
      const a = genkin(5.67, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(greaterThan(a, b)).toBe(false);
    });

    it('should return false when amounts are equal', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(greaterThan(a, b)).toBe(false);
    });

    it('should throw error for different currencies', () => {
      const usd = genkin(10, { currency: 'USD' });
      const eur = genkin(5, { currency: 'EUR' });

      expect(() => greaterThan(usd, eur)).toThrow('Cannot compare different currencies: USD and EUR');
    });
  });

  describe('Greater Than Or Equal', () => {
    it('should return true when first amount is greater than second', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(5.67, { currency: 'USD' });

      expect(greaterThanOrEqual(a, b)).toBe(true);
    });

    it('should return true when amounts are equal', () => {
      const a = genkin(12.34, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(greaterThanOrEqual(a, b)).toBe(true);
    });

    it('should return false when first amount is less than second', () => {
      const a = genkin(5.67, { currency: 'USD' });
      const b = genkin(12.34, { currency: 'USD' });

      expect(greaterThanOrEqual(a, b)).toBe(false);
    });
  });

  describe('Value Type Checks', () => {
    describe('isZero', () => {
      it('should return true for zero values', () => {
        const zero = genkin(0, { currency: 'USD' });
        expect(isZero(zero)).toBe(true);
      });

      it('should return false for non-zero values', () => {
        const positive = genkin(10, { currency: 'USD' });
        const negative = genkin(-10, { currency: 'USD' });

        expect(isZero(positive)).toBe(false);
        expect(isZero(negative)).toBe(false);
      });

      it('should handle very small amounts', () => {
        const tiny = genkin(0.001, { currency: 'USD', precision: 3 });
        expect(isZero(tiny)).toBe(false);
      });
    });

    describe('isPositive', () => {
      it('should return true for positive values', () => {
        const positive = genkin(10, { currency: 'USD' });
        expect(isPositive(positive)).toBe(true);
      });

      it('should return true for zero', () => {
        const zero = genkin(0, { currency: 'USD' });
        expect(isPositive(zero)).toBe(true);
      });

      it('should return false for negative values', () => {
        const negative = genkin(-10, { currency: 'USD' });
        expect(isPositive(negative)).toBe(false);
      });
    });

    describe('isNegative', () => {
      it('should return true for negative values', () => {
        const negative = genkin(-10, { currency: 'USD' });
        expect(isNegative(negative)).toBe(true);
      });

      it('should return false for zero', () => {
        const zero = genkin(0, { currency: 'USD' });
        expect(isNegative(zero)).toBe(false);
      });

      it('should return false for positive values', () => {
        const positive = genkin(10, { currency: 'USD' });
        expect(isNegative(positive)).toBe(false);
      });
    });
  });

  describe('Min/Max Functions', () => {
    describe('min', () => {
      it('should return the minimum of two values', () => {
        const a = genkin(12.34, { currency: 'USD' });
        const b = genkin(5.67, { currency: 'USD' });
        const result = min(a, b);

        expect(result.amount).toBe(5.67);
        expect(result).toBe(b); // Should return the actual instance
      });

      it('should handle multiple values', () => {
        const a = genkin(12.34, { currency: 'USD' });
        const b = genkin(5.67, { currency: 'USD' });
        const c = genkin(8.90, { currency: 'USD' });
        const result = min(a, b, c);

        expect(result.amount).toBe(5.67);
      });

      it('should handle single value', () => {
        const a = genkin(12.34, { currency: 'USD' });
        const result = min(a);

        expect(result).toBe(a);
      });

      it('should throw error for empty array', () => {
        expect(() => min()).toThrow('Cannot find minimum of empty array');
      });

      it('should handle negative values', () => {
        const a = genkin(-5, { currency: 'USD' });
        const b = genkin(-10, { currency: 'USD' });
        const result = min(a, b);

        expect(result.amount).toBe(-10);
      });

      it('should handle mixed positive and negative values', () => {
        const a = genkin(5, { currency: 'USD' });
        const b = genkin(-10, { currency: 'USD' });
        const c = genkin(15, { currency: 'USD' });
        const result = min(a, b, c);

        expect(result.amount).toBe(-10);
      });
    });

    describe('max', () => {
      it('should return the maximum of two values', () => {
        const a = genkin(12.34, { currency: 'USD' });
        const b = genkin(5.67, { currency: 'USD' });
        const result = max(a, b);

        expect(result.amount).toBe(12.34);
        expect(result).toBe(a); // Should return the actual instance
      });

      it('should handle multiple values', () => {
        const a = genkin(12.34, { currency: 'USD' });
        const b = genkin(5.67, { currency: 'USD' });
        const c = genkin(8.90, { currency: 'USD' });
        const result = max(a, b, c);

        expect(result.amount).toBe(12.34);
      });

      it('should handle single value', () => {
        const a = genkin(12.34, { currency: 'USD' });
        const result = max(a);

        expect(result).toBe(a);
      });

      it('should throw error for empty array', () => {
        expect(() => max()).toThrow('Cannot find maximum of empty array');
      });

      it('should handle negative values', () => {
        const a = genkin(-5, { currency: 'USD' });
        const b = genkin(-10, { currency: 'USD' });
        const result = max(a, b);

        expect(result.amount).toBe(-5);
      });

      it('should handle mixed positive and negative values', () => {
        const a = genkin(5, { currency: 'USD' });
        const b = genkin(-10, { currency: 'USD' });
        const c = genkin(15, { currency: 'USD' });
        const result = max(a, b, c);

        expect(result.amount).toBe(15);
      });
    });
  });

  describe('Precision Handling in Comparisons', () => {
    it('should compare correctly with different precisions', () => {
      const a = genkin(12.34, { currency: 'USD', precision: 2 });
      const b = genkin(12.340, { currency: 'USD', precision: 3 });

      expect(equals(a, b)).toBe(true);
      expect(lessThan(a, b)).toBe(false);
      expect(greaterThan(a, b)).toBe(false);
    });

    it('should handle precision differences in ordering', () => {
      const a = genkin(12.34, { currency: 'USD', precision: 2 });
      const b = genkin(12.341, { currency: 'USD', precision: 3 });

      expect(lessThan(a, b)).toBe(true);
      expect(greaterThan(b, a)).toBe(true);
    });
  });
}); 
