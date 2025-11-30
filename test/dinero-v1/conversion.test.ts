import { describe, expect, it } from 'vitest';
import  Dinero  from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Conversion Methods', () => {
  it('should convert to object', () => {
    const money = Dinero({ amount: 2599, currency: 'USD', precision: 2 });
    const moneyOg = DineroOg({ amount: 2599, currency: 'USD', precision: 2 });
    const obj = money.toObject();
    const objOg = moneyOg.toObject();
    expect(obj).toEqual(objOg);
  });

  it('should convert to JSON', () => {
    const money = Dinero({ amount: 2599, currency: 'EUR', precision: 2 });
    const moneyOg = DineroOg({ amount: 2599, currency: 'EUR', precision: 2 });
    const json = money.toJSON();
    const jsonOg = moneyOg.toJSON();
    expect(json).toEqual(jsonOg);
  });

  it('should convert to number (major units)', () => {
    const money = Dinero({ amount: 2599, currency: 'USD', precision: 2 });
    const num = money.toNumber();

    expect(num).toBe(25.99);
  });
});
