import { describe, expect, it } from 'vitest';
import  Dinero  from '../../src/dinero-v1/index.js';
import type {  DineroV1Currency } from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Core API', () => {
    it('should create dinero instances with default options', () => {
      const money = Dinero();
      const moneyOg = DineroOg();

      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with amount', () => {
      const money = Dinero({ amount: 500 });
      const moneyOg = DineroOg({ amount: 500 });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with currency string', () => {
      const money = Dinero({ amount: 1000, currency: 'EUR' });
      const moneyOg = DineroOg({ amount: 1000, currency: 'EUR' });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with currency object', () => {
      const eurCurrency: DineroV1Currency = { code: 'EUR', precision: 2 };
      const money = Dinero({ amount: 1000, currency: eurCurrency });
      const moneyOg = DineroOg({ amount: 1000, currency: 'EUR' });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with custom precision', () => {
      const money = Dinero({ amount: 12345, currency: 'USD', precision: 3 });

      const moneyOg = DineroOg({ amount: 12345, currency: 'USD', precision: 3 });
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should handle zero precision currencies', () => {
      const money = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'JPY', precision: 0 });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });
  });
