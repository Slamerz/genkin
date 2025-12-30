import { describe, expect, it } from 'vitest';
import {
  toMinorUnits,
  fromMinorUnits,
  applyRounding,
  safeAdd,
  safeSubtract,
  safeMultiply,
  safeDivide,
} from '@genkin/core';
import { RoundingMode } from '@genkin/core';

describe('Precision Utilities', () => {
  describe('Minor Units Conversion', () => {
    describe('toMinorUnits', () => {
      it('should convert decimal to minor units with precision 2', () => {
        expect(toMinorUnits(12.34, 2)).toBe(1234);
        expect(toMinorUnits(0.01, 2)).toBe(1);
        expect(toMinorUnits(100, 2)).toBe(10000);
      });

      it('should convert decimal to minor units with precision 0', () => {
        expect(toMinorUnits(1000, 0)).toBe(1000);
        expect(toMinorUnits(123.45, 0)).toBe(123); // Rounds to nearest
      });

      it('should convert decimal to minor units with precision 4', () => {
        expect(toMinorUnits(12.3456, 4)).toBe(123456);
        expect(toMinorUnits(0.0001, 4)).toBe(1);
      });

      it('should handle negative values', () => {
        expect(toMinorUnits(-12.34, 2)).toBe(-1234);
        expect(toMinorUnits(-0.01, 2)).toBe(-1);
      });

      it('should handle zero', () => {
        expect(toMinorUnits(0, 2)).toBe(0);
        expect(toMinorUnits(0, 0)).toBe(0);
        expect(toMinorUnits(0, 4)).toBe(0);
      });
    });

    describe('fromMinorUnits', () => {
      it('should convert minor units to decimal with precision 2', () => {
        expect(fromMinorUnits(1234, 2)).toBe(12.34);
        expect(fromMinorUnits(1, 2)).toBe(0.01);
        expect(fromMinorUnits(10000, 2)).toBe(100);
      });

      it('should convert minor units to decimal with precision 0', () => {
        expect(fromMinorUnits(1000, 0)).toBe(1000);
        expect(fromMinorUnits(123, 0)).toBe(123);
      });

      it('should convert minor units to decimal with precision 4', () => {
        expect(fromMinorUnits(123456, 4)).toBe(12.3456);
        expect(fromMinorUnits(1, 4)).toBe(0.0001);
      });

      it('should handle negative values', () => {
        expect(fromMinorUnits(-1234, 2)).toBe(-12.34);
        expect(fromMinorUnits(-1, 2)).toBe(-0.01);
      });

      it('should handle zero', () => {
        expect(fromMinorUnits(0, 2)).toBe(0);
        expect(fromMinorUnits(0, 0)).toBe(0);
        expect(fromMinorUnits(0, 4)).toBe(0);
      });
    });

    describe('Round Trip Conversion', () => {
      it('should maintain precision in round trip conversion', () => {
        const values = [12.34, 0.01, 100, 999.99, 0];
        const precision = 2;

        values.forEach(value => {
          const minorUnits = toMinorUnits(value, precision);
          const roundTrip = fromMinorUnits(minorUnits, precision);
          expect(roundTrip).toBe(value);
        });
      });

      it('should handle high precision round trips', () => {
        const values = [12.3456, 0.0001, 999.9999];
        const precision = 4;

        values.forEach(value => {
          const minorUnits = toMinorUnits(value, precision);
          const roundTrip = fromMinorUnits(minorUnits, precision);
          expect(roundTrip).toBe(value);
        });
      });
    });
  });

  describe('Rounding Modes', () => {
    describe('ROUND_UP', () => {
      it('should round towards positive infinity', () => {
        expect(applyRounding(2.1, RoundingMode.ROUND_UP)).toBe(3);
        expect(applyRounding(2.0, RoundingMode.ROUND_UP)).toBe(2);
        expect(applyRounding(-2.1, RoundingMode.ROUND_UP)).toBe(-2);
        expect(applyRounding(-2.0, RoundingMode.ROUND_UP)).toBe(-2);
      });
    });

    describe('ROUND_DOWN', () => {
      it('should round towards negative infinity', () => {
        expect(applyRounding(2.9, RoundingMode.ROUND_DOWN)).toBe(2);
        expect(applyRounding(2.0, RoundingMode.ROUND_DOWN)).toBe(2);
        expect(applyRounding(-2.1, RoundingMode.ROUND_DOWN)).toBe(-3);
        expect(applyRounding(-2.0, RoundingMode.ROUND_DOWN)).toBe(-2);
      });
    });

    describe('ROUND_TOWARDS_ZERO', () => {
      it('should round towards zero', () => {
        expect(applyRounding(2.9, RoundingMode.ROUND_TOWARDS_ZERO)).toBe(2);
        expect(applyRounding(2.0, RoundingMode.ROUND_TOWARDS_ZERO)).toBe(2);
        expect(applyRounding(-2.9, RoundingMode.ROUND_TOWARDS_ZERO)).toBe(-2);
        expect(applyRounding(-2.0, RoundingMode.ROUND_TOWARDS_ZERO)).toBe(-2);
      });
    });

    describe('ROUND_AWAY_FROM_ZERO', () => {
      it('should round away from zero', () => {
        expect(applyRounding(2.1, RoundingMode.ROUND_AWAY_FROM_ZERO)).toBe(3);
        expect(applyRounding(2.0, RoundingMode.ROUND_AWAY_FROM_ZERO)).toBe(2);
        expect(applyRounding(-2.1, RoundingMode.ROUND_AWAY_FROM_ZERO)).toBe(-3);
        expect(applyRounding(-2.0, RoundingMode.ROUND_AWAY_FROM_ZERO)).toBe(-2);
      });
    });

    describe('ROUND_HALF_UP', () => {
      it('should round half values up', () => {
        expect(applyRounding(2.5, RoundingMode.ROUND_HALF_UP)).toBe(3);
        expect(applyRounding(3.5, RoundingMode.ROUND_HALF_UP)).toBe(4);
        expect(applyRounding(2.4, RoundingMode.ROUND_HALF_UP)).toBe(2);
        expect(applyRounding(2.6, RoundingMode.ROUND_HALF_UP)).toBe(3);
      });
    });

    describe('ROUND_HALF_DOWN', () => {
      it('should round half values down', () => {
        expect(applyRounding(2.5, RoundingMode.ROUND_HALF_DOWN)).toBe(2);
        expect(applyRounding(3.5, RoundingMode.ROUND_HALF_DOWN)).toBe(3);
        expect(applyRounding(2.4, RoundingMode.ROUND_HALF_DOWN)).toBe(2);
        expect(applyRounding(2.6, RoundingMode.ROUND_HALF_DOWN)).toBe(3);
      });
    });

    describe('ROUND_HALF_EVEN (Banker\'s Rounding)', () => {
      it('should round half values to nearest even', () => {
        expect(applyRounding(2.5, RoundingMode.ROUND_HALF_EVEN)).toBe(2); // 2 is even
        expect(applyRounding(3.5, RoundingMode.ROUND_HALF_EVEN)).toBe(4); // 4 is even
        expect(applyRounding(4.5, RoundingMode.ROUND_HALF_EVEN)).toBe(4); // 4 is even
        expect(applyRounding(5.5, RoundingMode.ROUND_HALF_EVEN)).toBe(6); // 6 is even
      });

      it('should round non-half values normally', () => {
        expect(applyRounding(2.4, RoundingMode.ROUND_HALF_EVEN)).toBe(2);
        expect(applyRounding(2.6, RoundingMode.ROUND_HALF_EVEN)).toBe(3);
        expect(applyRounding(3.4, RoundingMode.ROUND_HALF_EVEN)).toBe(3);
        expect(applyRounding(3.6, RoundingMode.ROUND_HALF_EVEN)).toBe(4);
      });
    });
  });

  describe('Safe Arithmetic Operations', () => {
    describe('safeAdd', () => {
      it('should add numbers correctly', () => {
        expect(safeAdd(1234, 567)).toBe(1801);
        expect(safeAdd(-100, 50)).toBe(-50);
        expect(safeAdd(0, 100)).toBe(100);
      });
    });

    describe('safeSubtract', () => {
      it('should subtract numbers correctly', () => {
        expect(safeSubtract(1234, 567)).toBe(667);
        expect(safeSubtract(100, 150)).toBe(-50);
        expect(safeSubtract(100, 0)).toBe(100);
      });
    });

    describe('safeMultiply', () => {
      it('should multiply with rounding for precision', () => {
        // Test multiplication with precision 2
        const result1 = safeMultiply(1000, 2.5, 2); // Minor units 1000 * 2.5
        expect(result1).toBe(2500); // Should be 2500 minor units

        const result2 = safeMultiply(333, 3, 2); // Minor units 333 * 3
        expect(result2).toBe(999); // Should be 999 minor units (rounded)
      });

      it('should handle different rounding modes', () => {
        const value = 333; // minor units
        const multiplier = 3.333; // Should give 1109.889
        
        const roundUp = safeMultiply(value, multiplier, 2, RoundingMode.ROUND_UP);
        const roundDown = safeMultiply(value, multiplier, 2, RoundingMode.ROUND_DOWN);
        
        expect(roundUp).toBeGreaterThan(roundDown);
      });
    });

    describe('safeDivide', () => {
      it('should divide with rounding for precision', () => {
        const result1 = safeDivide(1000, 3, 2); // Minor units 1000 / 3
        expect(result1).toBe(333); // Should be 333 minor units (rounded)

        const result2 = safeDivide(2000, 6, 2); // Minor units 2000 / 6
        expect(result2).toBe(333); // Should be 333 minor units (rounded)
      });

      it('should throw error for division by zero', () => {
        expect(() => safeDivide(1000, 0, 2)).toThrow('Division by zero');
      });

      it('should handle different rounding modes', () => {
        const value = 1000; // 10.00 in precision 2
        const divisor = 3;
        
        const roundUp = safeDivide(value, divisor, 2, RoundingMode.ROUND_UP);
        const roundDown = safeDivide(value, divisor, 2, RoundingMode.ROUND_DOWN);
        
        expect(roundUp).toBeGreaterThan(roundDown);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const large = 999999999999.99;
      const minorUnits = toMinorUnits(large, 2);
      const roundTrip = fromMinorUnits(minorUnits, 2);
      expect(roundTrip).toBe(large);
    });

    it('should handle very small numbers', () => {
      const small = 0.0001;
      const minorUnits = toMinorUnits(small, 4);
      const roundTrip = fromMinorUnits(minorUnits, 4);
      expect(roundTrip).toBe(small);
    });

    it('should handle zero precision', () => {
      expect(toMinorUnits(123.456, 0)).toBe(123);
      expect(fromMinorUnits(123, 0)).toBe(123);
    });

    it('should handle high precision', () => {
      const value = 12.123456789;
      const precision = 8;
      const minorUnits = toMinorUnits(value, precision);
      const roundTrip = fromMinorUnits(minorUnits, precision);
      expect(roundTrip).toBeCloseTo(value, precision);
    });
  });
}); 
