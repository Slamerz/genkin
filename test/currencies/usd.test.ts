import { describe, it, expect } from 'vitest';
import { USD, USD_CONFIG, USD_CODE, createUSD } from '../../src/currencies/index.js';

describe('USD Currency', () => {
  describe('USD_CONFIG', () => {
    it('should have correct configuration', () => {
      expect(USD_CONFIG).toEqual({
        code: 'USD',
        numeric: 840,
        precision: 2,
        symbol: '$',
        name: 'US Dollar',
        base: 10,
      });
    });
  });

  describe('USD_CODE', () => {
    it('should be "USD"', () => {
      expect(USD_CODE).toBe('USD');
    });
  });

  describe('createUSD', () => {
    it('should create a USD currency instance', () => {
      const usd = createUSD();
      expect(usd.code).toBe('USD');
      expect(usd.precision).toBe(2);
      expect(usd.symbol).toBe('$');
      expect(usd.name).toBe('US Dollar');
      expect(typeof usd.format).toBe('function');
      expect(typeof usd.parse).toBe('function');
    });
  });

  describe('USD default instance', () => {
    it('should have correct properties', () => {
      expect(USD.code).toBe('USD');
      expect(USD.precision).toBe(2);
      expect(USD.symbol).toBe('$');
      expect(USD.name).toBe('US Dollar');
    });

    it('should format amounts correctly', () => {
      expect(USD.format(1234.56)).toBe('$1,234.56');
      expect(USD.format(1000)).toBe('$1,000.00');
      expect(USD.format(0.99)).toBe('$0.99');
      expect(USD.format(0)).toBe('$0.00');
    });

    it('should format with custom options', () => {
      expect(USD.format(1234.56, { showSymbol: false })).toBe('1,234.56');
      expect(USD.format(1234.56, { showCode: true })).toBe('$1,234.56 USD');
      expect(USD.format(1234.56, { showName: true })).toBe('$1,234.56 (US Dollar)');
      expect(USD.format(1234.56, { useGrouping: false })).toBe('$1234.56');
      expect(USD.format(1234.56, { decimalPlaces: 3 })).toBe('$1,234.560');
    });

    it('should parse currency strings correctly', () => {
      expect(USD.parse('$1,234.56')).toBe(1234.56);
      expect(USD.parse('1234.56')).toBe(1234.56);
      expect(USD.parse('$1000')).toBe(1000);
      expect(USD.parse('$0.99')).toBe(0.99);
    });
  });
}); 