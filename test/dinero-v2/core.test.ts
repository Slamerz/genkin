import { describe, expect, it } from 'vitest';
import { assert, dinero, toSnapshot } from '../../src/dinero-v2/index.js';
import {dinero as ogDineroV2} from 'dinero.js';
import { USD as USD_DINERO } from '@dinero.js/currencies';
import { USD } from '../../src/dinero-v2/currencies.js';


describe('Core API', () => {
  it('should match Dinero.js V2 Alpha construction patterns', () => {
    const price = dinero({ amount: 500, currency: USD });
    const priceOg = ogDineroV2({ amount: 500, currency: USD_DINERO });

    expect(price.toJSON().amount).toBe(priceOg.toJSON().amount);
    expect(price.toJSON().currency.code).toBe(priceOg.toJSON().currency.code);
    expect(price.toJSON().scale).toBe(priceOg.toJSON().scale);
  });

  it('creates a Dinero object', () => {
    const d = dinero({ amount: 50000, currency: USD, scale: 4 });

    const snapshot = toSnapshot(d);

    expect(snapshot).toEqual({ amount: 50000, currency: USD, scale: 4 });
  });

  it("uses the currency's exponent as scale when not provided", () => {
    const d = dinero({ amount: 500, currency: USD });

    const snapshot = toSnapshot(d);

    expect(snapshot).toMatchObject({ amount: 500, currency: USD, scale: 2 });
  });

  it('cleans up unwanted properties from the options', () => {
    const d = dinero({
      amount: 500,
      // @ts-expect-error - extra property
      currency: { code: 'USD', exponent: 2, base: 10, _extraProperty: 123 },
      _extraProperty: 123,
    });

    const snapshot = toSnapshot(d);

    expect(snapshot).toStrictEqual({
      amount: 500,
      currency: USD,
      scale: 2,
    });
  });

  it('throws when the amount is not an integer', () => {
    expect(() => dinero({ amount: 500.5, currency: USD })).toThrow(
      new Error('[Dinero.js] Amount is invalid.')
    );
  });

  it('throws when the scale is not an integer', () => {
    expect(() => dinero({ amount: 500, currency: USD, scale: 2.5 })).toThrow(
      new Error('[Dinero.js] Scale is invalid.')
    );
  });

  describe('assert', () => {
    it("doesn't throw when the condition is met", () => {
      expect(() => assert(true, 'Some error message.')).not.toThrow(
        new Error('[Dinero.js] Some error message.')
      );
    });
    it("throws when the condition isn't met", () => {
      expect(() => assert(false, 'Some error message.')).toThrow(
        new Error('[Dinero.js] Some error message.')
      );
    });
  });
});