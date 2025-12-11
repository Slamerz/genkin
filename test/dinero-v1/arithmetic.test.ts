import { describe, expect, it } from 'vitest';
import  Dinero  from '../../src/dinero-v1/index.js';
import DineroOg from 'dinero-og-v1';

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
