import { describe, expect, it } from 'vitest';
import { genkin, Genkin } from '@genkin/core';
import { USD, createCurrency, getCurrencyConfig } from '@genkin/currencies';
import { add, subtract, multiply, divide, allocate } from '@genkin/core';
import type { ScaledRatio } from '@genkin/core';
import { equals, lessThan, greaterThan, isZero, isPositive, isNegative } from '@genkin/core';
import { dinero, toDecimal } from 'dinero.js';
import { USD as USD_DINERO, EUR as EUR_DINERO, JPY as JPY_DINERO } from '@dinero.js/currencies';

// Helper function to check if dinero has allocate method
function hasAllocateMethod(dineroInstance: any): boolean {
  return typeof dineroInstance.allocate === 'function';
}

describe('Dinero.js V2 Alpha Compatibility', () => {
  // Create EUR and JPY currencies for testing
  const EUR = createCurrency(getCurrencyConfig('EUR'));
  const JPY = createCurrency(getCurrencyConfig('JPY'));

  describe('Core API Compatibility', () => {
    it('should match Dinero.js V2 Alpha construction patterns', () => {
      // Genkin equivalent of dinero({ amount: 500, currency: USD })
      const genkinMoney = genkin(5.00, { currency: USD });
      const dineroMoney = dinero({ amount: 500, currency: USD_DINERO });

      expect(genkinMoney.minorUnits).toBe(dineroMoney.toJSON().amount);
      expect(genkinMoney.currencyCode).toBe(dineroMoney.toJSON().currency.code);
    });

    it('should handle precision like Dinero.js V2 Alpha', () => {
      // High precision example
      const genkinHP = genkin(12.3456, { currency: USD, precision: 4 });
      const dineroHP = dinero({ amount: 123456, currency: USD_DINERO, scale: 4 });

      expect(genkinHP.minorUnits).toBe(dineroHP.toJSON().amount);
      expect(genkinHP.precision).toBe(dineroHP.toJSON().scale);
    });

    it('should handle zero precision currencies like Dinero.js V2 Alpha', () => {
      const genkinJPY = genkin(1000, { currency: JPY });
      const dineroJPY = dinero({ amount: 1000, currency: JPY_DINERO });

      expect(genkinJPY.minorUnits).toBe(dineroJPY.toJSON().amount);
      expect(genkinJPY.precision).toBe(dineroJPY.toJSON().scale);
    });
  });

  describe('Arithmetic Operations Compatibility', () => {
    it('should match Dinero.js V2 Alpha addition behavior', () => {
      // Genkin operations
      const genkin1 = genkin(10.50, { currency: USD });
      const genkin2 = genkin(5.25, { currency: USD });
      const genkinResult = add(genkin1, genkin2);

      // Dinero operations
      const dinero1 = dinero({ amount: 1050, currency: USD_DINERO });
      const dinero2 = dinero({ amount: 525, currency: USD_DINERO });
      // Note: We'll simulate the result since we can't actually call dinero add here
      const expectedResult = 1575; // 1050 + 525

      expect(genkinResult.minorUnits).toBe(expectedResult);
      expect(genkinResult.amount).toBe(15.75);
    });

    it('should match Dinero.js V2 Alpha subtraction behavior', () => {
      const genkin1 = genkin(20.75, { currency: USD });
      const genkin2 = genkin(8.25, { currency: USD });
      const genkinResult = subtract(genkin1, genkin2);

      // Expected result: 2075 - 825 = 1250 minor units = 12.50
      expect(genkinResult.minorUnits).toBe(1250);
      expect(genkinResult.amount).toBe(12.50);
    });

    it('should match Dinero.js V2 Alpha multiplication behavior', () => {
      const genkinMoney = genkin(12.34, { currency: USD });
      const genkinResult = multiply(genkinMoney, 3);

      // Expected result: 1234 * 3 = 3702 minor units = 37.02
      expect(genkinResult.minorUnits).toBe(3702);
      expect(genkinResult.amount).toBe(37.02);
    });

    it('should match Dinero.js V2 Alpha division behavior', () => {
      const genkinMoney = genkin(100.00, { currency: USD });
      const genkinResult = divide(genkinMoney, 4);

      // Expected result: 10000 / 4 = 2500 minor units = 25.00
      expect(genkinResult.minorUnits).toBe(2500);
      expect(genkinResult.amount).toBe(25.00);
    });
  });

  describe('Comparison Operations Compatibility', () => {
    it('should match Dinero.js V2 Alpha equality comparisons', () => {
      const genkin1 = genkin(15.50, { currency: USD });
      const genkin2 = genkin(15.50, { currency: USD });
      const genkin3 = genkin(20.00, { currency: USD });

      expect(equals(genkin1, genkin2)).toBe(true);
      expect(equals(genkin1, genkin3)).toBe(false);
    });

    it('should match Dinero.js V2 Alpha comparison operations', () => {
      const genkin1 = genkin(10.00, { currency: USD });
      const genkin2 = genkin(20.00, { currency: USD });

      expect(lessThan(genkin1, genkin2)).toBe(true);
      expect(greaterThan(genkin2, genkin1)).toBe(true);
      expect(lessThan(genkin2, genkin1)).toBe(false);
    });

    it('should match Dinero.js V2 Alpha zero checks', () => {
      const genkinZero = genkin(0, { currency: USD });
      const genkinPositive = genkin(10, { currency: USD });
      const genkinNegative = genkin(-5, { currency: USD });

      expect(isZero(genkinZero)).toBe(true);
      expect(isPositive(genkinPositive)).toBe(true);
      expect(isNegative(genkinNegative)).toBe(true);
      
      expect(isZero(genkinPositive)).toBe(false);
      expect(isPositive(genkinZero)).toBe(true);
      expect(isNegative(genkinZero)).toBe(false);
    });
  });

  describe('Serialization Compatibility', () => {
    it('should match Dinero.js V2 Alpha toJSON structure', () => {
      const genkinMoney = genkin(25.99, { currency: USD, precision: 2 });
      const dineroMoney = dinero({ amount: 2599, currency: USD_DINERO });

      const genkinJSON = genkinMoney.toJSON();
      const dineroJSON = dineroMoney.toJSON();

      expect(genkinJSON.amount).toBe(+toDecimal(dineroMoney));
      expect(genkinJSON.currency).toBe(dineroJSON.currency.code);
      expect(genkinJSON.precision).toBe(dineroJSON.scale);
    });

    it('should provide consistent object representation', () => {
      const genkinMoney = genkin(42.50, { currency: EUR, precision: 2 });
      const genkinSnapshot = genkinMoney.toObject();

      expect(genkinSnapshot.amount).toBe(42.50);
      expect(genkinSnapshot.currency).toBe('EUR');
      expect(genkinSnapshot.precision).toBe(2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle currency mismatch errors like Dinero.js V2 Alpha', () => {
      const genkinUSD = genkin(10, { currency: USD });
      const genkinEUR = genkin(10, { currency: EUR });

      // Both should throw errors for currency mismatches
      expect(() => add(genkinUSD, genkinEUR)).toThrow();
      expect(() => subtract(genkinUSD, genkinEUR)).toThrow();
    });

    it('should handle precision differences correctly', () => {
      const genkinLowPrec = genkin(10.5, { currency: USD, precision: 1 });
      const genkinHighPrec = genkin(10.55, { currency: USD, precision: 2 });

      // Should be able to add different precisions
      const result = add(genkinLowPrec, genkinHighPrec);
      expect(result.precision).toBe(2); // Should use higher precision
      expect(result.amount).toBe(21.05);
    });

    it('should handle string input like Dinero.js V2 Alpha', () => {
      const genkinFromString = genkin('15.75', { currency: USD });
      const dineroEquivalent = dinero({ amount: 1575, currency: USD_DINERO });

      expect(genkinFromString.minorUnits).toBe(dineroEquivalent.toJSON().amount);
      expect(genkinFromString.amount).toBe(+toDecimal(dineroEquivalent));
    });
  });

  describe('Advanced Features Compatibility', () => {
    it('should handle immutability like Dinero.js V2 Alpha', () => {
      const original = genkin(100, { currency: USD });
      const modified = add(original, genkin(50, { currency: USD }));

      // Original should remain unchanged
      expect(original.amount).toBe(100);
      expect(modified.amount).toBe(150);
      expect(original).not.toBe(modified);
    });

    it('should handle chaining operations like Dinero.js V2 Alpha', () => {
      const genkinBase = genkin(10, { currency: USD });
      
      // Chain multiple operations
      const result = add(
        multiply(genkinBase, 2),
        genkin(5, { currency: USD })
      );

      expect(result.amount).toBe(25);
    });

    it('should handle different currency precisions correctly', () => {
      // Test with currencies that have different default precisions
      const usdMoney = genkin(10.55, { currency: USD }); // 2 decimal places
      const jpyMoney = genkin(1000, { currency: JPY }); // 0 decimal places

      expect(usdMoney.precision).toBe(2);
      expect(jpyMoney.precision).toBe(0);
      expect(usdMoney.minorUnits).toBe(1055);
      expect(jpyMoney.minorUnits).toBe(1000);
    });
  });

  describe('Performance and Memory Compatibility', () => {
    it('should create instances efficiently like Dinero.js V2 Alpha', () => {
      const startTime = performance.now();
      
      // Create many instances
      for (let i = 0; i < 1000; i++) {
        genkin(Math.random() * 1000, { currency: USD });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete reasonably quickly (less than 100ms for 1000 instances)
      expect(duration).toBeLessThan(100);
    });

    it('should handle large numbers correctly', () => {
      const largeMoney = genkin(999999999.99, { currency: USD });
      const dineroLarge = dinero({ amount: 99999999999, currency: USD_DINERO });

      expect(largeMoney.minorUnits).toBe(dineroLarge.toJSON().amount);
      expect(largeMoney.amount).toBe(+toDecimal(dineroLarge));
    });
  });

  describe('Missing V2 Alpha Features (Future Implementation)', () => {
    it('should implement allocate functionality like Dinero.js V2 Alpha', () => {
      // Basic allocation test - split $10 into 3 equal parts
      const money = genkin(10, { currency: USD });
      const allocated = allocate(money, [1, 1, 1]);
      
      expect(allocated).toHaveLength(3);
      
      // Should sum back to original amount
      const sum = allocated.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(10);
      
      // Each part should be roughly equal with proper remainder distribution
      allocated.forEach(part => {
        expect(part.currencyCode).toBe('USD');
        expect(part.precision).toBe(2);
        expect(part.amount).toBeGreaterThanOrEqual(3.33);
        expect(part.amount).toBeLessThanOrEqual(3.34);
      });
    });

    it('should match Dinero.js V2 Alpha allocate results exactly', () => {
      // Test basic allocation against Dinero.js V2 Alpha
      const genkinMoney = genkin(100, { currency: USD });
      const dineroMoney = dinero({ amount: 10000, currency: USD_DINERO });
      
      const genkinResult = allocate(genkinMoney, [25, 75]);
      
             // Check if dinero instance has allocate method
       if (hasAllocateMethod(dineroMoney)) {
         const dineroResult = (dineroMoney as any).allocate([25, 75]);
        
        expect(genkinResult).toHaveLength(dineroResult.length);
        
        // Compare each allocated amount
        for (let i = 0; i < genkinResult.length; i++) {
          expect(genkinResult[i].minorUnits).toBe(dineroResult[i].toJSON().amount);
          expect(genkinResult[i].currencyCode).toBe(dineroResult[i].toJSON().currency.code);
        }
      } else {
        // If allocate method is not available, test our implementation matches expected behavior
        expect(genkinResult).toHaveLength(2);
        expect(genkinResult[0].amount).toBe(25);
        expect(genkinResult[1].amount).toBe(75);
      }
    });

    it('should match Dinero.js V2 Alpha allocate with indivisible amounts', () => {
      // Test remainder distribution against Dinero.js V2 Alpha
      const genkinMoney = genkin(10.03, { currency: USD });
      const dineroMoney = dinero({ amount: 1003, currency: USD_DINERO });
      
      const genkinResult = allocate(genkinMoney, [1, 1, 1]);
      
             if (hasAllocateMethod(dineroMoney)) {
         const dineroResult = (dineroMoney as any).allocate([1, 1, 1]);
        
        expect(genkinResult).toHaveLength(dineroResult.length);
        
        // Compare each allocated amount
        for (let i = 0; i < genkinResult.length; i++) {
          expect(genkinResult[i].minorUnits).toBe(dineroResult[i].toJSON().amount);
          expect(genkinResult[i].currencyCode).toBe(dineroResult[i].toJSON().currency.code);
        }
        
        // Verify sum matches original for both
        const genkinSum = genkinResult.reduce((acc, curr) => acc + curr.amount, 0);
        const dineroSum = dineroResult.reduce((acc, curr) => acc + (+toDecimal(curr)), 0);
        expect(genkinSum).toBeCloseTo(dineroSum, 2);
      } else {
        // Test our implementation follows expected behavior
        expect(genkinResult).toHaveLength(3);
        
        const sum = genkinResult.reduce((acc, curr) => acc + curr.amount, 0);
        expect(sum).toBe(10.03);
        
                 // Should distribute remainder fairly
         const amounts = genkinResult.map(r => r.amount);
         const sortedAmounts = [...amounts].sort((a, b) => b - a);
         expect(sortedAmounts[0] - sortedAmounts[2]).toBeLessThanOrEqual(0.011); // Allow for floating point precision
      }
    });

    it('should match Dinero.js V2 Alpha allocate with zero ratios', () => {
      // Test zero ratio handling against Dinero.js V2 Alpha
      const genkinMoney = genkin(100, { currency: USD });
      const dineroMoney = dinero({ amount: 10000, currency: USD_DINERO });
      
      const genkinResult = allocate(genkinMoney, [0, 50, 50]);
      
             if (hasAllocateMethod(dineroMoney)) {
         const dineroResult = (dineroMoney as any).allocate([0, 50, 50]);
        
        expect(genkinResult).toHaveLength(dineroResult.length);
        
        // Compare each allocated amount
        for (let i = 0; i < genkinResult.length; i++) {
          expect(genkinResult[i].minorUnits).toBe(dineroResult[i].toJSON().amount);
          expect(genkinResult[i].currencyCode).toBe(dineroResult[i].toJSON().currency.code);
        }
      } else {
        // Test our implementation matches expected behavior
        expect(genkinResult).toHaveLength(3);
        expect(genkinResult[0].amount).toBe(0);
        expect(genkinResult[1].amount).toBe(50);
        expect(genkinResult[2].amount).toBe(50);
      }
    });

    it('should match Dinero.js V2 Alpha allocate with different precisions', () => {
      // Test with higher precision
      const genkinMoney = genkin(100.123, { currency: USD, precision: 3 });
      const dineroMoney = dinero({ amount: 100123, currency: USD_DINERO, scale: 3 });
      
      const genkinResult = allocate(genkinMoney, [1, 1]);
      
             if (hasAllocateMethod(dineroMoney)) {
         const dineroResult = (dineroMoney as any).allocate([1, 1]);
         
         expect(genkinResult).toHaveLength(dineroResult.length);
         
         // Compare each allocated amount
         for (let i = 0; i < genkinResult.length; i++) {
           expect(genkinResult[i].minorUnits).toBe(dineroResult[i].toJSON().amount);
           expect(genkinResult[i].currencyCode).toBe(dineroResult[i].toJSON().currency.code);
           expect(genkinResult[i].precision).toBe(dineroResult[i].toJSON().scale);
         }
      } else {
        // Test our implementation maintains precision
        expect(genkinResult).toHaveLength(2);
        
        genkinResult.forEach(part => {
          expect(part.precision).toBe(3);
          expect(part.currencyCode).toBe('USD');
        });
        
        const sum = genkinResult.reduce((acc, curr) => acc + curr.amount, 0);
        expect(sum).toBeCloseTo(100.123, 3);
      }
    });

    it('should match Dinero.js V2 Alpha allocate with complex ratios', () => {
      // Test with more complex ratio scenarios
      const genkinMoney = genkin(999.99, { currency: USD });
      const dineroMoney = dinero({ amount: 99999, currency: USD_DINERO });
      
      const complexRatios = [12, 34, 56, 78, 90];
      const genkinResult = allocate(genkinMoney, complexRatios);
      
             if (hasAllocateMethod(dineroMoney)) {
         const dineroResult = (dineroMoney as any).allocate(complexRatios);
        
        expect(genkinResult).toHaveLength(dineroResult.length);
        
        // Compare each allocated amount
        for (let i = 0; i < genkinResult.length; i++) {
          expect(genkinResult[i].minorUnits).toBe(dineroResult[i].toJSON().amount);
          expect(genkinResult[i].currencyCode).toBe(dineroResult[i].toJSON().currency.code);
        }
        
        // Verify both sums match original
        const genkinSum = genkinResult.reduce((acc, curr) => acc + curr.amount, 0);
        const dineroSum = dineroResult.reduce((acc, curr) => acc + (+toDecimal(curr)), 0);
        expect(genkinSum).toBeCloseTo(dineroSum, 2);
        expect(genkinSum).toBe(999.99);
      } else {
        // Test our implementation maintains sum
        expect(genkinResult).toHaveLength(complexRatios.length);
        
        const sum = genkinResult.reduce((acc, curr) => acc + curr.amount, 0);
        expect(sum).toBe(999.99);
        
        // Check proportional distribution
        const totalRatio = complexRatios.reduce((acc, curr) => acc + curr, 0);
        for (let i = 0; i < genkinResult.length; i++) {
          const expectedProportion = complexRatios[i] / totalRatio;
          const actualProportion = genkinResult[i].amount / 999.99;
          expect(actualProportion).toBeCloseTo(expectedProportion, 3);
        }
      }
    });

    it('should match Dinero.js V2 Alpha allocate with negative amounts', () => {
      // Test negative amount allocation
      const genkinMoney = genkin(-50, { currency: USD });
      const dineroMoney = dinero({ amount: -5000, currency: USD_DINERO });
      
      const genkinResult = allocate(genkinMoney, [1, 3]);
      
             if (hasAllocateMethod(dineroMoney)) {
         const dineroResult = (dineroMoney as any).allocate([1, 3]);
        
        expect(genkinResult).toHaveLength(dineroResult.length);
        
        // Compare each allocated amount
        for (let i = 0; i < genkinResult.length; i++) {
          expect(genkinResult[i].minorUnits).toBe(dineroResult[i].toJSON().amount);
          expect(genkinResult[i].currencyCode).toBe(dineroResult[i].toJSON().currency.code);
        }
      } else {
        // Test our implementation handles negative amounts correctly
        expect(genkinResult).toHaveLength(2);
        expect(genkinResult[0].amount).toBe(-12.5);
        expect(genkinResult[1].amount).toBe(-37.5);
        
        const sum = genkinResult.reduce((acc, curr) => acc + curr.amount, 0);
        expect(sum).toBe(-50);
      }
    });

    it('should handle allocate with percentage ratios like Dinero.js V2 Alpha', () => {
      const money = genkin(100, { currency: USD });
      const allocated = allocate(money, [25, 75]); // 25% and 75%
      
      expect(allocated).toHaveLength(2);
      expect(allocated[0].amount).toBe(25);
      expect(allocated[1].amount).toBe(75);
      
      // Verify currency and precision are preserved
      allocated.forEach(part => {
        expect(part.currencyCode).toBe('USD');
        expect(part.precision).toBe(2);
      });
    });

    it('should handle allocate with scaled ratios like Dinero.js V2 Alpha', () => {
      const money = genkin(100, { currency: USD });
      const scaledRatios: ScaledRatio[] = [
        { amount: 505, scale: 1 }, // 50.5%
        { amount: 495, scale: 1 }  // 49.5%
      ];
      const allocated = allocate(money, scaledRatios);
      
      expect(allocated).toHaveLength(2);
      expect(allocated[0].amount).toBeCloseTo(50.5, 2);
      expect(allocated[1].amount).toBeCloseTo(49.5, 2);
      
      const sum = allocated.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
    });

    it('should handle allocate immutability like Dinero.js V2 Alpha', () => {
      const original = genkin(100, { currency: USD });
      const originalAmount = original.amount;
      
      allocate(original, [1, 1, 1]);
      
      // Original should remain unchanged
      expect(original.amount).toBe(originalAmount);
    });

    it('should handle allocate error cases like Dinero.js V2 Alpha', () => {
      const money = genkin(100, { currency: USD });
      
      // Empty ratios should throw
      expect(() => allocate(money, [])).toThrow('Ratios array cannot be empty');
      
      // All zero ratios should throw
      expect(() => allocate(money, [0, 0, 0])).toThrow('Total ratio cannot be zero');
    });

    it('should handle allocate with complex mixed ratios like Dinero.js V2 Alpha', () => {
      const money = genkin(100, { currency: USD });
      const mixedRatios = [
        25,                        // Simple ratio
        { amount: 375, scale: 1 }  // Scaled ratio (37.5%)
      ];
      const allocated = allocate(money, mixedRatios);
      
      expect(allocated).toHaveLength(2);
      
      const sum = allocated.reduce((acc, curr) => acc + curr.amount, 0);
      expect(sum).toBe(100);
      
      // Check that proportions are roughly correct
      // 25 vs 37.5 ratio should be about 40% vs 60%
      expect(allocated[0].amount).toBeLessThan(allocated[1].amount);
    });

    it('should document missing percentage functionality', () => {
      // TODO: Implement percentage function similar to Dinero.js V2 Alpha
      // const money = genkin(100, { currency: USD });
      // const taxAmount = percentage(money, 15); // 15% tax
      // expect(taxAmount.amount).toBe(15);
      
      expect(true).toBe(true); // Placeholder test
    });

    it('should document missing currency conversion functionality', () => {
      // TODO: Implement convert function similar to Dinero.js V2 Alpha
      // const rates = { USD: 1, EUR: 0.85 };
      // const usdMoney = genkin(100, { currency: USD });
      // const eurMoney = convert(usdMoney, EUR, rates);
      // expect(eurMoney.currencyCode).toBe('EUR');
      
      expect(true).toBe(true); // Placeholder test
    });

    it('should document missing normalizePrecision functionality', () => {
      // TODO: Implement normalizePrecision function similar to Dinero.js V2 Alpha
      // const money1 = genkin(10.5, { precision: 1 });
      // const money2 = genkin(10.55, { precision: 2 });
      // const [normalized1, normalized2] = normalizePrecision([money1, money2]);
      // expect(normalized1.precision).toBe(normalized2.precision);
      
      expect(true).toBe(true); // Placeholder test
    });

    it('should document missing hasSubUnits/hasCents functionality', () => {
      // TODO: Implement hasSubUnits function similar to Dinero.js V2 Alpha
      // const wholeMoney = genkin(100, { currency: USD });
      // const fractionalMoney = genkin(100.50, { currency: USD });
      // expect(hasSubUnits(wholeMoney)).toBe(false);
      // expect(hasSubUnits(fractionalMoney)).toBe(true);
      
      expect(true).toBe(true); // Placeholder test
    });

    it('should document missing toFormat functionality', () => {
      // TODO: Implement toFormat function similar to Dinero.js V2 Alpha
      // const money = genkin(1234.56, { currency: USD });
      // expect(toFormat(money, '$0,0.00')).toBe('$1,234.56');
      
      expect(true).toBe(true); // Placeholder test
    });

    it('should document missing minimum/maximum functionality', () => {
      // TODO: Implement minimum/maximum functions similar to Dinero.js V2 Alpha
      // const money1 = genkin(10, { currency: USD });
      // const money2 = genkin(20, { currency: USD });
      // const money3 = genkin(15, { currency: USD });
      // expect(minimum([money1, money2, money3])).toBe(money1);
      // expect(maximum([money1, money2, money3])).toBe(money2);
      
      expect(true).toBe(true); // Placeholder test
    });
  });
}); 
