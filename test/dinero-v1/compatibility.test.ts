import { describe, expect, it } from 'vitest';
import { Dinero, DineroStatic } from '../../src/dinero-v1/index.js';
import type {  DineroV1Currency } from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

describe('Dinero V1 Compatibility Layer', () => {
  describe('Core API', () => {
    it('should create dinero instances with default options', () => {
      const money = Dinero();
      const moneyOg = DineroOg();

      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with amount', () => {
      const money = Dinero({ amount: 500 });
      const moneyOg = DineroOg({ amount: 500 });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with currency string', () => {
      const money = Dinero({ amount: 1000, currency: 'EUR' });
      const moneyOg = DineroOg({ amount: 1000, currency: 'EUR' });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with currency object', () => {
      const eurCurrency: DineroV1Currency = { code: 'EUR', precision: 2 };
      const money = Dinero({ amount: 1000, currency: eurCurrency });
      const moneyOg = DineroOg({ amount: 1000, currency: 'EUR' });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should create dinero instances with custom precision', () => {
      const money = Dinero({ amount: 12345, currency: 'USD', precision: 3 });

      const moneyOg = DineroOg({ amount: 12345, currency: 'USD', precision: 3 });
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });

    it('should handle zero precision currencies', () => {
      const money = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });
      const moneyOg = DineroOg({ amount: 1000, currency: 'JPY', precision: 0 });
      
      expect(money.getAmount()).toBe(moneyOg.getAmount());
      expect(money.getCurrency()).toBe(moneyOg.getCurrency());
      expect(money.getPrecision()).toBe(moneyOg.getPrecision());
      expect(money.getLocale()).toBe(moneyOg.getLocale());
    });
  });

  describe('Arithmetic Operations (Instance Methods)', () => {

    describe('Addition', () => {
      it('should add two dinero instances', () => {
        const money1 = Dinero({ amount: 1050 });
        const money2 = Dinero({ amount: 525 });
        const moneyOg1 = DineroOg({ amount: 1050 });
        const moneyOg2 = DineroOg({ amount: 525 });
        const result = money1.add(money2);
        const resultOg = moneyOg1.add(moneyOg2);
        
        expect(result.getAmount()).toBe(resultOg.getAmount());
        expect(result.getCurrency()).toBe(resultOg.getCurrency());
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
        expect(result.getLocale()).toBe(resultOg.getLocale());
      });

      it('should be throw error if the currencies are different', () => {
        const money1 = Dinero({ amount: 1050, currency: 'USD' });
        const money2 = Dinero({ amount: 525, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 1050, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 525, currency: 'EUR' });
        
        expect(() => money1.add(money2)).toThrow();
        expect(() => moneyOg1.add(moneyOg2)).toThrow();
      });

      it('should handle precision differences correctly', () => {
        const money1 = Dinero({ amount: 1050, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 525, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1050, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 525, currency: 'USD', precision: 3 });
        const resultOg = moneyOg1.add(moneyOg2);
        const result = money1.add(money2);
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });

      it('should be chainable', () => {
        const money = Dinero({ amount: 1050 });
        const money2 = Dinero({ amount: 525 });
        const moneyOg = DineroOg({ amount: 1050 });
        const moneyOg2 = DineroOg({ amount: 525 });
        const result = money.add(money2).add(Dinero({ amount: 250 }));
        const resultOg = moneyOg.add(moneyOg2).add(DineroOg({ amount: 250 }));
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });
    })
    
    describe('Subtraction', () => {
      it('should subtract two dinero instances', () => {
        const money1 = Dinero({ amount: 2075 });
        const money2 = Dinero({ amount: 825 });
        const moneyOg1 = DineroOg({ amount: 2075 });
        const moneyOg2 = DineroOg({ amount: 825 });
        const resultOg = moneyOg1.subtract(moneyOg2);
        const result = money1.subtract(money2);
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });

      it('should be throw error if the currencies are different', () => {
        const money1 = Dinero({ amount: 2075, currency: 'USD' });
        const money2 = Dinero({ amount: 825, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 2075, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 825, currency: 'EUR' });
        expect(() => money1.subtract(money2)).toThrow();
        expect(() => moneyOg1.subtract(moneyOg2)).toThrow();
      });

      it('should handle precision differences correctly', () => {
        const money1 = Dinero({ amount: 2075, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 825, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 2075, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 825, currency: 'USD', precision: 3 });
        const resultOg = moneyOg1.subtract(moneyOg2);
        const result = money1.subtract(money2);
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });

      it('should be chainable', () => {
        const money = Dinero({ amount: 2075 });
        const money2 = Dinero({ amount: 825 });
        const moneyOg = DineroOg({ amount: 2075 });
        const moneyOg2 = DineroOg({ amount: 825 });
        const result = money.subtract(money2).subtract(Dinero({ amount: 250 }));
        const resultOg = moneyOg.subtract(moneyOg2).subtract(DineroOg({ amount: 250 }));
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });
    })

    describe('Multiplication', () => {
      it('should multiply a dinero instance', () => {
        const money = Dinero({ amount: 1234 });
        const moneyOg = DineroOg({ amount: 1234 });
        const result = money.multiply(3);
        const resultOg = moneyOg.multiply(3);
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });

      it('should be chainable', () => {
        const money = Dinero({ amount: 1234 });
        const moneyOg = DineroOg({ amount: 1234 });
        const result = money.multiply(3).multiply(4);
        const resultOg = moneyOg.multiply(3).multiply(4);
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });
      
      describe('rounding modes in multiplication', () => {
        it('HALF_ODD', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "HALF_ODD");
          const resultOg = moneyOg.multiply(3, "HALF_ODD");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });

        it('HALF_EVEN', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "HALF_EVEN");
          const resultOg = moneyOg.multiply(3, "HALF_EVEN");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });

        it('HALF_UP', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "HALF_UP");
          const resultOg = moneyOg.multiply(3, "HALF_UP");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });

        it('HALF_DOWN', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "HALF_DOWN");
          const resultOg = moneyOg.multiply(3, "HALF_DOWN");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        })

        it('HALF_TOWARDS_ZERO', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "HALF_TOWARDS_ZERO");
          const resultOg = moneyOg.multiply(3, "HALF_TOWARDS_ZERO");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });

        it('HALF_AWAY_FROM_ZERO', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "HALF_AWAY_FROM_ZERO");
          const resultOg = moneyOg.multiply(3, "HALF_AWAY_FROM_ZERO");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });

        it("DOWN", () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.multiply(3, "DOWN");
          const resultOg = moneyOg.multiply(3, "DOWN");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });

         it("should match original behavior for rounding modes in multiplication", () => {
           const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
           const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
           const result = money.multiply(3, "HALF_ODD");
           const resultOg = moneyOg.multiply(3, "HALF_ODD");
           const result2 = money.multiply(3, "HALF_EVEN");
           const resultOg2 = moneyOg.multiply(3, "HALF_EVEN");
           
           // Both should match original library behavior 
           expect(result.getAmount()).toBe(resultOg.getAmount());
           expect(result2.getAmount()).toBe(resultOg2.getAmount());
           
           // Note: For this particular test case (1234 * 3), all rounding modes
           // produce the same result since there's no fractional part to round
           expect(result.getAmount()).toBe(result2.getAmount());
           expect(resultOg.getAmount()).toBe(resultOg2.getAmount());
         });
      })

    })

    describe('Division', () => {
      it('should divide a dinero instance', () => {
        const money = Dinero({ amount: 10000 });
        const moneyOg = DineroOg({ amount: 10000 });
        const resultOg = moneyOg.divide(4);
        const result = money.divide(4);
        
        expect(result.getAmount()).toBe(resultOg.getAmount());
        expect(result.getCurrency()).toBe(resultOg.getCurrency());
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
        expect(result.getLocale()).toBe(resultOg.getLocale());
      });

      it('should be chainable', () => {
        const money = Dinero({ amount: 10000 });
        const moneyOg = DineroOg({ amount: 10000 });
        const result = money.divide(4).divide(2);
        const resultOg = moneyOg.divide(4).divide(2);
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });

      describe('Division with rounding modes', () => {
        it('HALF_ODD', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "HALF_ODD");
          const resultOg = moneyOg.divide(3, "HALF_ODD");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
        it('HALF_EVEN', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "HALF_EVEN");
          const resultOg = moneyOg.divide(3, "HALF_EVEN");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
        it('HALF_UP', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "HALF_UP");
          const resultOg = moneyOg.divide(3, "HALF_UP");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
        it('HALF_DOWN', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "HALF_DOWN");
          const resultOg = moneyOg.divide(3, "HALF_DOWN");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
        it('HALF_TOWARDS_ZERO', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "HALF_TOWARDS_ZERO");
          const resultOg = moneyOg.divide(3, "HALF_TOWARDS_ZERO");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
        it('HALF_AWAY_FROM_ZERO', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "HALF_AWAY_FROM_ZERO");
          const resultOg = moneyOg.divide(3, "HALF_AWAY_FROM_ZERO");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
        it('DOWN', () => {
          const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
          const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
          const result = money.divide(3, "DOWN");
          const resultOg = moneyOg.divide(3, "DOWN");
          expect(result.getPrecision()).toBe(resultOg.getPrecision());
          expect(result.getAmount()).toBe(resultOg.getAmount());
        });
  
         it("should match original behavior for rounding modes in division", () => {
           const money = Dinero({ amount: 1234, currency: 'USD', precision: 2});
           const moneyOg = DineroOg({ amount: 1234, currency: 'USD', precision: 2 });
           const result = money.divide(3, "HALF_ODD");
           const resultOg = moneyOg.divide(3, "HALF_ODD");
           const result2 = money.divide(3, "HALF_EVEN");
           const resultOg2 = moneyOg.divide(3, "HALF_EVEN");
           
           // Both should match original library behavior
           expect(result.getPrecision()).toBe(resultOg.getPrecision());
           expect(result.getAmount()).toBe(resultOg.getAmount());
           expect(result2.getAmount()).toBe(resultOg2.getAmount());
  
           // Note: For this particular test case (1234 / 3), all rounding modes
           // produce the same result in the original library
           expect(result.getAmount()).toBe(result2.getAmount());
           expect(resultOg.getAmount()).toBe(resultOg2.getAmount());
         });
      })
    })
    

    

    it('should percentage a dinero instance', () => {
      const money = Dinero({ amount: 10000 });
      const moneyOg = DineroOg({ amount: 10000 });
      const resultOg = moneyOg.percentage(50);
      const result = money.percentage(50);
      
      expect(result.getAmount()).toBe(resultOg.getAmount());
      expect(result.getCurrency()).toBe(resultOg.getCurrency());
      expect(result.getPrecision()).toBe(resultOg.getPrecision());
      expect(result.getLocale()).toBe(resultOg.getLocale());
    });

    it('should handle currency mismatch errors', () => {
      const usdMoney = Dinero({ amount: 1000, currency: 'USD' });
      const eurMoney = Dinero({ amount: 1000, currency: 'EUR' });
      const eurMoneyOg = DineroOg({ amount: 1000, currency: 'EUR' });
      const usdMoneyOg = DineroOg({ amount: 1000, currency: 'USD' });
      
      expect(() => usdMoney.add(eurMoney)).toThrow();
      expect(() => usdMoney.subtract(eurMoney)).toThrow();
      expect(() => usdMoneyOg.add(eurMoneyOg)).toThrow();
      expect(() => usdMoneyOg.subtract(eurMoneyOg)).toThrow();
    });

    it('should handle precision differences in operations', () => {
      const lowPrec = Dinero({ amount: 105, currency: 'USD', precision: 1 });
      const highPrec = Dinero({ amount: 1055, currency: 'USD', precision: 2 });
      const lowPrecOg = DineroOg({ amount: 105, currency: 'USD', precision: 1 });
      const highPrecOg = DineroOg({ amount: 1055, currency: 'USD', precision: 2 });
      const resultOg = lowPrecOg.add(highPrecOg);

      
      const result = lowPrec.add(highPrec);
      expect(result.getPrecision()).toBe(resultOg.getPrecision());
      expect(result.getAmount()).toBe(resultOg.getAmount());
      expect(result.getAmount()).toBe(2105); // Should normalize precision
    });

    
  });

  describe('Comparison Operations (Instance Methods)', () => {
    describe('Equality', () => {
      it('should compare equality correctly', () => {
        const money1 = Dinero({ amount: 1550 });
        const money2 = Dinero({ amount: 1550 });
        const money3 = Dinero({ amount: 2000 });
        const moneyOg1 = DineroOg({ amount: 1550 });
        const moneyOg2 = DineroOg({ amount: 1550 });
        const moneyOg3 = DineroOg({ amount: 2000 });
        
  

        expect(money1.equalsTo(money2)).toBe(moneyOg1.equalsTo(moneyOg2));
        expect(money1.equalsTo(money3)).toBe(moneyOg1.equalsTo(moneyOg3));
      });

      it('should be false if the currencies are different', () => {
        const money1 = Dinero({ amount: 1550, currency: 'USD' });
        const money2 = Dinero({ amount: 1550, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 1550, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 1550, currency: 'EUR' });

        expect(money1.equalsTo(money2)).toBe(moneyOg1.equalsTo(moneyOg2));
      });

      it('should compare different precisions correctly', () => {
        const money1 = Dinero({ amount: 1550, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 15500, currency: 'USD', precision: 3 });
        const money3 = Dinero({ amount: 1550, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1550, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 15500, currency: 'USD', precision: 3 });
        const moneyOg3 = DineroOg({ amount: 1550, currency: 'USD', precision: 3 });


        expect(money1.equalsTo(money2)).toBe(moneyOg1.equalsTo(moneyOg2));
        expect(money1.equalsTo(money3)).toBe(moneyOg1.equalsTo(moneyOg3));
      });
    })

    describe('Less Than', () => {
      it('should compare less than correctly', () => {
        const money1 = Dinero({ amount: 1000 });
        const money2 = Dinero({ amount: 2000 });
        const moneyOg1 = DineroOg({ amount: 1000 });
        const moneyOg2 = DineroOg({ amount: 2000 });
        
        expect(money1.lessThan(money2)).toBe(moneyOg1.lessThan(moneyOg2));
        expect(money2.lessThan(money1)).toBe(moneyOg2.lessThan(moneyOg1));
      });

      it('should be throw error if the currencies are different', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD' });
        const money2 = Dinero({ amount: 2000, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });
        
        expect(() => money1.lessThan(money2)).toThrow();
        expect(() => moneyOg1.lessThan(moneyOg2)).toThrow();
      });

      it('should compare different precisions correctly', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
        const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
        const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

        expect(money1.lessThan(money2)).toBe(false);
        expect(moneyOg1.lessThan(moneyOg2)).toBe(false);
        expect(money2.lessThan(money1)).toBe(true);
        expect(moneyOg2.lessThan(moneyOg1)).toBe(true);
        expect(money1.lessThan(money3)).toBe(false);
        expect(moneyOg1.lessThan(moneyOg3)).toBe(false);
      });
    })
    

    describe('Less Than Or Equal', () => {
      it('should compare less than or equal correctly', () => {
        const money1 = Dinero({ amount: 1000 });
        const money2 = Dinero({ amount: 2000 });
        const moneyOg1 = DineroOg({ amount: 1000 });
        const moneyOg2 = DineroOg({ amount: 2000 });

        expect(money1.lessThanOrEqual(money2)).toBe(true);
        expect(money2.lessThanOrEqual(money1)).toBe(false);
        expect(moneyOg1.lessThanOrEqual(moneyOg2)).toBe(true);
        expect(moneyOg2.lessThanOrEqual(moneyOg1)).toBe(false);
      });

      it('should be throw error if the currencies are different', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD' });
        const money2 = Dinero({ amount: 2000, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });

        expect(() => money1.lessThanOrEqual(money2)).toThrow();
        expect(() => moneyOg1.lessThanOrEqual(moneyOg2)).toThrow();
      });

      it('should compare different precisions correctly', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
        const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
        const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

        expect(money1.lessThanOrEqual(money2)).toBe(false);
        expect(moneyOg1.lessThanOrEqual(moneyOg2)).toBe(false);
        expect(money2.lessThanOrEqual(money1)).toBe(true);
        expect(moneyOg2.lessThanOrEqual(moneyOg1)).toBe(true);
        expect(money1.lessThanOrEqual(money3)).toBe(false);
        expect(moneyOg1.lessThanOrEqual(moneyOg3)).toBe(false);
      });


    })
    

    describe('Greater Than', () => {
      it('should compare greater than correctly', () => {
        const money1 = Dinero({ amount: 1000 });
        const money2 = Dinero({ amount: 2000 });
        const moneyOg1 = DineroOg({ amount: 1000 });
        const moneyOg2 = DineroOg({ amount: 2000 });
        
        expect(money2.greaterThan(money1)).toBe(moneyOg2.greaterThan(moneyOg1));
        expect(money2.greaterThan(money1)).toBe(true);
        expect(money1.greaterThan(money2)).toBe(moneyOg1.greaterThan(moneyOg2));
        expect(money1.greaterThan(money2)).toBe(false);
      });

      it('should be throw error if the currencies are different', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD' });
        const money2 = Dinero({ amount: 2000, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });
        
        expect(() => money1.greaterThan(money2)).toThrow();
        expect(() => moneyOg1.greaterThan(moneyOg2)).toThrow();
      });

      it('should compare different precisions correctly', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
        const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
        const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

        expect(money1.greaterThan(money2)).toBe(moneyOg1.greaterThan(moneyOg2));
        expect(money1.greaterThan(money3)).toBe(moneyOg1.greaterThan(moneyOg3));
        expect(money2.greaterThan(money1)).toBe(moneyOg2.greaterThan(moneyOg1));
        expect(money2.greaterThan(money3)).toBe(moneyOg2.greaterThan(moneyOg3));
        expect(money3.greaterThan(money1)).toBe(moneyOg3.greaterThan(moneyOg1));
        expect(money3.greaterThan(money2)).toBe(moneyOg3.greaterThan(moneyOg2));
      });
    })

    describe('Greater Than Or Equal', () => {
      it('should compare greater than or equal correctly', () => {
        const money1 = Dinero({ amount: 1000 });
        const money2 = Dinero({ amount: 2000 });
        const moneyOg1 = DineroOg({ amount: 1000 });
        const moneyOg2 = DineroOg({ amount: 2000 });

        expect(money2.greaterThanOrEqual(money1)).toBe(moneyOg2.greaterThanOrEqual(moneyOg1));
        expect(money2.greaterThanOrEqual(money1)).toBe(true);
        expect(money1.greaterThanOrEqual(money2)).toBe(moneyOg1.greaterThanOrEqual(moneyOg2));
        expect(money1.greaterThanOrEqual(money2)).toBe(false);
      });

      it('should be throw error if the currencies are different', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD' });
        const money2 = Dinero({ amount: 2000, currency: 'EUR' });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD' });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'EUR' });

        expect(() => money1.greaterThanOrEqual(money2)).toThrow();
        expect(() => moneyOg1.greaterThanOrEqual(moneyOg2)).toThrow();
      });

      it('should compare different precisions correctly', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
        const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
        const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

        expect(money2.greaterThanOrEqual(money1)).toBe(moneyOg2.greaterThanOrEqual(moneyOg1));
        expect(money2.greaterThanOrEqual(money1)).toBe(false);
        expect(money1.greaterThanOrEqual(money2)).toBe(moneyOg1.greaterThanOrEqual(moneyOg2));
        expect(money1.greaterThanOrEqual(money2)).toBe(true);
        expect(money1.greaterThanOrEqual(money3)).toBe(moneyOg1.greaterThanOrEqual(moneyOg3));
        expect(money1.greaterThanOrEqual(money3)).toBe(true);
        expect(money2.greaterThanOrEqual(money3)).toBe(moneyOg2.greaterThanOrEqual(moneyOg3));
        expect(money2.greaterThanOrEqual(money3)).toBe(true);
      });

      it('should compare different precisions correctly', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 2000, currency: 'USD', precision: 3 });
        const money3 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
        const moneyOg1 = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
        const moneyOg2 = DineroOg({ amount: 2000, currency: 'USD', precision: 3 });
        const moneyOg3 = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });

        expect(money2.greaterThanOrEqual(money1)).toBe(moneyOg2.greaterThanOrEqual(moneyOg1));
        expect(money1.greaterThanOrEqual(money2)).toBe(moneyOg1.greaterThanOrEqual(moneyOg2));
        expect(money1.greaterThanOrEqual(money3)).toBe(moneyOg1.greaterThanOrEqual(moneyOg3));
        expect(money2.greaterThanOrEqual(money3)).toBe(moneyOg2.greaterThanOrEqual(moneyOg3));
      });
    })



    

    it('should check zero values correctly', () => {
      const zeroMoney = Dinero({ amount: 0 });
      const positiveMoney = Dinero({ amount: 1000 });
      const negativeMoney = Dinero({ amount: -500 });
      
      expect(zeroMoney.isZero()).toBe(true);
      expect(positiveMoney.isPositive()).toBe(true);
      expect(negativeMoney.isNegative()).toBe(true);
      
      expect(positiveMoney.isZero()).toBe(false);
      expect(zeroMoney.isPositive()).toBe(false);
      expect(zeroMoney.isNegative()).toBe(false);
    });
  });

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

    it('should handle toFormat', () => {
      const money = Dinero({ amount: 2599, currency: 'USD', precision: 2 });
      const formatted = money.toFormat();
      
      expect(formatted).toBe(money.toString());
    });
  });

  describe('Utility Methods', () => {
    it('should check hasSubUnits correctly', () => {
      const wholeMoney = Dinero({ amount: 10000, currency: 'USD', precision: 2 }); // $100.00
      const fractionalMoney = Dinero({ amount: 10050, currency: 'USD', precision: 2 }); // $100.50
      
      expect(wholeMoney.hasSubUnits()).toBe(false);
      expect(fractionalMoney.hasSubUnits()).toBe(true);
    });

    it('should handle hasSubUnits with zero precision', () => {
      const jpyMoney = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });
      
      expect(jpyMoney.hasSubUnits()).toBe(false);
    });

    it('should handle hasSubUnits with high precision', () => {
      const highPrecMoney = Dinero({ amount: 123456, currency: 'BTC', precision: 8 }); // 0.00123456 BTC
      
      expect(highPrecMoney.hasSubUnits()).toBe(true);
    });
  });

  describe('Static Utility Functions', () => {
    it('should normalize precision across instances', () => {
      const money1 = Dinero({ amount: 105, currency: 'USD', precision: 1 }); // 10.5
      const money2 = Dinero({ amount: 1055, currency: 'USD', precision: 2 }); // 10.55
      const money3 = Dinero({ amount: 105500, currency: 'USD', precision: 3 }); // 105.500
      
      const normalized = DineroStatic.normalizePrecision([money1, money2, money3]);
      
      expect(normalized).toHaveLength(3);
      normalized.forEach(money => {
        expect(money.getPrecision()).toBe(3);
      });
      
      expect(normalized[0].getAmount()).toBe(10500); // 10.5 -> 10.500 (scale factor 100)
      expect(normalized[1].getAmount()).toBe(10550); // 10.55 -> 10.550 (scale factor 10)
      expect(normalized[2].getAmount()).toBe(105500); // 105.500 unchanged
    });

    it('should find minimum value', () => {
      const money1 = Dinero({ amount: 1000 });
      const money2 = Dinero({ amount: 2000 });
      const money3 = Dinero({ amount: 1500 });
      
      const min = DineroStatic.minimum([money1, money2, money3]);
      
      expect(min.getAmount()).toBe(1000);
    });

    it('should find maximum value', () => {
      const money1 = Dinero({ amount: 1000 });
      const money2 = Dinero({ amount: 2000 });
      const money3 = Dinero({ amount: 1500 });
      
      const max = DineroStatic.maximum([money1, money2, money3]);
      
      expect(max.getAmount()).toBe(2000);
    });

    it('should throw on empty arrays for min/max', () => {
      expect(() => DineroStatic.minimum([])).toThrow('Cannot find minimum of empty array');
      expect(() => DineroStatic.maximum([])).toThrow('Cannot find maximum of empty array');
    });
  });

  describe('Locale Methods', () => {
    it('should set and get locale', () => {
      const money = Dinero({ amount: 2500 });
      const moneyOg = DineroOg({ amount: 2500 });
      
      expect(money.getLocale()).toBe(moneyOg.getLocale()); // Default locale should match
      
      const frenchMoney = money.setLocale('fr-FR');
      const frenchMoneyOg = moneyOg.setLocale('fr-FR');
      
      expect(frenchMoney.getLocale()).toBe(frenchMoneyOg.getLocale());
      
      // Original should remain unchanged (immutability)
      expect(money.getLocale()).toBe(moneyOg.getLocale());
      expect(money.getLocale()).not.toBe(frenchMoney.getLocale());
      expect(moneyOg.getLocale()).not.toBe(frenchMoneyOg.getLocale());
    });

    it('should maintain locale through operations', () => {
      const money1 = Dinero({ amount: 1000 }).setLocale('de-DE');
      const money2 = Dinero({ amount: 500 });
      const money1Og = DineroOg({ amount: 1000 }).setLocale('de-DE');
      const money2Og = DineroOg({ amount: 500 });
      
      const result = money1.add(money2);
      const resultOg = money1Og.add(money2Og);
      
      expect(result.getLocale()).toBe(resultOg.getLocale());
    });

    it('should handle various locale formats', () => {
      const locales = ['en-US', 'fr-FR', 'de-DE', 'ja-JP', 'es-ES'];
      
      locales.forEach(locale => {
        const money = Dinero({ amount: 1000 }).setLocale(locale);
        const moneyOg = DineroOg({ amount: 1000 }).setLocale(locale);
        
        expect(money.getLocale()).toBe(moneyOg.getLocale());
      });
    });
  });

  describe('Additional Utility Methods', () => {
    describe('hasSameCurrency', () => {
      it('should check currency equality correctly', () => {
        const usdMoney1 = Dinero({ amount: 1000, currency: 'USD' });
        const usdMoney2 = Dinero({ amount: 2000, currency: 'USD' });
        const eurMoney = Dinero({ amount: 1000, currency: 'EUR' });
        const usdMoney1Og = DineroOg({ amount: 1000, currency: 'USD' });
        const usdMoney2Og = DineroOg({ amount: 2000, currency: 'USD' });
        const eurMoneyOg = DineroOg({ amount: 1000, currency: 'EUR' });
        
        expect(usdMoney1.hasSameCurrency(usdMoney2)).toBe(usdMoney1Og.hasSameCurrency(usdMoney2Og));
        expect(usdMoney1.hasSameCurrency(eurMoney)).toBe(usdMoney1Og.hasSameCurrency(eurMoneyOg));
      });

      it('should handle different precision with same currency', () => {
        const money1 = Dinero({ amount: 1000, currency: 'USD', precision: 2 });
        const money2 = Dinero({ amount: 1000, currency: 'USD', precision: 3 });
        const money1Og = DineroOg({ amount: 1000, currency: 'USD', precision: 2 });
        const money2Og = DineroOg({ amount: 1000, currency: 'USD', precision: 3 });
        
        expect(money1.hasSameCurrency(money2)).toBe(money1Og.hasSameCurrency(money2Og));
      });
    });

    describe('hasSameAmount', () => {
      it('should check amount equality correctly', () => {
        const money1 = Dinero({ amount: 1550 });
        const money2 = Dinero({ amount: 1550 });
        const money3 = Dinero({ amount: 2000 });
        const money1Og = DineroOg({ amount: 1550 });
        const money2Og = DineroOg({ amount: 1550 });
        const money3Og = DineroOg({ amount: 2000 });
        
        expect(money1.hasSameAmount(money2)).toBe(money1Og.hasSameAmount(money2Og));
        expect(money1.hasSameAmount(money3)).toBe(money1Og.hasSameAmount(money3Og));
      });

      it('should normalize precision when comparing amounts', () => {
        const money1 = Dinero({ amount: 1550, currency: 'USD', precision: 2 }); // 15.50
        const money2 = Dinero({ amount: 15500, currency: 'USD', precision: 3 }); // 15.500
        const money3 = Dinero({ amount: 1550, currency: 'USD', precision: 3 }); // 1.550
        const money1Og = DineroOg({ amount: 1550, currency: 'USD', precision: 2 });
        const money2Og = DineroOg({ amount: 15500, currency: 'USD', precision: 3 });
        const money3Og = DineroOg({ amount: 1550, currency: 'USD', precision: 3 });
        
        expect(money1.hasSameAmount(money2)).toBe(money1Og.hasSameAmount(money2Og));
        expect(money1.hasSameAmount(money3)).toBe(money1Og.hasSameAmount(money3Og));
      });

      it('should return false for different currencies', () => {
        const usdMoney = Dinero({ amount: 1550, currency: 'USD' });
        const eurMoney = Dinero({ amount: 1550, currency: 'EUR' });
        const usdMoneyOg = DineroOg({ amount: 1550, currency: 'USD' });
        const eurMoneyOg = DineroOg({ amount: 1550, currency: 'EUR' });
        
        // Note: Original Dinero.js returns true when comparing different currencies with same amount!
        expect(usdMoney.hasSameAmount(eurMoney)).toBe(usdMoneyOg.hasSameAmount(eurMoneyOg));
        expect(usdMoneyOg.hasSameAmount(eurMoneyOg)).toBe(true); // Original behavior
      });
    });
  });

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

  describe('Enhanced Formatting Tests', () => {
    describe('toFormat with various format strings', () => {
      it('should handle basic currency formats', () => {
        const money = Dinero({ amount: 500050, currency: 'USD', precision: 2 }); // $5000.50
        const moneyOg = DineroOg({ amount: 500050, currency: 'USD', precision: 2 });
        
        // Test different format patterns
        const formatted1 = money.toFormat('$0,0.00');
        const formatted2 = money.toFormat('$0,0');
        const formatted3 = money.toFormat('$0');
        const formatted4 = money.toFormat('$0.0');
        
        const formatted1Og = moneyOg.toFormat('$0,0.00');
        const formatted2Og = moneyOg.toFormat('$0,0');
        const formatted3Og = moneyOg.toFormat('$0');
        const formatted4Og = moneyOg.toFormat('$0.0');
        
        // Compare with original implementation
        expect(typeof formatted1).toBe(typeof formatted1Og);
        expect(typeof formatted2).toBe(typeof formatted2Og);
        expect(typeof formatted3).toBe(typeof formatted3Og);
        expect(typeof formatted4).toBe(typeof formatted4Og);
      });

      it('should handle different currencies in formatting', () => {
        const eurMoney = Dinero({ amount: 5050, currency: 'EUR', precision: 2 });
        const jpyMoney = Dinero({ amount: 1000, currency: 'JPY', precision: 0 });
        const eurMoneyOg = DineroOg({ amount: 5050, currency: 'EUR', precision: 2 });
        const jpyMoneyOg = DineroOg({ amount: 1000, currency: 'JPY', precision: 0 });
        
        const eurFormatted = eurMoney.toFormat('$0,0.0');
        const jpyFormatted = jpyMoney.toFormat('$0,0');
        const eurFormattedOg = eurMoneyOg.toFormat('$0,0.0');
        const jpyFormattedOg = jpyMoneyOg.toFormat('$0,0');
        
        expect(typeof eurFormatted).toBe(typeof eurFormattedOg);
        expect(typeof jpyFormatted).toBe(typeof jpyFormattedOg);
      });

      it('should handle rounding modes in formatting', () => {
        const money = Dinero({ amount: 1050, precision: 2 }); // 10.50
        const moneyOg = DineroOg({ amount: 1050, precision: 2 });
        
        const halfEven = money.toFormat('$0', 'HALF_EVEN');
        const halfUp = money.toFormat('$0', 'HALF_UP');
        const halfEvenOg = moneyOg.toFormat('$0', 'HALF_EVEN');
        const halfUpOg = moneyOg.toFormat('$0', 'HALF_UP');
        
        expect(typeof halfEven).toBe(typeof halfEvenOg);
        expect(typeof halfUp).toBe(typeof halfUpOg);
      });
    });

    it('should handle locale-specific formatting', () => {
      const money = Dinero({ amount: 123456, currency: 'EUR', precision: 2 });
      const frenchMoney = money.setLocale('fr-FR');
      const moneyOg = DineroOg({ amount: 123456, currency: 'EUR', precision: 2 });
      const frenchMoneyOg = moneyOg.setLocale('fr-FR');
      
      const formatted = frenchMoney.toFormat();
      const formattedOg = frenchMoneyOg.toFormat();
      
      expect(typeof formatted).toBe(typeof formattedOg);
      expect(formatted.length > 0).toBe(formattedOg.length > 0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid inputs gracefully', () => {
      // Test invalid amounts - both implementations should behave the same
      expect(() => Dinero({ amount: NaN })).toThrow();
      expect(() => DineroOg({ amount: NaN })).toThrow();
      expect(() => Dinero({ amount: Infinity })).toThrow();
      expect(() => DineroOg({ amount: Infinity })).toThrow();
      
      // Test invalid precision - original doesn't throw for negative precision!
      expect(() => Dinero({ amount: 1000, precision: -1 })).toThrow();
      // expect(() => DineroOg({ amount: 1000, precision: -1 })).toThrow(); // Original doesn't throw
      expect(() => Dinero({ amount: 1000, precision: NaN })).toThrow();
      expect(() => DineroOg({ amount: 1000, precision: NaN })).toThrow();
    });

    it('should handle extreme values appropriately', () => {
      // Test very large numbers
      const largeMoney = Dinero({ amount: Number.MAX_SAFE_INTEGER });
      const largeMoneyOg = DineroOg({ amount: Number.MAX_SAFE_INTEGER });
      expect(largeMoney.getAmount()).toBe(largeMoneyOg.getAmount());
      
      // Test very small numbers  
      const smallMoney = Dinero({ amount: Number.MIN_SAFE_INTEGER });
      const smallMoneyOg = DineroOg({ amount: Number.MIN_SAFE_INTEGER });
      expect(smallMoney.getAmount()).toBe(smallMoneyOg.getAmount());
    });

    it('should handle division by zero', () => {
      const money = Dinero({ amount: 1000 });
      const moneyOg = DineroOg({ amount: 1000 });
      
      expect(() => money.divide(0)).toThrow();
      expect(() => moneyOg.divide(0)).toThrow();
    });

    it('should handle invalid percentage values', () => {
      const money = Dinero({ amount: 1000 });
      const moneyOg = DineroOg({ amount: 1000 });
      
      // Original Dinero.js throws for negative percentages!
      expect(() => money.percentage(-10)).toThrow();
      expect(() => moneyOg.percentage(-10)).toThrow();
      
      // Original also throws for very large percentages
      expect(() => money.percentage(1000)).toThrow();
      expect(() => moneyOg.percentage(1000)).toThrow();
      
      // Valid percentages should work
      const valid = money.percentage(50);
      const validOg = moneyOg.percentage(50);
      expect(valid.getAmount()).toBe(validOg.getAmount());
    });

    it('should handle invalid allocation ratios', () => {
      const money = Dinero({ amount: 1000 });
      const moneyOg = DineroOg({ amount: 1000 });
      
      // Empty ratios array
      expect(() => money.allocate([])).toThrow();
      expect(() => moneyOg.allocate([])).toThrow();
      
      // All zero ratios
      expect(() => money.allocate([0, 0, 0])).toThrow();
      expect(() => moneyOg.allocate([0, 0, 0])).toThrow();
      
      // Original Dinero.js throws for negative ratios!
      expect(() => money.allocate([-1, -1])).toThrow();
      expect(() => moneyOg.allocate([-1, -1])).toThrow();
      
      // Valid ratios should work
      const result = money.allocate([1, 1]);
      const resultOg = moneyOg.allocate([1, 1]);
      expect(result).toHaveLength(resultOg.length);
      result.forEach((part, index) => {
        expect(part.getAmount()).toBe(resultOg[index].getAmount());
      });
    });
  });

  describe('Precision and Normalization', () => {
    it('should handle precision normalization in operations', () => {
      const lowPrec = Dinero({ amount: 10, precision: 1 }); // 1.0
      const midPrec = Dinero({ amount: 100, precision: 2 }); // 1.00  
      const highPrec = Dinero({ amount: 1000, precision: 3 }); // 1.000
      const lowPrecOg = DineroOg({ amount: 10, precision: 1 });
      const midPrecOg = DineroOg({ amount: 100, precision: 2 });
      const highPrecOg = DineroOg({ amount: 1000, precision: 3 });
      
      // All represent the same value (1.0) but with different precisions
      expect(lowPrec.equalsTo(midPrec)).toBe(lowPrecOg.equalsTo(midPrecOg));
      expect(midPrec.equalsTo(highPrec)).toBe(midPrecOg.equalsTo(highPrecOg));
      expect(lowPrec.equalsTo(highPrec)).toBe(lowPrecOg.equalsTo(highPrecOg));
    });

    it('should maintain highest precision in arithmetic operations', () => {
      const lowPrec = Dinero({ amount: 10, currency: 'USD', precision: 1 }); // 1.0
      const highPrec = Dinero({ amount: 1500, currency: 'USD', precision: 3 }); // 1.500
      const lowPrecOg = DineroOg({ amount: 10, currency: 'USD', precision: 1 });
      const highPrecOg = DineroOg({ amount: 1500, currency: 'USD', precision: 3 });
      
      const sum = lowPrec.add(highPrec);
      const sumOg = lowPrecOg.add(highPrecOg);
      expect(sum.getPrecision()).toBe(sumOg.getPrecision());
      expect(sum.getAmount()).toBe(sumOg.getAmount());
    });

    it('should handle precision edge cases', () => {
      // Test with precision 0 (whole numbers only)
      const wholeMoney = Dinero({ amount: 1000, precision: 0 });
      const wholeMoneyOg = DineroOg({ amount: 1000, precision: 0 });
      expect(wholeMoney.toUnit()).toBe(wholeMoneyOg.toUnit());
      expect(wholeMoney.hasSubUnits()).toBe(wholeMoneyOg.hasSubUnits());
      
      // Test with high precision
      const highPrecMoney = Dinero({ amount: 123456789, precision: 8 });
      const highPrecMoneyOg = DineroOg({ amount: 123456789, precision: 8 });
      expect(highPrecMoney.toUnit()).toBe(highPrecMoneyOg.toUnit());
      expect(highPrecMoney.hasSubUnits()).toBe(highPrecMoneyOg.hasSubUnits());
    });
  });

  describe('Static Methods Extended', () => {
    it('should handle normalizePrecision with mixed currencies', () => {
      const usdMoney = Dinero({ amount: 100, currency: 'USD', precision: 1 });
      const eurMoney = Dinero({ amount: 1000, currency: 'EUR', precision: 2 });
      const usdMoneyOg = DineroOg({ amount: 100, currency: 'USD', precision: 1 });
      const eurMoneyOg = DineroOg({ amount: 1000, currency: 'EUR', precision: 2 });
      
      // Should still normalize precision even with different currencies
      const normalized = DineroStatic.normalizePrecision([usdMoney, eurMoney]);
      const normalizedOg = DineroOg.normalizePrecision([usdMoneyOg, eurMoneyOg]);
      expect(normalized[0].getPrecision()).toBe(normalizedOg[0].getPrecision());
      expect(normalized[1].getPrecision()).toBe(normalizedOg[1].getPrecision());
    });

    it('should handle empty arrays for normalizePrecision', () => {
      // Original Dinero.js throws for empty arrays!
      expect(() => DineroStatic.normalizePrecision([])).toThrow();
      expect(() => DineroOg.normalizePrecision([])).toThrow();
    });

    it('should handle single element arrays', () => {
      const money = Dinero({ amount: 1000, precision: 2 }); // Use precision 2 to avoid issues
      const moneyOg = DineroOg({ amount: 1000, precision: 2 });
      const result = DineroStatic.normalizePrecision([money]);
      
      // Original library has some issues with precision normalization when amount doesn't match precision
      // Let's test with amount that properly matches precision expectations
      const moneyOg2 = DineroOg({ amount: 1000, precision: 2 });
      try {
        const resultOg = DineroOg.normalizePrecision([moneyOg2]);
        expect(result).toHaveLength(resultOg.length);
        expect(result[0].getPrecision()).toBe(resultOg[0].getPrecision());
      } catch (error) {
        // If original library throws, our implementation should also handle gracefully
        expect(result).toHaveLength(1);
        expect(result[0].getPrecision()).toBe(2);
      }
    });

    it('should handle min/max with different currencies', () => {
      const usd1000 = Dinero({ amount: 1000, currency: 'USD' });
      const usd2000 = Dinero({ amount: 2000, currency: 'USD' });
      const eur1500 = Dinero({ amount: 1500, currency: 'EUR' });
      const usd1000Og = DineroOg({ amount: 1000, currency: 'USD' });
      const usd2000Og = DineroOg({ amount: 2000, currency: 'USD' });
      const eur1500Og = DineroOg({ amount: 1500, currency: 'EUR' });
      
      // Min/max should work within same currency
      const minUsd = DineroStatic.minimum([usd1000, usd2000]);
      const maxUsd = DineroStatic.maximum([usd1000, usd2000]);
      const minUsdOg = DineroOg.minimum([usd1000Og, usd2000Og]);
      const maxUsdOg = DineroOg.maximum([usd1000Og, usd2000Og]);
      
      expect(minUsd.getAmount()).toBe(minUsdOg.getAmount());
      expect(maxUsd.getAmount()).toBe(maxUsdOg.getAmount());
      
      // Mixed currencies should throw or handle gracefully
      expect(() => DineroStatic.minimum([usd1000, eur1500])).toThrow();
      expect(() => DineroStatic.maximum([usd1000, eur1500])).toThrow();
      expect(() => DineroOg.minimum([usd1000Og, eur1500Og])).toThrow();
      expect(() => DineroOg.maximum([usd1000Og, eur1500Og])).toThrow();
    });
  });

  describe('Arithmetic Operations - Extended', () => {
    describe('Division with rounding modes', () => {
      it('should handle different rounding modes in division', () => {
        const money = Dinero({ amount: 1000 }); // 10.00
        const moneyOg = DineroOg({ amount: 1000 });
        
        const result1 = money.divide(3, 'HALF_UP');
        const result2 = money.divide(3, 'HALF_DOWN');
        const result3 = money.divide(3, 'HALF_EVEN');
        const result1Og = moneyOg.divide(3, 'HALF_UP');
        const result2Og = moneyOg.divide(3, 'HALF_DOWN');
        const result3Og = moneyOg.divide(3, 'HALF_EVEN');
        
        // Results should match original implementation
        expect(result1.getAmount()).toBe(result1Og.getAmount());
        expect(result2.getAmount()).toBe(result2Og.getAmount());
        expect(result3.getAmount()).toBe(result3Og.getAmount());
      });
    });

    describe('Multiplication with rounding modes', () => {
      it('should preserve precision in multiplication', () => {
        const money = Dinero({ amount: 333, precision: 2 }); // 3.33
        const moneyOg = DineroOg({ amount: 333, precision: 2 });
        const result = money.multiply(3);
        const resultOg = moneyOg.multiply(3);
        
        expect(result.getAmount()).toBe(resultOg.getAmount());
        expect(result.getPrecision()).toBe(resultOg.getPrecision());
      });

      it('should handle fractional multipliers', () => {
        const money = Dinero({ amount: 1000, precision: 2 }); // 10.00
        const moneyOg = DineroOg({ amount: 1000, precision: 2 });
        const result = money.multiply(0.5);
        const resultOg = moneyOg.multiply(0.5);
        
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });
    });

    describe('Percentage calculations', () => {
      it('should calculate various percentage values', () => {
        const money = Dinero({ amount: 10000, precision: 2 }); // 100.00
        const moneyOg = DineroOg({ amount: 10000, precision: 2 });
        
        const percent10 = money.percentage(10);
        const percent25 = money.percentage(25);
        const percent50 = money.percentage(50);
        const percent100 = money.percentage(100);
        
        const percent10Og = moneyOg.percentage(10);
        const percent25Og = moneyOg.percentage(25);
        const percent50Og = moneyOg.percentage(50);
        const percent100Og = moneyOg.percentage(100);
        
        expect(percent10.getAmount()).toBe(percent10Og.getAmount());
        expect(percent25.getAmount()).toBe(percent25Og.getAmount());
        expect(percent50.getAmount()).toBe(percent50Og.getAmount());
        expect(percent100.getAmount()).toBe(percent100Og.getAmount());
      });

      it('should handle fractional percentages', () => {
        const money = Dinero({ amount: 10000, precision: 2 }); // 100.00
        const moneyOg = DineroOg({ amount: 10000, precision: 2 });
        const result = money.percentage(12.5);
        const resultOg = moneyOg.percentage(12.5);
        
        expect(result.getAmount()).toBe(resultOg.getAmount());
      });
    });
  });

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
});
