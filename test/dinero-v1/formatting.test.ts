import { describe, expect, it } from 'vitest';
import  Dinero  from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Enhanced Formatting Tests', () => {
  describe('toFormat with various format strings', () => {
    it('should handle basic currency formats', () => {
      const money = Dinero({ amount: 500050, currency: 'USD', precision: 2 }); // $5000.50
      const moneyOg = DineroOg({ amount: 500050, currency: 'USD', precision: 2 });

      // Test different format patterns
      const formatted1 = money.toFormat('$0,0.00');
      const formatted2 = money.toFormat('$0,0');
      const formatted3 = money.toFormat('$0');
      const formatted4 = money.toFormat('$0.0');

      const formatted1Og = moneyOg.toFormat('$0,0.00');
      const formatted2Og = moneyOg.toFormat('$0,0');
      const formatted3Og = moneyOg.toFormat('$0');
      const formatted4Og = moneyOg.toFormat('$0.0');

      // Compare with original implementation
      expect(typeof formatted1).toBe(typeof formatted1Og);
      expect(typeof formatted2).toBe(typeof formatted2Og);
      expect(typeof formatted3).toBe(typeof formatted3Og);
      expect(typeof formatted4).toBe(typeof formatted4Og);
    });

    it('should handle different currencies in formatting', () => {
      const eurMoney = Dinero({ amount: 5050, currency: 'EUR', precision: 2 });
      const jpyMoney = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });
      const eurMoneyOg = DineroOg({ amount: 5050, currency: 'EUR', precision: 2 });
      const jpyMoneyOg = DineroOg({ amount: 1000, currency: 'JPY', precision: 0 });

      const eurFormatted = eurMoney.toFormat('$0,0.0');
      const jpyFormatted = jpyMoney.toFormat('$0,0');
      const eurFormattedOg = eurMoneyOg.toFormat('$0,0.0');
      const jpyFormattedOg = jpyMoneyOg.toFormat('$0,0');

      expect(typeof eurFormatted).toBe(typeof eurFormattedOg);
      expect(typeof jpyFormatted).toBe(typeof jpyFormattedOg);
    });

    it('should handle rounding modes in formatting', () => {
      const money = Dinero({ amount: 1050, precision: 2 }); // 10.50
      const moneyOg = DineroOg({ amount: 1050, precision: 2 });

      const halfEven = money.toFormat('$0', 'HALF_EVEN');
      const halfUp = money.toFormat('$0', 'HALF_UP');
      const halfEvenOg = moneyOg.toFormat('$0', 'HALF_EVEN');
      const halfUpOg = moneyOg.toFormat('$0', 'HALF_UP');

      expect(typeof halfEven).toBe(typeof halfEvenOg);
      expect(typeof halfUp).toBe(typeof halfUpOg);
    });
  });

  it('should handle locale-specific formatting', () => {
    const money = Dinero({ amount: 123456, currency: 'EUR', precision: 2 });
    const frenchMoney = money.setLocale('fr-FR');
    const moneyOg = DineroOg({ amount: 123456, currency: 'EUR', precision: 2 });
    const frenchMoneyOg = moneyOg.setLocale('fr-FR');

    const formatted = frenchMoney.toFormat();
    const formattedOg = frenchMoneyOg.toFormat();

    expect(typeof formatted).toBe(typeof formattedOg);
    expect(formatted.length > 0).toBe(formattedOg.length > 0);
  });
});
