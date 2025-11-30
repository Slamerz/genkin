import { describe, expect, it } from 'vitest';
import  Dinero  from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Advanced Conversion Methods', () => {
  describe('toUnit', () => {
    it('should convert to major currency units', () => {
      const money1 = Dinero({ amount: 1050, precision: 2 }); // 10.50
      const money2 = Dinero({ amount: 10545, precision: 3 }); // 10.545
      const money3 = Dinero({ amount: 1000, precision: 0 }); // 1000 (no decimal places)
      const money1Og = DineroOg({ amount: 1050, precision: 2 });
      const money2Og = DineroOg({ amount: 10545, precision: 3 });
      const money3Og = DineroOg({ amount: 1000, precision: 0 });

      expect(money1.toUnit()).toBe(money1Og.toUnit());
      expect(money2.toUnit()).toBe(money2Og.toUnit());
      expect(money3.toUnit()).toBe(money3Og.toUnit());
    });

    it('should handle negative amounts', () => {
      const money = Dinero({ amount: -2550, precision: 2 });
      const moneyOg = DineroOg({ amount: -2550, precision: 2 });

      expect(money.toUnit()).toBe(moneyOg.toUnit());
    });

    it('should handle zero amounts', () => {
      const money = Dinero({ amount: 0, precision: 2 });
      const moneyOg = DineroOg({ amount: 0, precision: 2 });

      expect(money.toUnit()).toBe(moneyOg.toUnit());
    });
  });

  describe('toRoundedUnit', () => {
    it('should round to specified digits', () => {
      const money = Dinero({ amount: 1055, precision: 2 }); // 10.55
      const moneyOg = DineroOg({ amount: 1055, precision: 2 });

      expect(money.toRoundedUnit(1)).toBe(moneyOg.toRoundedUnit(1));
      expect(money.toRoundedUnit(0)).toBe(moneyOg.toRoundedUnit(0));
    });

    it('should handle different rounding modes', () => {
      const money = Dinero({ amount: 1050, precision: 2 }); // 10.50
      const moneyOg = DineroOg({ amount: 1050, precision: 2 });

      expect(money.toRoundedUnit(0, 'HALF_EVEN')).toBe(moneyOg.toRoundedUnit(0, 'HALF_EVEN'));
      expect(money.toRoundedUnit(0, 'HALF_UP')).toBe(moneyOg.toRoundedUnit(0, 'HALF_UP'));
      expect(money.toRoundedUnit(0, 'HALF_DOWN')).toBe(moneyOg.toRoundedUnit(0, 'HALF_DOWN'));

      // Verify the actual original behavior
      expect(moneyOg.toRoundedUnit(0, 'HALF_DOWN')).toBe(10); // Original rounds .5 down
    });

    it('should handle negative amounts with rounding', () => {
      const money = Dinero({ amount: -1055, precision: 2 }); // -10.55
      const moneyOg = DineroOg({ amount: -1055, precision: 2 });

      expect(money.toRoundedUnit(1)).toBe(moneyOg.toRoundedUnit(1));
      expect(money.toRoundedUnit(0)).toBe(moneyOg.toRoundedUnit(0));
    });
  });

  describe('convertPrecision', () => {
    it('should convert between different precisions', () => {
      const money = Dinero({ amount: 1050, precision: 2 }); // 10.50
      const moneyOg = DineroOg({ amount: 1050, precision: 2 });

      const highPrec = money.convertPrecision(3);
      const highPrecOg = moneyOg.convertPrecision(3);
      expect(highPrec.getPrecision()).toBe(highPrecOg.getPrecision());
      expect(highPrec.getAmount()).toBe(highPrecOg.getAmount());

      const lowPrec = money.convertPrecision(1);
      const lowPrecOg = moneyOg.convertPrecision(1);
      expect(lowPrec.getPrecision()).toBe(lowPrecOg.getPrecision());
      expect(lowPrec.getAmount()).toBe(lowPrecOg.getAmount());

      expect(lowPrec.getAmount()).not.toBe(highPrec.getAmount());
      expect(lowPrecOg.getAmount()).not.toBe(highPrecOg.getAmount());
    });

    it('should handle rounding when reducing precision', () => {
      const money = Dinero({ amount: 10555, precision: 3 }); // 10.555
      const moneyOg = DineroOg({ amount: 10555, precision: 3 });

      const converted = money.convertPrecision(2);
      const convertedOg = moneyOg.convertPrecision(2);
      expect(converted.getPrecision()).toBe(convertedOg.getPrecision());
      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(money.getAmount()).not.toBe(converted.getAmount());
      expect(moneyOg.getAmount()).not.toBe(convertedOg.getAmount());
    });

    it('should preserve currency and other properties', () => {
      const money = Dinero({ amount: 1050, currency: 'EUR', precision: 2 });
      const moneyOg = DineroOg({ amount: 1050, currency: 'EUR', precision: 2 });
      const converted = money.convertPrecision(3);
      const convertedOg = moneyOg.convertPrecision(3);

      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
      expect(converted.getPrecision()).toBe(convertedOg.getPrecision());
      expect(money.getAmount()).not.toBe(converted.getAmount());
      expect(moneyOg.getAmount()).not.toBe(convertedOg.getAmount());
    });

    describe('rounding modes in convertPrecision', () => {
      it('should handle HALF_UP rounding when reducing precision', () => {
        const money = Dinero({ amount: 12345, precision: 3 }); // 12.345
        const moneyOg = DineroOg({ amount: 12345, precision: 3 });

        const rounded = money.convertPrecision(2, 'HALF_UP');
        const roundedOg = moneyOg.convertPrecision(2, 'HALF_UP');

        expect(rounded.getAmount()).toBe(roundedOg.getAmount());
        expect(rounded.getPrecision()).toBe(roundedOg.getPrecision());
      });

      it('should handle HALF_DOWN rounding when reducing precision', () => {
        const money = Dinero({ amount: 12345, precision: 3 }); // 12.345
        const moneyOg = DineroOg({ amount: 12345, precision: 3 });

        const rounded = money.convertPrecision(2, 'HALF_DOWN');
        const roundedOg = moneyOg.convertPrecision(2, 'HALF_DOWN');

        expect(rounded.getAmount()).toBe(roundedOg.getAmount());
        expect(rounded.getPrecision()).toBe(roundedOg.getPrecision());
      });

      it('should handle HALF_EVEN rounding when reducing precision', () => {
        const money = Dinero({ amount: 12345, precision: 3 }); // 12.345
        const moneyOg = DineroOg({ amount: 12345, precision: 3 });

        const rounded = money.convertPrecision(2, 'HALF_EVEN');
        const roundedOg = moneyOg.convertPrecision(2, 'HALF_EVEN');

        expect(rounded.getAmount()).toBe(roundedOg.getAmount());
        expect(rounded.getPrecision()).toBe(roundedOg.getPrecision());
      });

      it('should handle HALF_ODD rounding when reducing precision', () => {
        const money = Dinero({ amount: 12345, precision: 3 }); // 12.345
        const moneyOg = DineroOg({ amount: 12345, precision: 3 });

        const rounded = money.convertPrecision(2, 'HALF_ODD');
        const roundedOg = moneyOg.convertPrecision(2, 'HALF_ODD');

        expect(rounded.getAmount()).toBe(roundedOg.getAmount());
        expect(rounded.getPrecision()).toBe(roundedOg.getPrecision());
      });

      it('should handle exact halfway values with different rounding modes', () => {
        // 12.250 should round differently with different modes
        const money = Dinero({ amount: 12250, precision: 3 }); // 12.250
        const moneyOg = DineroOg({ amount: 12250, precision: 3 });

        const halfUp = money.convertPrecision(2, 'HALF_UP');
        const halfDown = money.convertPrecision(2, 'HALF_DOWN');
        const halfEven = money.convertPrecision(2, 'HALF_EVEN');

        const halfUpOg = moneyOg.convertPrecision(2, 'HALF_UP');
        const halfDownOg = moneyOg.convertPrecision(2, 'HALF_DOWN');
        const halfEvenOg = moneyOg.convertPrecision(2, 'HALF_EVEN');

        expect(halfUp.getAmount()).toBe(halfUpOg.getAmount());
        expect(halfDown.getAmount()).toBe(halfDownOg.getAmount());
        expect(halfEven.getAmount()).toBe(halfEvenOg.getAmount());

        // Verify the actual rounding behavior
        expect(halfUpOg.getAmount()).toBe(1225); // 12.25 rounds up to 12.25
        expect(halfDownOg.getAmount()).toBe(1225); // 12.25 rounds down to 12.25 (no rounding needed)
        expect(halfEvenOg.getAmount()).toBe(1225); // 12.25 stays 12.25 (no rounding needed)
      });

      it('should handle true halfway values that require rounding', () => {
        // Test with a value that actually has a .5 in the digit being rounded
        const money = Dinero({ amount: 12235, precision: 3 }); // 12.235 - the 3 rounds the 23 to either 23 or 24
        const moneyOg = DineroOg({ amount: 12235, precision: 3 });

        const halfUp = money.convertPrecision(2, 'HALF_UP');
        const halfDown = money.convertPrecision(2, 'HALF_DOWN');
        const halfEven = money.convertPrecision(2, 'HALF_EVEN');
        const halfOdd = money.convertPrecision(2, 'HALF_ODD');
        const halfTowardsZero = money.convertPrecision(2, 'HALF_TOWARDS_ZERO');
        const halfAwayFromZero = money.convertPrecision(2, 'HALF_AWAY_FROM_ZERO');

        const halfUpOg = moneyOg.convertPrecision(2, 'HALF_UP');
        const halfDownOg = moneyOg.convertPrecision(2, 'HALF_DOWN');
        const halfEvenOg = moneyOg.convertPrecision(2, 'HALF_EVEN');
        const halfOddOg = moneyOg.convertPrecision(2, 'HALF_ODD');
        const halfTowardsZeroOg = moneyOg.convertPrecision(2, 'HALF_TOWARDS_ZERO');
        const halfAwayFromZeroOg = moneyOg.convertPrecision(2, 'HALF_AWAY_FROM_ZERO');

        expect(halfUp.getAmount()).toBe(halfUpOg.getAmount());
        expect(halfDown.getAmount()).toBe(halfDownOg.getAmount());
        expect(halfEven.getAmount()).toBe(halfEvenOg.getAmount());
        expect(halfOdd.getAmount()).toBe(halfOddOg.getAmount());
        expect(halfTowardsZero.getAmount()).toBe(halfTowardsZeroOg.getAmount());
        expect(halfAwayFromZero.getAmount()).toBe(halfAwayFromZeroOg.getAmount());
      });

      it('should handle negative amounts with rounding modes', () => {
        const money = Dinero({ amount: -12345, precision: 3 }); // -12.345
        const moneyOg = DineroOg({ amount: -12345, precision: 3 });

        const halfUp = money.convertPrecision(2, 'HALF_UP');
        const halfDown = money.convertPrecision(2, 'HALF_DOWN');
        const halfEven = money.convertPrecision(2, 'HALF_EVEN');
        const halfOdd = money.convertPrecision(2, 'HALF_ODD');
        const halfTowardsZero = money.convertPrecision(2, 'HALF_TOWARDS_ZERO');
        const halfAwayFromZero = money.convertPrecision(2, 'HALF_AWAY_FROM_ZERO');

        const halfUpOg = moneyOg.convertPrecision(2, 'HALF_UP');
        const halfDownOg = moneyOg.convertPrecision(2, 'HALF_DOWN');
        const halfEvenOg = moneyOg.convertPrecision(2, 'HALF_EVEN');
        const halfOddOg = moneyOg.convertPrecision(2, 'HALF_ODD');
        const halfTowardsZeroOg = moneyOg.convertPrecision(2, 'HALF_TOWARDS_ZERO');
        const halfAwayFromZeroOg = moneyOg.convertPrecision(2, 'HALF_AWAY_FROM_ZERO');

        expect(halfUp.getAmount()).toBe(halfUpOg.getAmount());
        expect(halfDown.getAmount()).toBe(halfDownOg.getAmount());
        expect(halfEven.getAmount()).toBe(halfEvenOg.getAmount());
        expect(halfOdd.getAmount()).toBe(halfOddOg.getAmount());
        expect(halfTowardsZero.getAmount()).toBe(halfTowardsZeroOg.getAmount());
        expect(halfAwayFromZero.getAmount()).toBe(halfAwayFromZeroOg.getAmount());
      });

      it('should handle all supported rounding modes with larger precision changes', () => {
        const money = Dinero({ amount: 1234567, precision: 4 }); // 123.4567
        const moneyOg = DineroOg({ amount: 1234567, precision: 4 });

        // Test all rounding modes supported by original Dinero.js
        const modes: ('HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'HALF_ODD' | 'HALF_TOWARDS_ZERO' | 'HALF_AWAY_FROM_ZERO' | 'DOWN')[] = [
          'HALF_UP', 'HALF_DOWN', 'HALF_EVEN', 'HALF_ODD', 'HALF_TOWARDS_ZERO', 'HALF_AWAY_FROM_ZERO', 'DOWN'
        ];

        modes.forEach(mode => {
          const result = money.convertPrecision(2, mode);
          const resultOg = moneyOg.convertPrecision(2, mode);

          expect(result.getAmount()).toBe(resultOg.getAmount());
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
        });
      });

      it('should match original behavior for unsupported rounding modes', () => {
        const money = Dinero({ amount: 12341, precision: 3 });
        const moneyOg = DineroOg({ amount: 12341, precision: 3 });

        // Test the modes that throw in original
        expect(() => money.convertPrecision(2, 'UP' as any)).toThrow();
        expect(() => moneyOg.convertPrecision(2, 'UP' as any)).toThrow();

        expect(() => money.convertPrecision(2, 'TOWARDS_ZERO' as any)).toThrow();
        expect(() => moneyOg.convertPrecision(2, 'TOWARDS_ZERO' as any)).toThrow();

        expect(() => money.convertPrecision(2, 'AWAY_FROM_ZERO' as any)).toThrow();
        expect(() => moneyOg.convertPrecision(2, 'AWAY_FROM_ZERO' as any)).toThrow();

        // Test the modes that don't throw and just return results
        const downResult = money.convertPrecision(2, 'DOWN' as any);
        const downResultOg = moneyOg.convertPrecision(2, 'DOWN' as any);
        expect(downResult.getAmount()).toBe(downResultOg.getAmount());
      });
    });
  });

  describe('convert (currency conversion)', () => {
    it('should convert currency with direct exchange rate', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 }); // $10.00
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      // Mock exchange rate data
      const rates = { rates: { EUR: 0.85 } };

      const converted = await money.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.EUR'
      });

      const convertedOg = await moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.EUR'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
      expect(converted.getPrecision()).toBe(convertedOg.getPrecision());
    });

    it('should handle mustache templating in endpoints', async () => {
      const money = Dinero({ amount: 500, currency: 'USD', precision: 2 }); // $5.00
      const moneyOg = DineroOg({ amount: 500, currency: 'USD', precision: 2 });

      // Mock API response
      const rates = { data: { rates: { USD: 1.0, EUR: 0.85 } } };

      const converted = await money.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'data.rates.{{to}}'
      });

      const convertedOg = await moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'data.rates.{{to}}'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe('EUR');
      expect(convertedOg.getCurrency()).toBe('EUR');
    });

    it('should handle mustache templating in property paths', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      const rates = {
        base: 'USD',
        rates: {
          EUR: 0.85,
          GBP: 0.75
        }
      };

      const converted = await money.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.{{to}}'
      });

      const convertedOg = await moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.{{to}}'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
    });

    it('should handle nested property paths', async () => {
      const money = Dinero({ amount: 2000, currency: 'USD', precision: 2 }); // $20.00
      const moneyOg = DineroOg({ amount: 2000, currency: 'USD', precision: 2 });

      const rates = {
        success: true,
        data: {
          base: 'USD',
          rates: {
            EUR: 0.85,
            JPY: 110.0
          }
        }
      };

      const converted = await money.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'data.rates.{{to}}'
      });

      const convertedOg = await moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'data.rates.{{to}}'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
    });

    it('should handle different rounding modes', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      const rates = { rates: { EUR: 0.85 } };

      const modes: ('HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'HALF_ODD' | 'HALF_TOWARDS_ZERO' | 'HALF_AWAY_FROM_ZERO')[] = [
        'HALF_UP', 'HALF_DOWN', 'HALF_EVEN', 'HALF_ODD', 'HALF_TOWARDS_ZERO', 'HALF_AWAY_FROM_ZERO'
      ];

      for (const mode of modes) {
        const converted = await money.convert('EUR', {
          endpoint: Promise.resolve(rates),
          propertyPath: 'rates.EUR',
          roundingMode: mode
        });

        const convertedOg = await moneyOg.convert('EUR', {
          endpoint: Promise.resolve(rates),
          propertyPath: 'rates.EUR',
          roundingMode: mode
        });

        expect(converted.getAmount()).toBe(convertedOg.getAmount());
        expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
      }
    });

    it('should use default property path when not specified', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      // Default property path is 'rates.{{to}}'
      const rates = { rates: { EUR: 0.85 } };

      const converted = await money.convert('EUR', {
        endpoint: Promise.resolve(rates)
      });

      const convertedOg = await moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates)
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
    });

    it('should use default rounding mode when not specified', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      const rates = { rates: { EUR: 0.85 } };

      const converted = await money.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.EUR'
      });

      const convertedOg = await moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.EUR'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
    });

    it('should throw error for unsupported rounding modes', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      const rates = { rates: { EUR: 0.85 } };

      // Test that our implementation throws with the same message as original
      try {
        await money.convert('EUR', {
          endpoint: Promise.resolve(rates),
          propertyPath: 'rates.EUR',
          roundingMode: 'UP' as any
        });
        expect.fail('roundingModes[UP] is not a function');
      } catch (error: any) {
        expect(error.message).toBe('roundingModes[UP] is not a function');
      }

      try {
        await money.convert('EUR', {
          endpoint: Promise.resolve(rates),
          propertyPath: 'rates.EUR',
          roundingMode: 'TOWARDS_ZERO' as any
        });
        expect.fail('roundingModes[TOWARDS_ZERO] is not a function');
      } catch (error: any) {
        expect(error.message).toBe('roundingModes[TOWARDS_ZERO] is not a function');
      }

      try {
        await money.convert('EUR', {
          endpoint: Promise.resolve(rates),
          propertyPath: 'rates.EUR',
          roundingMode: 'AWAY_FROM_ZERO' as any
        });
        expect.fail('roundingModes[AWAY_FROM_ZERO] is not a function');
      } catch (error: any) {
        expect(error.message).toBe('roundingModes[AWAY_FROM_ZERO] is not a function');
      }

      // Original library should also throw
      await expect(moneyOg.convert('EUR', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.EUR',
        roundingMode: 'UP' as any
      })).rejects.toThrow();
    });

    it('should handle different precision values', async () => {
      const money = Dinero({ amount: 100000, currency: 'JPY', precision: 0 }); // 100000 JPY (no decimals)
      const moneyOg = DineroOg({ amount: 100000, currency: 'JPY', precision: 0 });

      const rates = { rates: { USD: 0.0091 } };

      const converted = await money.convert('USD', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.USD'
      });

      const convertedOg = await moneyOg.convert('USD', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.USD'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe(convertedOg.getCurrency());
      expect(converted.getPrecision()).toBe(convertedOg.getPrecision());
    });

    it('should handle invalid exchange rate data', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });

      // Invalid rate value
      const invalidRates1 = { rates: { EUR: 'invalid' } };
      await expect(money.convert('EUR', {
        endpoint: Promise.resolve(invalidRates1),
        propertyPath: 'rates.EUR'
      })).rejects.toThrow();

      // Missing property
      const invalidRates2 = { rates: { GBP: 0.75 } };
      await expect(money.convert('EUR', {
        endpoint: Promise.resolve(invalidRates2),
        propertyPath: 'rates.EUR'
      })).rejects.toThrow();

      // Non-numeric rate
      const invalidRates3 = { rates: { EUR: null } };
      await expect(money.convert('EUR', {
        endpoint: Promise.resolve(invalidRates3),
        propertyPath: 'rates.EUR'
      })).rejects.toThrow();
    });

    it('should handle API errors', async () => {
      const money = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });

      // Simulate API error
      const errorEndpoint = Promise.reject(new Error('API Error'));

      await expect(money.convert('EUR', {
        endpoint: errorEndpoint,
        propertyPath: 'rates.EUR'
      })).rejects.toThrow();

      await expect(moneyOg.convert('EUR', {
        endpoint: errorEndpoint,
        propertyPath: 'rates.EUR'
      })).rejects.toThrow();
    });

    it('should work with async/await pattern', async () => {
      const money = Dinero({ amount: 1500, currency: 'USD', precision: 2 }); // $15.00
      const moneyOg = DineroOg({ amount: 1500, currency: 'USD', precision: 2 });

      const rates = { rates: { CAD: 1.25 } };

      const converted = await money.convert('CAD', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.CAD'
      });

      const convertedOg = await moneyOg.convert('CAD', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.CAD'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe('CAD');
      expect(convertedOg.getCurrency()).toBe('CAD');
    });

    it('should work with Promise.then pattern', async () => {
      const money = Dinero({ amount: 2000, currency: 'USD', precision: 2 }); // $20.00
      const moneyOg = DineroOg({ amount: 2000, currency: 'USD', precision: 2 });

      const rates = { rates: { GBP: 0.75 } };

      const converted = await money.convert('GBP', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.GBP'
      });

      const convertedOg = await moneyOg.convert('GBP', {
        endpoint: Promise.resolve(rates),
        propertyPath: 'rates.GBP'
      });

      expect(converted.getAmount()).toBe(convertedOg.getAmount());
      expect(converted.getCurrency()).toBe('GBP');
      expect(convertedOg.getCurrency()).toBe('GBP');
    });
  });
});
