import { describe, expect, it } from "vitest";
import Big from 'big.js';
import { isPositive } from '../../../src/dinero-v2/index.js';
import { USD } from "../../../src/dinero-v2/currencies";
import { createBigintDinero } from "../utils/createBigintDinero.js";
import { castToBigintCurrency } from "../utils/castToBigintCurrency.js";
import { createBigjsDinero } from "../utils/createBigjsDinero.js";
import { castToBigjsCurrency } from "../utils/castToBigjsCurrency.js";
import { createNumberDinero } from "../utils/createNumberDinero.js";

describe('isPositive', () => {
  describe('number', () => {
    const dinero = createNumberDinero;

    it('returns false when amount is less than 0', () => {
      const d = dinero({ amount: -100, currency: USD });

      expect(isPositive(d)).toBe(false);
    });
    it('returns true when amount is greater than 0', () => {
      const d = dinero({ amount: 100, currency: USD });

      expect(isPositive(d)).toBe(true);
    });
    it('returns true when amount is equal to 0', () => {
      const d1 = dinero({ amount: 0, currency: USD });
      const d2 = dinero({ amount: -0, currency: USD });

      expect(isPositive(d1)).toBe(true);
      expect(isPositive(d2)).toBe(true);
    });
  });
  describe('bigint', () => {
    const dinero = createBigintDinero;
    const bigintUSD = castToBigintCurrency(USD);

    it('returns false when amount is less than 0', () => {
      const d = dinero({ amount: -100n, currency: bigintUSD });

      expect(isPositive(d)).toBe(false);
    });
    it('returns true when amount is greater than 0', () => {
      const d = dinero({ amount: 100n, currency: bigintUSD });

      expect(isPositive(d)).toBe(true);
    });
    it('returns true when amount is equal to 0', () => {
      const d1 = dinero({ amount: 0n, currency: bigintUSD });
      const d2 = dinero({ amount: -0n, currency: bigintUSD });

      expect(isPositive(d1)).toBe(true);
      expect(isPositive(d2)).toBe(true);
    });
  });
  describe('Big.js', () => {
    const dinero = createBigjsDinero;
    const bigjsUSD = castToBigjsCurrency(USD);

    it('returns false when amount is less than 0', () => {
      const d = dinero({ amount: new Big(-100), currency: bigjsUSD });

      expect(isPositive(d)).toBe(false);
    });
    it('returns true when amount is greater than 0', () => {
      const d = dinero({ amount: new Big(100), currency: bigjsUSD });

      expect(isPositive(d)).toBe(true);
    });
    it('returns true when amount is equal to 0', () => {
      const d1 = dinero({ amount: new Big(0), currency: bigjsUSD });
      const d2 = dinero({ amount: new Big(-0), currency: bigjsUSD });

      expect(isPositive(d1)).toBe(true);
      expect(isPositive(d2)).toBe(true);
    });
  });
});
