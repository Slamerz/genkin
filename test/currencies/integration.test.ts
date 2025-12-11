import { describe, it, expect } from 'vitest';
import { USD, USD_CONFIG, createUSD } from '../../src/currencies/index.js';
import { genkin } from '../../src/core/genkin.js';

describe('USD Currency Integration', () => {
  it('should work with different import styles', async () => {
    // Test importing from currencies module
    const { USD: MainUSD } = await import('../../src/currencies/index.js');
    expect(MainUSD).toBeDefined();
    expect(MainUSD.code).toBe('USD');
  });

  it('should work with genkin factory function', () => {
    const money = genkin(100, { currency: USD });
    expect(money.currencyCode).toBe('USD');
    expect(money.precision).toBe(2);
  });

  it('should format USD currency directly', () => {
    // Test USD currency format method
    expect(USD.format(1234.56)).toBe('$1,234.56');
    expect(USD.format(1234.56, { showCode: true })).toBe('$1,234.56 USD');
    expect(USD.format(1234.56, { showSymbol: false })).toBe('1,234.56');
  });

  it('should parse USD currency strings', () => {
    expect(USD.parse('$1,234.56')).toBe(1234.56);
    expect(USD.parse('1234.56')).toBe(1234.56);
  });

  it('should work with genkin toString', () => {
    const money = genkin(123.45, { currency: USD });
    expect(money.toString()).toBe('$123.45');
  });

  it('should handle zero amounts', () => {
    const money = genkin(0, { currency: USD });
    expect(money.toString()).toBe('$0.00');
  });

  it('should handle negative amounts', () => {
    const money = genkin(-123.45, { currency: USD });
    expect(money.toString()).toBe('$-123.45');
  });

  it('should demonstrate different usage patterns', () => {
    // Pattern 1: Using USD directly for formatting
    expect(USD.format(99.99)).toBe('$99.99');

    // Pattern 2: Using USD configuration with genkin
    const money = genkin(199.95, { currency: USD });
    expect(money.toString()).toBe('$199.95');

    // Pattern 3: Creating custom USD instance
    const customUSD = createUSD();
    expect(customUSD.format(299.99)).toBe('$299.99');
  });
}); 
