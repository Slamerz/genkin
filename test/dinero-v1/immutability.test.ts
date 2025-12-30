import { describe, expect, it } from 'vitest';
import Dinero from '@genkin/dinero';
import DineroOg from 'dinero-og-v1';

describe('Edge Cases and Immutability', () => {
  it('should maintain immutability', () => {
    const original = Dinero({ amount: 10000 });
    const originalOg = DineroOg({ amount: 10000 });
    const originalAmount = original.getAmount();
    const originalAmountOg = originalOg.getAmount();

    const modified = original.add(Dinero({ amount: 5000 }));
    const modifiedOg = originalOg.add(DineroOg({ amount: 5000 }));

    expect(original.getAmount()).toBe(originalAmount);
    expect(originalOg.getAmount()).toBe(originalAmountOg);
    expect(modified.getAmount()).toBe(modifiedOg.getAmount());
  });

  it('should handle chained operations', () => {
    const base = Dinero({ amount: 1000 });
    const baseOg = DineroOg({ amount: 1000 });
    const result = base
      .multiply(2)
      .add(Dinero({ amount: 500 }));
    const resultOg = baseOg
      .multiply(2)
      .add(DineroOg({ amount: 500 }));

    expect(result.getAmount()).toBe(resultOg.getAmount());
  });

  it('should handle large numbers', () => {
    const largeMoney = Dinero({ amount: 99999999999 });
    const largeMoneyOg = DineroOg({ amount: 99999999999 });

    expect(largeMoney.getAmount()).toBe(largeMoneyOg.getAmount());
    // Original doesn't have toNumber method, so compare toUnit instead
    expect(largeMoney.toUnit()).toBe(largeMoneyOg.toUnit());
  });

  it('should work with different currencies', () => {
    const eurMoney = Dinero({ amount: 4250, currency: 'EUR' });
    const jpyMoney = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });
    const eurMoneyOg = DineroOg({ amount: 4250, currency: 'EUR' });
    const jpyMoneyOg = DineroOg({ amount: 1000, currency: 'JPY', precision: 0 });

    expect(eurMoney.getCurrency()).toBe(eurMoneyOg.getCurrency());
    expect(jpyMoney.getCurrency()).toBe(jpyMoneyOg.getCurrency());
    expect(eurMoney.getPrecision()).toBe(eurMoneyOg.getPrecision());
    expect(jpyMoney.getPrecision()).toBe(jpyMoneyOg.getPrecision());
  });

  it('should handle currency objects with precision', () => {
    const customCurrency = { code: 'BTC' as any, precision: 8 };
    const btcMoney = Dinero({ amount: 100000000, currency: customCurrency });
    const btcMoneyOg = DineroOg({ amount: 100000000, currency: 'BTC', precision: 8 });

    expect(btcMoney.getCurrency()).toBe(btcMoneyOg.getCurrency());
    expect(btcMoney.getPrecision()).toBe(btcMoneyOg.getPrecision());
    expect(btcMoney.toUnit()).toBe(btcMoneyOg.toUnit());
  });

  it('should handle immutability in all operations', () => {
    const base = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
    const baseOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

    // Test that each operation returns a new instance
    const added = base.add(Dinero({ amount: 500 }));
    const subtracted = base.subtract(Dinero({ amount: 200 }));
    const multiplied = base.multiply(2);
    const divided = base.divide(2);
    const percentage = base.percentage(50);
    const withLocale = base.setLocale('fr-FR');
    const converted = base.convertPrecision(3);

    const addedOg = baseOg.add(DineroOg({ amount: 500 }));
    const subtractedOg = baseOg.subtract(DineroOg({ amount: 200 }));
    const multipliedOg = baseOg.multiply(2);
    const dividedOg = baseOg.divide(2);
    const percentageOg = baseOg.percentage(50);
    const withLocaleOg = baseOg.setLocale('fr-FR');
    const convertedOg = baseOg.convertPrecision(3);

    // Original should remain unchanged
    expect(base.getAmount()).toBe(baseOg.getAmount());
    expect(base.getCurrency()).toBe(baseOg.getCurrency());
    expect(base.getPrecision()).toBe(baseOg.getPrecision());
    expect(base.getLocale()).toBe(baseOg.getLocale());

    // Each operation should match original behavior and return different instances
    expect(added).not.toBe(base);
    expect(subtracted).not.toBe(base);
    expect(multiplied).not.toBe(base);
    expect(divided).not.toBe(base);
    expect(percentage).not.toBe(base);
    expect(withLocale).not.toBe(base);
    expect(converted).not.toBe(base);

    // Results should match original implementation
    expect(added.getAmount()).toBe(addedOg.getAmount());
    expect(subtracted.getAmount()).toBe(subtractedOg.getAmount());
    expect(multiplied.getAmount()).toBe(multipliedOg.getAmount());
    expect(divided.getAmount()).toBe(dividedOg.getAmount());
    expect(percentage.getAmount()).toBe(percentageOg.getAmount());
    expect(withLocale.getLocale()).toBe(withLocaleOg.getLocale());
    expect(converted.getPrecision()).toBe(convertedOg.getPrecision());
  });
});
