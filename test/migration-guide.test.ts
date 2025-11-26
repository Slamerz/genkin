import { describe, expect, it } from 'vitest';

// Migration examples showing how to replace Dinero.js imports

describe('Migration Guide Examples', () => {
  describe('Dinero V1 to Genkin Migration', () => {
    it('should demonstrate basic migration path', async () => {
      // Old Dinero v1 code (commented out):
      // import Dinero from 'dinero.js';
      // const money = Dinero({ amount: 500, currency: 'USD' });
      
      // New Genkin code with compatibility layer:
      const { Dinero } = await import('../src/dinero-v1/index.js');
      const money = Dinero({ amount: 500, currency: 'USD' });
      
      expect(money.getAmount()).toBe(500);
      expect(money.getCurrency()).toBe('USD');
    });

    it('should demonstrate arithmetic operations migration', async () => {
      // Old Dinero v1 code (commented out):
      // import Dinero from 'dinero.js';
      // const price = Dinero({ amount: 2000 });
      // const tax = Dinero({ amount: 200 });
      // const total = price.add(tax);
      
      // New Genkin code with compatibility layer:
      const { Dinero } = await import('../src/dinero-v1/index.js');
      const price = Dinero({ amount: 2000 });
      const tax = Dinero({ amount: 200 });
      const total = price.add(tax);
      
      expect(total.getAmount()).toBe(2200);
    });

    it('should demonstrate allocation migration', async () => {
      // Old Dinero v1 code (commented out):
      // import Dinero from 'dinero.js';
      // const money = Dinero({ amount: 10000 });
      // const [part1, part2] = money.allocate([70, 30]);
      
      // New Genkin code with compatibility layer:
      const { Dinero } = await import('../src/dinero-v1/index.js');
      const money = Dinero({ amount: 10000 });
      const [part1, part2] = money.allocate([70, 30]);
      
      expect(part1.getAmount()).toBe(7000);
      expect(part2.getAmount()).toBe(3000);
    });
  });

  describe('Dinero V2 to Genkin Migration', () => {
    it('should demonstrate basic v2 migration path', async () => {
      // Old Dinero v2 code (commented out):
      // import { dinero } from 'dinero.js';
      // import { USD } from '@dinero.js/currencies';
      // const money = dinero({ amount: 500, currency: USD });
      
      // New Genkin code with compatibility layer:
      const { dinero } = await import('../src/dinero-v2/index.js');
      const USD = { code: 'USD' as const, scale: 2 };
      const money = dinero({ amount: 500, currency: USD });
      
      expect(money.toJSON().amount).toBe(500);
      expect(money.toJSON().currency.code).toBe('USD');
    });

    it('should demonstrate arithmetic operations v2 migration', async () => {
      // Old Dinero v2 code (commented out):
      // import { dinero, add } from 'dinero.js';
      // import { USD } from '@dinero.js/currencies';
      // const price = dinero({ amount: 2000, currency: USD });
      // const tax = dinero({ amount: 200, currency: USD });
      // const total = add(price, tax);
      
      // New Genkin code with compatibility layer:
      const { dinero, add } = await import('../src/dinero-v2/index.js');
      const USD = { code: 'USD' as const, scale: 2 };
      const price = dinero({ amount: 2000, currency: USD });
      const tax = dinero({ amount: 200, currency: USD });
      const total = add(price, tax);
      
      expect(total.toJSON().amount).toBe(2200);
    });

    it('should demonstrate toDecimal migration', async () => {
      // Old Dinero v2 code (commented out):
      // import { dinero, toDecimal } from 'dinero.js';
      // import { USD } from '@dinero.js/currencies';
      // const money = dinero({ amount: 2550, currency: USD });
      // const decimal = toDecimal(money);
      
      // New Genkin code with compatibility layer:
      const { dinero, toDecimal } = await import('../src/dinero-v2/index.js');
      const USD = { code: 'USD' as const, scale: 2 };
      const money = dinero({ amount: 2550, currency: USD });
      const decimal = toDecimal(money);
      
      expect(decimal).toBe('25.5');
    });
  });

  describe('Gradual Migration to Native Genkin API', () => {
    it('should show how to gradually adopt native Genkin syntax', async () => {
      // Step 1: Using compatibility layer
      const { Dinero } = await import('../src/dinero-v1/index.js');
      const compatMoney = Dinero({ amount: 500, currency: 'USD' });
      
      // Step 2: Gradually migrate to native Genkin
      const { genkin } = await import('../src/core/genkin.js');
      const { USD } = await import('../src/currencies/index.js');
      const nativeMoney = genkin(5.00, { currency: USD });
      
      // Both should represent the same value
      expect(compatMoney.toNumber()).toBe(nativeMoney.amount);
      expect(compatMoney.getCurrency()).toBe(nativeMoney.currencyCode);
    });

    it('should show native Genkin operations after migration', async () => {
      // Native Genkin operations (final migration step)
      const { genkin } = await import('../src/core/genkin.js');
      const { add, multiply } = await import('../src/operations/index.js');
      const { USD } = await import('../src/currencies/index.js');
      
      const price = genkin(20.00, { currency: USD });
      const taxRate = 0.1;
      const tax = multiply(price, taxRate);
      const total = add(price, tax);
      
      expect(total.amount).toBe(22.00);
    });
  });

  describe('Import Strategy Examples', () => {
    it('should demonstrate different import strategies', async () => {
      // Strategy 1: Direct replacement imports
      // Replace: import Dinero from 'dinero.js'
      // With:    import { Dinero } from 'genkin/dinero'
      const { Dinero } = await import('../src/dinero-v1/index.js');
      
      // Strategy 2: Direct replacement for v2
      // Replace: import { dinero, add } from 'dinero.js'
      // With:    import { dinero, add } from 'genkin/dineroV2'
      const { dinero, add } = await import('../src/dinero-v2/index.js');
      
      // Strategy 3: Native Genkin imports (eventual target)
      // New:     import { genkin, add as genkinAdd } from 'genkin'
      const { genkin, add: genkinAdd } = await import('../src/index.js');
      
      // All should work for basic operations
      const v1Money = Dinero({ amount: 1000, currency: 'USD' });
      const v2Money = dinero({ amount: 1000, currency: { code: 'USD', scale: 2 } });
      const nativeMoney = genkin(10.00, { currency: 'USD' });
      
      expect(v1Money.getAmount()).toBe(1000);
      expect(v2Money.toJSON().amount).toBe(1000);
      expect(nativeMoney.minorUnits).toBe(1000);
    });
  });

  describe('Common Migration Patterns', () => {
    it('should handle currency definition migration', async () => {
      // Old way with @dinero.js/currencies:
      // import { USD, EUR } from '@dinero.js/currencies';
      
      // New way with compatibility layer:
      const USD = { code: 'USD' as const, scale: 2 };
      const EUR = { code: 'EUR' as const, scale: 2 };
      
      // Or eventual native way:
      const { USD: nativeUSD, createCurrency, getCurrencyConfig } = await import('../src/currencies/index.js');
      const nativeEUR = createCurrency(getCurrencyConfig('EUR'));
      
      expect(USD.code).toBe('USD');
      expect(EUR.code).toBe('EUR');
      expect(nativeUSD.code).toBe('USD');
      expect(nativeEUR.code).toBe('EUR');
    });

    it('should handle precision/scale differences', async () => {
      // Dinero v2 uses 'scale' terminology
      const { dinero } = await import('../src/dinero-v2/index.js');
      const v2Money = dinero({ amount: 123456, currency: { code: 'USD', scale: 4 } });
      
      // Dinero v1 uses 'precision' terminology  
      const { Dinero } = await import('../src/dinero-v1/index.js');
      const v1Money = Dinero({ amount: 123456, currency: 'USD', precision: 4 });
      
      // Genkin uses 'precision' terminology
      const { genkin } = await import('../src/core/genkin.js');
      const nativeMoney = genkin(12.3456, { currency: 'USD', precision: 4 });
      
      expect(v2Money.toJSON().scale).toBe(4);
      expect(v1Money.getPrecision()).toBe(4);
      expect(nativeMoney.precision).toBe(4);
    });

    it('should handle immutability patterns', async () => {
      // All versions maintain immutability
      const { Dinero } = await import('../src/dinero-v1/index.js');
      const { dinero, add } = await import('../src/dinero-v2/index.js');
      const { genkin, add: genkinAdd } = await import('../src/index.js');
      
      const v1Original = Dinero({ amount: 1000 });
      const v1Modified = v1Original.add(Dinero({ amount: 500 }));
      
      const v2Original = dinero({ amount: 1000, currency: { code: 'USD', scale: 2 } });
      const v2Modified = add(v2Original, dinero({ amount: 500, currency: { code: 'USD', scale: 2 } }));
      
      const nativeOriginal = genkin(10.00, { currency: 'USD' });
      const nativeModified = genkinAdd(nativeOriginal, genkin(5.00, { currency: 'USD' }));
      
      // Originals should remain unchanged
      expect(v1Original.getAmount()).toBe(1000);
      expect(v2Original.toJSON().amount).toBe(1000);
      expect(nativeOriginal.minorUnits).toBe(1000);
      
      // Modified versions should show changes
      expect(v1Modified.getAmount()).toBe(1500);
      expect(v2Modified.toJSON().amount).toBe(1500);
      expect(nativeModified.minorUnits).toBe(1500);
    });
  });
});
