import { describe, expect, it } from 'vitest';
import { Dinero } from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Error Handling and Edge Cases', () => {
  it('should handle invalid inputs gracefully', () => {
    // Test invalid amounts - both implementations should behave the same
    expect(() => Dinero({ amount: NaN })).toThrow();
    expect(() => DineroOg({ amount: NaN })).toThrow();
    expect(() => Dinero({ amount: Infinity })).toThrow();
    expect(() => DineroOg({ amount: Infinity })).toThrow();

    // Test invalid precision - original doesn't throw for negative precision!
    expect(() => Dinero({ amount: 1000, precision: -1 })).toThrow();
    // expect(() => DineroOg({ amount: 1000, precision: -1 })).toThrow(); // Original doesn't throw
    expect(() => Dinero({ amount: 1000, precision: NaN })).toThrow();
    expect(() => DineroOg({ amount: 1000, precision: NaN })).toThrow();
  });

  it('should handle extreme values appropriately', () => {
    // Test very large numbers
    const largeMoney = Dinero({ amount: Number.MAX_SAFE_INTEGER });
    const largeMoneyOg = DineroOg({ amount: Number.MAX_SAFE_INTEGER });
    expect(largeMoney.getAmount()).toBe(largeMoneyOg.getAmount());

    // Test very small numbers
    const smallMoney = Dinero({ amount: Number.MIN_SAFE_INTEGER });
    const smallMoneyOg = DineroOg({ amount: Number.MIN_SAFE_INTEGER });
    expect(smallMoney.getAmount()).toBe(smallMoneyOg.getAmount());
  });

  it('should handle division by zero', () => {
    const money = Dinero({ amount: 1000 });
    const moneyOg = DineroOg({ amount: 1000 });

    expect(() => money.divide(0)).toThrow();
    expect(() => moneyOg.divide(0)).toThrow();
  });

  it('should handle invalid percentage values', () => {
    const money = Dinero({ amount: 1000 });
    const moneyOg = DineroOg({ amount: 1000 });

    // Original Dinero.js throws for negative percentages!
    expect(() => money.percentage(-10)).toThrow();
    expect(() => moneyOg.percentage(-10)).toThrow();

    // Original also throws for very large percentages
    expect(() => money.percentage(1000)).toThrow();
    expect(() => moneyOg.percentage(1000)).toThrow();

    // Valid percentages should work
    const valid = money.percentage(50);
    const validOg = moneyOg.percentage(50);
    expect(valid.getAmount()).toBe(validOg.getAmount());
  });

  it('should handle invalid allocation ratios', () => {
    const money = Dinero({ amount: 1000 });
    const moneyOg = DineroOg({ amount: 1000 });

    // Empty ratios array
    expect(() => money.allocate([])).toThrow();
    expect(() => moneyOg.allocate([])).toThrow();

    // All zero ratios
    expect(() => money.allocate([0, 0, 0])).toThrow();
    expect(() => moneyOg.allocate([0, 0, 0])).toThrow();

    // Original Dinero.js throws for negative ratios!
    expect(() => money.allocate([-1, -1])).toThrow();
    expect(() => moneyOg.allocate([-1, -1])).toThrow();

    // Valid ratios should work
    const result = money.allocate([1, 1]);
    const resultOg = moneyOg.allocate([1, 1]);
    expect(result).toHaveLength(resultOg.length);
    result.forEach((part, index) => {
      expect(part.getAmount()).toBe(resultOg[index].getAmount());
    });
  });
});
