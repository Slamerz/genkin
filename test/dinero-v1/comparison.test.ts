import { describe, expect, it } from 'vitest';
import { Dinero } from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Comparison Operations (Instance Methods)', () => {
  describe('Equality', () => {
    it('should compare equality correctly', () => {
      const money1 = Dinero({ amount: 1550 });
      const money2 = Dinero({ amount: 1550 });
      const money3 = Dinero({ amount: 2000 });
      const moneyOg1 = DineroOg({ amount: 1550 });
      const moneyOg2 = DineroOg({ amount: 1550 });
      const moneyOg3 = DineroOg({ amount: 2000 });


      expect(money1.equalsTo(money2)).toBe(moneyOg1.equalsTo(moneyOg2));
      expect(money1.equalsTo(money3)).toBe(moneyOg1.equalsTo(moneyOg3));
    });

    it('should be false if the currencies are different', () => {
      const money1 = Dinero({ amount: 1550, currency: 'USD' });
      const money2 = Dinero({ amount: 1550, currency: 'EUR' });
      const moneyOg1 = DineroOg({ amount: 1550, currency: 'USD' });
      const moneyOg2 = DineroOg({ amount: 1550, currency: 'EUR' });

      expect(money1.equalsTo(money2)).toBe(moneyOg1.equalsTo(moneyOg2));
    });

    it('should compare different precisions correctly', () => {
      const money1 = Dinero({ amount: 1550, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 15500, currency: 'USD', precision: 3 });
      const money3 = Dinero({ amount: 1550, currency: 'USD', precision: 3 });
      const moneyOg1 = DineroOg({ amount: 1550, currency: 'USD', precision: 2 });
      const moneyOg2 = DineroOg({ amount: 15500, currency: 'USD', precision: 3 });
      const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });


      expect(money1.equalsTo(money2)).toBe(moneyOg1.equalsTo(moneyOg2));
      expect(money1.equalsTo(money3)).toBe(moneyOg1.equalsTo(moneyOg3));
    });
  })

  describe('Less Than', () => {
    it('should compare less than correctly', () => {
      const money1 = Dinero({ amount: 1000 });
      const money2 = Dinero({ amount: 2000 });
      const moneyOg1 = DineroOg({ amount: 1000 });
      const moneyOg2 = DineroOg({ amount: 2000 });

      expect(money1.lessThan(money2)).toBe(moneyOg1.lessThan(moneyOg2));
      expect(money2.lessThan(money1)).toBe(moneyOg2.lessThan(moneyOg1));
    });

    it('should be throw error if the currencies are different', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD' });
      const money2 = Dinero({ amount: 2000, currency: 'EUR' });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });

      expect(() => money1.lessThan(money2)).toThrow();
      expect(() => moneyOg1.lessThan(moneyOg2)).toThrow();
    });

    it('should compare different precisions correctly', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
      const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
      const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

      expect(money1.lessThan(money2)).toBe(false);
      expect(moneyOg1.lessThan(moneyOg2)).toBe(false);
      expect(money2.lessThan(money1)).toBe(true);
      expect(moneyOg2.lessThan(moneyOg1)).toBe(true);
      expect(money1.lessThan(money3)).toBe(false);
      expect(moneyOg1.lessThan(moneyOg3)).toBe(false);
    });
  })


  describe('Less Than Or Equal', () => {
    it('should compare less than or equal correctly', () => {
      const money1 = Dinero({ amount: 1000 });
      const money2 = Dinero({ amount: 2000 });
      const moneyOg1 = DineroOg({ amount: 1000 });
      const moneyOg2 = DineroOg({ amount: 2000 });

      expect(money1.lessThanOrEqual(money2)).toBe(true);
      expect(money2.lessThanOrEqual(money1)).toBe(false);
      expect(moneyOg1.lessThanOrEqual(moneyOg2)).toBe(true);
      expect(moneyOg2.lessThanOrEqual(moneyOg1)).toBe(false);
    });

    it('should be throw error if the currencies are different', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD' });
      const money2 = Dinero({ amount: 2000, currency: 'EUR' });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });

      expect(() => money1.lessThanOrEqual(money2)).toThrow();
      expect(() => moneyOg1.lessThanOrEqual(moneyOg2)).toThrow();
    });

    it('should compare different precisions correctly', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
      const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
      const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

      expect(money1.lessThanOrEqual(money2)).toBe(false);
      expect(moneyOg1.lessThanOrEqual(moneyOg2)).toBe(false);
      expect(money2.lessThanOrEqual(money1)).toBe(true);
      expect(moneyOg2.lessThanOrEqual(moneyOg1)).toBe(true);
      expect(money1.lessThanOrEqual(money3)).toBe(false);
      expect(moneyOg1.lessThanOrEqual(moneyOg3)).toBe(false);
    });


  })


  describe('Greater Than', () => {
    it('should compare greater than correctly', () => {
      const money1 = Dinero({ amount: 1000 });
      const money2 = Dinero({ amount: 2000 });
      const moneyOg1 = DineroOg({ amount: 1000 });
      const moneyOg2 = DineroOg({ amount: 2000 });

      expect(money2.greaterThan(money1)).toBe(moneyOg2.greaterThan(moneyOg1));
      expect(money2.greaterThan(money1)).toBe(true);
      expect(money1.greaterThan(money2)).toBe(moneyOg1.greaterThan(moneyOg2));
      expect(money1.greaterThan(money2)).toBe(false);
    });

    it('should be throw error if the currencies are different', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD' });
      const money2 = Dinero({ amount: 2000, currency: 'EUR' });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });

      expect(() => money1.greaterThan(money2)).toThrow();
      expect(() => moneyOg1.greaterThan(moneyOg2)).toThrow();
    });

    it('should compare different precisions correctly', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
      const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
      const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

      expect(money1.greaterThan(money2)).toBe(moneyOg1.greaterThan(moneyOg2));
      expect(money1.greaterThan(money3)).toBe(moneyOg1.greaterThan(moneyOg3));
      expect(money2.greaterThan(money1)).toBe(moneyOg2.greaterThan(moneyOg1));
      expect(money2.greaterThan(money3)).toBe(moneyOg2.greaterThan(moneyOg3));
      expect(money3.greaterThan(money1)).toBe(moneyOg3.greaterThan(moneyOg1));
      expect(money3.greaterThan(money2)).toBe(moneyOg3.greaterThan(moneyOg2));
    });
  })

  describe('Greater Than Or Equal', () => {
    it('should compare greater than or equal correctly', () => {
      const money1 = Dinero({ amount: 1000 });
      const money2 = Dinero({ amount: 2000 });
      const moneyOg1 = DineroOg({ amount: 1000 });
      const moneyOg2 = DineroOg({ amount: 2000 });

      expect(money2.greaterThanOrEqual(money1)).toBe(moneyOg2.greaterThanOrEqual(moneyOg1));
      expect(money2.greaterThanOrEqual(money1)).toBe(true);
      expect(money1.greaterThanOrEqual(money2)).toBe(moneyOg1.greaterThanOrEqual(moneyOg2));
      expect(money1.greaterThanOrEqual(money2)).toBe(false);
    });

    it('should be throw error if the currencies are different', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD' });
      const money2 = Dinero({ amount: 2000, currency: 'EUR' });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });

      expect(() => money1.greaterThanOrEqual(money2)).toThrow();
      expect(() => moneyOg1.greaterThanOrEqual(moneyOg2)).toThrow();
    });

    it('should compare different precisions correctly', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
      const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
      const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

      expect(money2.greaterThanOrEqual(money1)).toBe(moneyOg2.greaterThanOrEqual(moneyOg1));
      expect(money2.greaterThanOrEqual(money1)).toBe(false);
      expect(money1.greaterThanOrEqual(money2)).toBe(moneyOg1.greaterThanOrEqual(moneyOg2));
      expect(money1.greaterThanOrEqual(money2)).toBe(true);
      expect(money1.greaterThanOrEqual(money3)).toBe(moneyOg1.greaterThanOrEqual(moneyOg3));
      expect(money1.greaterThanOrEqual(money3)).toBe(true);
      expect(money2.greaterThanOrEqual(money3)).toBe(moneyOg2.greaterThanOrEqual(moneyOg3));
      expect(money2.greaterThanOrEqual(money3)).toBe(true);
    });

    it('should compare different precisions correctly', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
      const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
      const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
      const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

      expect(money2.greaterThanOrEqual(money1)).toBe(moneyOg2.greaterThanOrEqual(moneyOg1));
      expect(money1.greaterThanOrEqual(money2)).toBe(moneyOg1.greaterThanOrEqual(moneyOg2));
      expect(money1.greaterThanOrEqual(money3)).toBe(moneyOg1.greaterThanOrEqual(moneyOg3));
      expect(money2.greaterThanOrEqual(money3)).toBe(moneyOg2.greaterThanOrEqual(moneyOg3));
    });
  })


  it('should check zero values correctly', () => {
    const zeroMoney = Dinero({ amount: 0 });
    const positiveMoney = Dinero({ amount: 1000 });
    const negativeMoney = Dinero({ amount: -500 });

    expect(zeroMoney.isZero()).toBe(true);
    expect(positiveMoney.isPositive()).toBe(true);
    expect(negativeMoney.isNegative()).toBe(true);

    expect(positiveMoney.isZero()).toBe(false);
    expect(zeroMoney.isPositive()).toBe(false);
    expect(zeroMoney.isNegative()).toBe(false);
  });

  describe('hasSameCurrency', () => {
    it('should check currency equality correctly', () => {
      const usdMoney1 = Dinero({ amount: 1000, currency: 'USD' });
      const usdMoney2 = Dinero({ amount: 2000, currency: 'USD' });
      const eurMoney = Dinero({ amount: 1000, currency: 'EUR' });
      const usdMoney1Og = DineroOg({ amount: 1000, currency: 'USD' });
      const usdMoney2Og = DineroOg({ amount: 2000, currency: 'USD' });
      const eurMoneyOg = DineroOg({ amount: 1000, currency: 'EUR' });

      expect(usdMoney1.hasSameCurrency(usdMoney2)).toBe(usdMoney1Og.hasSameCurrency(usdMoney2Og));
      expect(usdMoney1.hasSameCurrency(eurMoney)).toBe(usdMoney1Og.hasSameCurrency(eurMoneyOg));
    });

    it('should handle different precision with same currency', () => {
      const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const money2 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
      const money1Og = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
      const money2Og = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

      expect(money1.hasSameCurrency(money2)).toBe(money1Og.hasSameCurrency(money2Og));
    });
  });

  describe('hasSameAmount', () => {
    it('should check amount equality correctly', () => {
      const money1 = Dinero({ amount: 1550 });
      const money2 = Dinero({ amount: 1550 });
      const money3 = Dinero({ amount: 2000 });
      const money1Og = DineroOg({ amount: 1550 });
      const money2Og = DineroOg({ amount: 1550 });
      const money3Og = DineroOg({ amount: 2000 });

      expect(money1.hasSameAmount(money2)).toBe(money1Og.hasSameAmount(money2Og));
      expect(money1.hasSameAmount(money3)).toBe(money1Og.hasSameAmount(money3Og));
    });

    it('should normalize precision when comparing amounts', () => {
      const money1 = Dinero({ amount: 1550, currency: 'USD', precision: 2 }); // 15.50
      const money2 = Dinero({ amount: 15500, currency: 'USD', precision: 3 }); // 15.500
      const money3 = Dinero({ amount: 1550, currency: 'USD', precision: 3 }); // 1.550
      const money1Og = DineroOg({ amount: 1550, currency: 'USD', precision: 2 });
      const money2Og = DineroOg({ amount: 15500, currency: 'USD', precision: 3 });
      const money3Og = DineroOg({ amount: 1550, currency: 'USD', precision: 3 });

      expect(money1.hasSameAmount(money2)).toBe(money1Og.hasSameAmount(money2Og));
      expect(money1.hasSameAmount(money3)).toBe(money1Og.hasSameAmount(money3Og));
    });

    it('should return false for different currencies', () => {
      const usdMoney = Dinero({ amount: 1550, currency: 'USD' });
      const eurMoney = Dinero({ amount: 1550, currency: 'EUR' });
      const usdMoneyOg = DineroOg({ amount: 1550, currency: 'USD' });
      const eurMoneyOg = DineroOg({ amount: 1550, currency: 'EUR' });

      // Note: Original Dinero.js returns true when comparing different currencies with same amount!
      expect(usdMoney.hasSameAmount(eurMoney)).toBe(usdMoneyOg.hasSameAmount(eurMoneyOg));
      expect(usdMoneyOg.hasSameAmount(eurMoneyOg)).toBe(true); // Original behavior
    });
  });
});
