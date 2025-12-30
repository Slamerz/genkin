import { describe, expect, it } from 'vitest';
import  Dinero  from '@genkin/dinero';
import DineroOg from 'dinero-og-v1';

describe('Allocation (Instance Method)', () => {
  it('should allocate money equally', () => {
    const money = Dinero({ amount: 1000 });
    const moneyOg = DineroOg({ amount: 1000 });
    const result = money.allocate([1, 1, 1]);
    const resultOg: DineroOg[] = moneyOg.allocate([1, 1, 1]);
    expect(result.length).toBe(resultOg.length);
    result.forEach((part, index) => {
      expect(part.getAmount()).toBe(resultOg[index].getAmount());
    });
    const sum = result.reduce((acc, curr) => acc + curr.getAmount(), 0);
    const sumOg = resultOg.reduce((acc, curr) => acc + curr.getAmount(), 0);
    expect(sum).toBe(sumOg);
  });

  it('should allocate money proportionally', () => {
    const money = Dinero({ amount: 10000 });
    const moneyOg = DineroOg({ amount: 10000 });
    const result = money.allocate([25, 75]);
    const resultOg: DineroOg[] = moneyOg.allocate([25, 75]);
    expect(result.length).toBe(resultOg.length);
    result.forEach((part, index) => {
      expect(part.getAmount()).toBe(resultOg[index].getAmount());
    });
    const sum = result.reduce((acc, curr) => acc + curr.getAmount(), 0);
    const sumOg = resultOg.reduce((acc, curr) => acc + curr.getAmount(), 0);
    expect(sum).toBe(sumOg);
  });

  it('should handle indivisible amounts correctly', () => {
    const money = Dinero({ amount: 1003 });
    const moneyOg = DineroOg({ amount: 1003 });
    const result = money.allocate([1, 1, 1]);
    const resultOg: DineroOg[] = moneyOg.allocate([1, 1, 1]);
    expect(result.length).toBe(resultOg.length);
    result.forEach((part, index) => {
      expect(part.getAmount()).toBe(resultOg[index].getAmount());
    });
    const sum = result.reduce((acc, curr) => acc + curr.getAmount(), 0);
    const sumOg = resultOg.reduce((acc, curr) => acc + curr.getAmount(), 0);
    expect(sum).toBe(sumOg);
  });
});
