import { describe, expect, it } from 'vitest';
import Dinero from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Locale Methods', () => {
  it('should set and get locale', () => {
    const money = Dinero({ amount: 2500 });
    const moneyOg = DineroOg({ amount: 2500 });

    expect(money.getLocale()).toBe(moneyOg.getLocale()); // Default locale should match

    const frenchMoney = money.setLocale('fr-FR');
    const frenchMoneyOg = moneyOg.setLocale('fr-FR');

    expect(frenchMoney.getLocale()).toBe(frenchMoneyOg.getLocale());

    // Original should remain unchanged (immutability)
    expect(money.getLocale()).toBe(moneyOg.getLocale());
    expect(money.getLocale()).not.toBe(frenchMoney.getLocale());
    expect(moneyOg.getLocale()).not.toBe(frenchMoneyOg.getLocale());
  });

  it('should maintain locale through operations', () => {
    const money1 = Dinero({ amount: 1000 }).setLocale('de-DE');
    const money2 = Dinero({ amount: 500 });
    const money1Og = DineroOg({ amount: 1000 }).setLocale('de-DE');
    const money2Og = DineroOg({ amount: 500 });

    const result = money1.add(money2);
    const resultOg = money1Og.add(money2Og);

    expect(result.getLocale()).toBe(resultOg.getLocale());
  });

  it('should handle various locale formats', () => {
    const locales = ['en-US', 'fr-FR', 'de-DE', 'ja-JP', 'es-ES'];

    locales.forEach(locale => {
      const money = Dinero({ amount: 1000 }).setLocale(locale);
      const moneyOg = DineroOg({ amount: 1000 }).setLocale(locale);

      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });
  });
});
