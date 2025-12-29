---
sidebar_position: 5
---

# Precision and Rounding

Understanding how Genkin handles decimal precision and rounding for accurate financial calculations.

## Precision Basics

Precision determines how many decimal places are maintained:

```typescript
import { genkin } from '@genkin/core';

// Standard 2 decimal places (cents)
const usd = genkin(10.50, { currency: 'USD', precision: 2 });
console.log(usd.precision); // 2

// High precision for cryptocurrency
const btc = genkin(0.12345678, { currency: 'BTC', precision: 8 });
console.log(btc.precision); // 8

// Zero precision (no fractional units)
const jpy = genkin(1000, { currency: 'JPY', precision: 0 });
console.log(jpy.precision); // 0
```

## Minor Units

Genkin stores amounts internally as minor units (integers) to avoid floating-point errors:

```typescript
import { genkin } from '@genkin/core';

const amount = genkin(10.50, { currency: 'USD', precision: 2 });

console.log(amount.amount); // 10.5 (major units - dollars)
console.log(amount.minorUnits); // 1050 (minor units - cents)
```

## Converting Precision

Change the precision of an amount:

```typescript
import { genkin } from '@genkin/core';

// Increase precision
const dollars = genkin(10.50, { currency: 'USD', precision: 2 });
const highPrecision = dollars.convertPrecision(4);

console.log(highPrecision.amount); // 10.50
console.log(highPrecision.precision); // 4
console.log(highPrecision.minorUnits); // 105000

// Decrease precision (with rounding)
const precise = genkin(10.123, { currency: 'USD', precision: 3 });
const rounded = precise.convertPrecision(2);

console.log(rounded.amount); // 10.12
console.log(rounded.precision); // 2
```

## Rounding Modes

Genkin supports multiple rounding strategies:

### ROUND_HALF_UP (Standard Rounding)

```typescript
import { genkin, RoundingMode } from '@genkin/core';

const amount = genkin(10.125, {
  currency: 'USD',
  precision: 3,
  rounding: RoundingMode.ROUND_HALF_UP
});

const rounded = amount.convertPrecision(2);
console.log(rounded.amount); // 10.13 (0.125 rounds up)
```

### ROUND_HALF_EVEN (Banker's Rounding)

Minimizes bias by rounding to the nearest even number:

```typescript
const amount1 = genkin(2.5, { 
  currency: 'USD',
  rounding: RoundingMode.ROUND_HALF_EVEN 
});
// 2.5 rounds to 2 (even)

const amount2 = genkin(3.5, { 
  currency: 'USD',
  rounding: RoundingMode.ROUND_HALF_EVEN 
});
// 3.5 rounds to 4 (even)
```

### ROUND_DOWN (Floor)

Always rounds toward zero:

```typescript
const amount = genkin(10.99, {
  currency: 'USD',
  rounding: RoundingMode.ROUND_DOWN
});

const rounded = amount.convertPrecision(0);
console.log(rounded.amount); // 10
```

### ROUND_UP (Ceiling)

Always rounds away from zero:

```typescript
const amount = genkin(10.01, {
  currency: 'USD',
  rounding: RoundingMode.ROUND_UP
});

const rounded = amount.convertPrecision(0);
console.log(rounded.amount); // 11
```

### Other Rounding Modes

- **ROUND_HALF_DOWN**: Round to nearest, ties toward zero
- **ROUND_TOWARDS_ZERO**: Always round toward zero
- **ROUND_AWAY_FROM_ZERO**: Always round away from zero
- **ROUND_HALF_ODD**: Round to nearest odd number on ties
- **ROUND_HALF_TOWARDS_ZERO**: Round to nearest, ties toward zero
- **ROUND_HALF_AWAY_FROM_ZERO**: Round to nearest, ties away from zero

## Precision in Operations

Operations automatically handle different precisions:

```typescript
import { genkin, add } from '@genkin/core';

const a = genkin(12.34, { currency: 'USD', precision: 2 });
const b = genkin(5.678, { currency: 'USD', precision: 3 });

const sum = add(a, b);
console.log(sum.precision); // 3 (uses higher precision)
console.log(sum.amount); // 18.018
```

## Avoiding Floating-Point Errors

Genkin avoids common JavaScript floating-point issues:

```typescript
// JavaScript floating-point error
console.log(0.1 + 0.2); // 0.30000000000000004

// Genkin handles this correctly
import { genkin, add } from '@genkin/core';

const a = genkin(0.1, { currency: 'USD' });
const b = genkin(0.2, { currency: 'USD' });
const sum = add(a, b);

console.log(sum.amount); // 0.3 (exact)
```

## High-Precision Calculations

For extreme precision requirements, use BigInt or Big.js:

```typescript
import { createGenkin, bigintCalculator } from '@genkin/core';

const genkin = createGenkin(bigintCalculator);

// Work with very large numbers without precision loss
const amount = genkin(999999999999999999n, {
  currency: 'USD',
  precision: 2,
  isMinorUnits: true
});

console.log(amount.minorUnits); // 999999999999999999n (exact)
```

## Best Practices

1. **Match Currency Precision**: Use the standard precision for each currency
2. **Store as Minor Units**: When persisting to databases, store minor units
3. **Choose Appropriate Rounding**: Select rounding modes based on business rules
4. **Use Banker's Rounding**: ROUND_HALF_EVEN minimizes bias for accounting
5. **High Precision for Crypto**: Use precision 8 for Bitcoin, 18 for Ethereum
6. **Validate Precision**: Ensure precision matches your business requirements

## Common Use Cases

### Tax Calculations

```typescript
import { genkin, multiply, RoundingMode } from '@genkin/core';

const price = genkin(100, { currency: 'USD' });
const taxRate = 0.0875; // 8.75%

const tax = multiply(price, taxRate);
// Automatically rounds to 2 decimal places (8.75)
```

### Splitting Bills

```typescript
import { genkin, allocate } from '@genkin/core';

const total = genkin(100, { currency: 'USD' });
const [person1, person2, person3] = allocate(total, [1, 1, 1]);

// Handles remainders fairly
console.log(person1.amount); // 33.34
console.log(person2.amount); // 33.33
console.log(person3.amount); // 33.33
// Sum: 100.00 (exact)
```

### Currency Conversion

```typescript
import { genkin, convert, RoundingMode } from '@genkin/core';

const usd = genkin(100, { 
  currency: 'USD',
  rounding: RoundingMode.ROUND_HALF_UP
});

const eur = convert(usd, { code: 'EUR', precision: 2 }, 0.89);
console.log(eur.amount); // 89.00
```

## Next Steps

- Learn about [custom calculators](./custom-calculators) for BigInt and Big.js
- See the [operations guide](./operations) for arithmetic examples
- Explore the [API reference](../api/genkin-class) for detailed method documentation

