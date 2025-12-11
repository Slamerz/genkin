import { describe, expect, it } from "vitest";
import Big from 'big.js';
import { isZero } from '../../../src/dinero-v2/index.js';
import { USD } from "../../../src/dinero-v2/currencies";
import { createBigintDinero } from "../utils/createBigintDinero.js";
import { castToBigintCurrency } from "../utils/castToBigintCurrency.js";
import { createBigjsDinero } from "../utils/createBigjsDinero.js";
import { castToBigjsCurrency } from "../utils/castToBigjsCurrency.js";
import { createNumberDinero } from "../utils/createNumberDinero.js";

describe('isZero', () => {
  describe('number', () => {
    const dinero = createNumberDinero;

    it('returns true when amount is equal to 0', () => {
      const d = dinero({ amount: 0, currency: USD });

      expect(isZero(d)).toBe(true);
    });
    it('returns false when amount is not equal to 0', () => {
      const d = dinero({ amount: 100, currency: USD });

      expect(isZero(d)).toBe(false);
    });
  });
  describe('bigint', () => {
    const dinero = createBigintDinero;
    const bigintUSD = castToBigintCurrency(USD);

    it('returns true when amount is equal to 0', () => {
      const d = dinero({ amount: 0n, currency: bigintUSD });

      expect(isZero(d)).toBe(true);
    });
    it('returns false when amount is not equal to 0', () => {
      const d = dinero({ amount: 100n, currency: bigintUSD });

      expect(isZero(d)).toBe(false);
    });
  });
  describe('Big.js', () => {
    const dinero = createBigjsDinero;
    const bigjsUSD = castToBigjsCurrency(USD);

    it('returns true when amount is equal to 0', () => {
      const d = dinero({ amount: new Big(0), currency: bigjsUSD });

      expect(isZero(d)).toBe(true);
    });
    it('returns false when amount is not equal to 0', () => {
      const d = dinero({ amount: new Big(100), currency: bigjsUSD });

      expect(isZero(d)).toBe(false);
    });
  });
});
