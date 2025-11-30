import { describe, expect, it } from 'vitest';
import Dinero from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Utility Methods', () => {
  it('should check hasCents correctly', () => {
    const wholeMoney = Dinero({ amount: 10000, currency: 'USD', precision: 2 }); // $100.00
    const fractionalMoney = Dinero({ amount: 10050, currency: 'USD', precision: 2 }); // $100.50

    expect(wholeMoney.hasCents()).toBe(false);
    expect(fractionalMoney.hasCents()).toBe(true);
  });

  it('should handle hasCents with zero precision', () => {
    const jpyMoney = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });

    expect(jpyMoney.hasCents()).toBe(false);
  });

  it('should handle hasCents with high precision', () => {
    const highPrecMoney = Dinero({ amount: 123456, currency: 'BTC', precision: 8 }); // 0.00123456 BTC

    expect(highPrecMoney.hasCents()).toBe(true);
  });

  it('should check hasSubUnits correctly', () => {
    const wholeMoney = Dinero({ amount: 10000, currency: 'USD', precision: 2 }); // $100.00
    const fractionalMoney = Dinero({ amount: 10050, currency: 'USD', precision: 2 }); // $100.50

    expect(wholeMoney.hasSubUnits()).toBe(false);
    expect(fractionalMoney.hasSubUnits()).toBe(true);
  });

  it('should handle hasSubUnits with zero precision', () => {
    const jpyMoney = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });

    expect(jpyMoney.hasSubUnits()).toBe(false);
  });

  it('should handle hasSubUnits with high precision', () => {
    const highPrecMoney = Dinero({ amount: 123456, currency: 'BTC', precision: 8 }); // 0.00123456 BTC

    expect(highPrecMoney.hasSubUnits()).toBe(true);
  });
});

describe('Static Utility Functions', () => {
  it('should normalize precision across instances', () => {
    const money1 = Dinero({ amount: 105, currency: 'USD', precision: 1 }); // 10.5
    const money2 = Dinero({ amount: 1055, currency: 'USD', precision: 2 }); // 10.55
    const money3 = Dinero({ amount: 105500, currency: 'USD', precision: 3 }); // 105.500

    const normalized = Dinero.normalizePrecision([money1, money2, money3]);

    expect(normalized).toHaveLength(3);
    normalized.forEach(money => {
      expect(money.getPrecision()).toBe(3);
    });

    expect(normalized[0].getAmount()).toBe(10500); // 10.5 -> 10.500 (scale factor 100)
    expect(normalized[1].getAmount()).toBe(10550); // 10.55 -> 10.550 (scale factor 10)
    expect(normalized[2].getAmount()).toBe(105500); // 105.500 unchanged
  });

  it('should find minimum value', () => {
    const money1 = Dinero({ amount: 1000 });
    const money2 = Dinero({ amount: 2000 });
    const money3 = Dinero({ amount: 1500 });

    const min = Dinero.minimum([money1, money2, money3]);

    expect(min.getAmount()).toBe(1000);
  });

  it('should find maximum value', () => {
    const money1 = Dinero({ amount: 1000 });
    const money2 = Dinero({ amount: 2000 });
    const money3 = Dinero({ amount: 1500 });

    const max = Dinero.maximum([money1, money2, money3]);

    expect(max.getAmount()).toBe(2000);
  });

  it('should throw on empty arrays for min/max', () => {
    expect(() => Dinero.minimum([])).toThrow('Cannot find minimum of empty array');
    expect(() => Dinero.maximum([])).toThrow('Cannot find maximum of empty array');
  });
});
