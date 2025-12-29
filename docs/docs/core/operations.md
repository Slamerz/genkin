---
sidebar_position: 3
---

# Arithmetic Operations

Perform calculations with monetary amounts using Genkin's immutable operations.

## Addition

Add two monetary amounts with the same currency:

```typescript
import { genkin, add } from '@genkin/core';
import { USD } from '@genkin/currencies';

const price1 = genkin(12.34, { currency: USD });
const price2 = genkin(5.67, { currency: USD });
const total = add(price1, price2);

console.log(total.amount); // 18.01
```

### Handling Different Precisions

Addition automatically uses the higher precision:

```typescript
const a = genkin(12.34, { currency: 'USD', precision: 2 });
const b = genkin(5.678, { currency: 'USD', precision: 3 });
const result = add(a, b);

console.log(result.amount); // 18.018
console.log(result.precision); // 3
```

## Subtraction

Subtract one amount from another:

```typescript
import { genkin, subtract } from '@genkin/core';

const price = genkin(12.34, { currency: 'USD' });
const discount = genkin(5.67, { currency: 'USD' });
const final = subtract(price, discount);

console.log(final.amount); // 6.67
```

## Multiplication

Multiply an amount by a numeric factor:

```typescript
import { genkin, multiply } from '@genkin/core';

const price = genkin(12.34, { currency: 'USD' });
const doubled = multiply(price, 2);

console.log(doubled.amount); // 24.68
```

### Calculate Percentages

Use multiplication for percentage calculations:

```typescript
const price = genkin(100, { currency: 'USD' });
const tax = multiply(price, 0.08); // 8% tax

console.log(tax.amount); // 8
```

Or use the convenience `percentage` function:

```typescript
import { genkin, percentage } from '@genkin/core';

const price = genkin(100, { currency: 'USD' });
const tax = percentage(price, 8); // 8%

console.log(tax.amount); // 8
```

## Division

Divide an amount by a numeric divisor:

```typescript
import { genkin, divide } from '@genkin/core';

const total = genkin(100, { currency: 'USD' });
const perPerson = divide(total, 4);

console.log(perPerson.amount); // 25
```

## Absolute Value

Get the absolute value of an amount:

```typescript
import { genkin, abs } from '@genkin/core';

const negative = genkin(-12.34, { currency: 'USD' });
const positive = abs(negative);

console.log(positive.amount); // 12.34
```

## Negation

Negate an amount (multiply by -1):

```typescript
import { genkin, negate } from '@genkin/core';

const charge = genkin(100, { currency: 'USD' });
const refund = negate(charge);

console.log(refund.amount); // -100
```

## Allocation

Distribute an amount across multiple ratios:

```typescript
import { genkin, allocate } from '@genkin/core';

const total = genkin(100, { currency: 'USD' });
const [first, second] = allocate(total, [25, 75]);

console.log(first.amount);  // 25
console.log(second.amount); // 75
```

### Handling Remainders

Allocation handles indivisible amounts fairly:

```typescript
const amount = genkin(10, { currency: 'USD' });
const parts = allocate(amount, [1, 1, 1]); // Split $10 three ways

console.log(parts[0].amount); // 3.34
console.log(parts[1].amount); // 3.33
console.log(parts[2].amount); // 3.33
// Sum: 3.34 + 3.33 + 3.33 = 10.00 (exact)
```

### Scaled Ratios

Use scaled ratios for precise percentage allocation:

```typescript
const amount = genkin(100, { currency: 'USD' });
const parts = allocate(amount, [
  { amount: 505, scale: 1 },  // 50.5%
  { amount: 495, scale: 1 }   // 49.5%
]);

console.log(parts[0].amount); // 50.50
console.log(parts[1].amount); // 49.50
```

## Comparison Operations

### Equality

Check if two amounts are equal:

```typescript
import { genkin, equals } from '@genkin/core';

const a = genkin(12.34, { currency: 'USD' });
const b = genkin(12.34, { currency: 'USD' });

console.log(equals(a, b)); // true
```

### Less Than / Greater Than

Compare monetary amounts:

```typescript
import { genkin, lessThan, greaterThan } from '@genkin/core';

const small = genkin(5.67, { currency: 'USD' });
const large = genkin(12.34, { currency: 'USD' });

console.log(lessThan(small, large)); // true
console.log(greaterThan(large, small)); // true
```

### Min / Max

Find minimum or maximum amounts:

```typescript
import { genkin, min, max } from '@genkin/core';

const a = genkin(12.34, { currency: 'USD' });
const b = genkin(5.67, { currency: 'USD' });
const c = genkin(8.90, { currency: 'USD' });

const minimum = min(a, b, c);
const maximum = max(a, b, c);

console.log(minimum.amount); // 5.67
console.log(maximum.amount); // 12.34
```

### Value Checks

Check if an amount is zero, positive, or negative:

```typescript
import { genkin, isZero, isPositive, isNegative } from '@genkin/core';

const zero = genkin(0, { currency: 'USD' });
const positive = genkin(10, { currency: 'USD' });
const negative = genkin(-10, { currency: 'USD' });

console.log(isZero(zero)); // true
console.log(isPositive(positive)); // true
console.log(isNegative(negative)); // true
```

## Currency Conversion

Convert between currencies using exchange rates:

```typescript
import { genkin, convert } from '@genkin/core';

const usd = genkin(100, { currency: 'USD' });
const eur = convert(usd, { code: 'EUR', precision: 2 }, 0.89);

console.log(eur.amount); // 89
console.log(eur.currencyCode); // "EUR"
```

## Immutability

All operations return new instances - original amounts are never modified:

```typescript
const original = genkin(10, { currency: 'USD' });
const doubled = multiply(original, 2);

console.log(original.amount); // 10 (unchanged)
console.log(doubled.amount); // 20 (new instance)
```

## Error Handling

Operations throw errors for invalid inputs:

```typescript
import { genkin, add, divide } from '@genkin/core';

// Different currencies
const usd = genkin(10, { currency: 'USD' });
const eur = genkin(10, { currency: 'EUR' });
// add(usd, eur); // Throws: "Cannot add different currencies"

// Division by zero
const amount = genkin(10, { currency: 'USD' });
// divide(amount, 0); // Throws: "Cannot divide by zero"
```

## Best Practices

1. **Check Currency Compatibility**: Always ensure amounts have the same currency before operations
2. **Use Appropriate Operations**: Choose the right operation for your use case
3. **Handle Remainders**: Be aware of how allocation distributes remainders
4. **Validate Results**: Check operation results match your business logic
5. **Preserve Precision**: Operations maintain or increase precision as needed

## Next Steps

- Learn about [precision and rounding](./precision-and-rounding)
- Explore [custom calculators](./custom-calculators) for BigInt or Big.js
- See the [API reference](../api/operations) for complete operation details

