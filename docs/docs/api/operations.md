---
sidebar_position: 2
---

# Operations API

Complete API reference for arithmetic and comparison operations.

## Arithmetic Operations

### `add(a, b)`

Add two monetary amounts.

**Parameters:**
- `a` (Genkin): First amount
- `b` (Genkin): Second amount

**Returns:** `Genkin`

**Throws:** Error if currencies differ

**Example:**
```typescript
import { genkin, add } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(5, { currency: 'USD' });
const sum = add(a, b);
console.log(sum.amount); // 15
```

### `subtract(a, b)`

Subtract one amount from another.

**Parameters:**
- `a` (Genkin): Amount to subtract from
- `b` (Genkin): Amount to subtract

**Returns:** `Genkin`

**Throws:** Error if currencies differ

**Example:**
```typescript
import { genkin, subtract } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(3, { currency: 'USD' });
const diff = subtract(a, b);
console.log(diff.amount); // 7
```

### `multiply(genkin, multiplier)`

Multiply an amount by a number.

**Parameters:**
- `genkin` (Genkin): Amount to multiply
- `multiplier` (number): Factor to multiply by

**Returns:** `Genkin`

**Throws:** Error if multiplier is not finite

**Example:**
```typescript
import { genkin, multiply } from '@genkin/core';

const amount = genkin(10, { currency: 'USD' });
const doubled = multiply(amount, 2);
console.log(doubled.amount); // 20
```

### `divide(genkin, divisor)`

Divide an amount by a number.

**Parameters:**
- `genkin` (Genkin): Amount to divide
- `divisor` (number): Number to divide by

**Returns:** `Genkin`

**Throws:** Error if divisor is zero or not finite

**Example:**
```typescript
import { genkin, divide } from '@genkin/core';

const amount = genkin(10, { currency: 'USD' });
const half = divide(amount, 2);
console.log(half.amount); // 5
```

### `abs(genkin)`

Get absolute value of an amount.

**Parameters:**
- `genkin` (Genkin): Amount

**Returns:** `Genkin`

**Example:**
```typescript
import { genkin, abs } from '@genkin/core';

const negative = genkin(-10, { currency: 'USD' });
const positive = abs(negative);
console.log(positive.amount); // 10
```

### `negate(genkin)`

Negate an amount (multiply by -1).

**Parameters:**
- `genkin` (Genkin): Amount

**Returns:** `Genkin`

**Example:**
```typescript
import { genkin, negate } from '@genkin/core';

const positive = genkin(10, { currency: 'USD' });
const negative = negate(positive);
console.log(negative.amount); // -10
```

### `percentage(genkin, percent)`

Calculate a percentage of an amount.

**Parameters:**
- `genkin` (Genkin): Amount
- `percent` (number): Percentage (e.g., 15 for 15%)

**Returns:** `Genkin`

**Example:**
```typescript
import { genkin, percentage } from '@genkin/core';

const price = genkin(100, { currency: 'USD' });
const tax = percentage(price, 8); // 8%
console.log(tax.amount); // 8
```

### `allocate(genkin, ratios)`

Distribute an amount across ratios.

**Parameters:**
- `genkin` (Genkin): Amount to allocate
- `ratios` (AllocationRatio[]): Distribution ratios

**Returns:** `Genkin[]`

**Throws:** Error if ratios array is empty or all ratios are zero

**Example:**
```typescript
import { genkin, allocate } from '@genkin/core';

const total = genkin(100, { currency: 'USD' });
const [first, second] = allocate(total, [25, 75]);
console.log(first.amount);  // 25
console.log(second.amount); // 75
```

### `convert(genkin, newCurrency, rate)`

Convert to a different currency.

**Parameters:**
- `genkin` (Genkin): Amount to convert
- `newCurrency` (Object): Target currency config
- `rate` (number | ConversionRate): Exchange rate

**Returns:** `Genkin`

**Example:**
```typescript
import { genkin, convert } from '@genkin/core';

const usd = genkin(100, { currency: 'USD' });
const eur = convert(usd, { code: 'EUR', precision: 2 }, 0.89);
console.log(eur.amount); // 89
```

### `transformScale(genkin, targetScale)`

Change the precision of an amount.

**Parameters:**
- `genkin` (Genkin): Amount
- `targetScale` (number): Target precision

**Returns:** `Genkin`

**Example:**
```typescript
import { genkin, transformScale } from '@genkin/core';

const amount = genkin(10.50, { currency: 'USD', precision: 2 });
const highPrecision = transformScale(amount, 4);
console.log(highPrecision.precision); // 4
```

### `normalizeScale(genkins)`

Normalize multiple amounts to the same precision.

**Parameters:**
- `genkins` (Genkin[]): Array of amounts

**Returns:** `Genkin[]`

**Example:**
```typescript
import { genkin, normalizeScale } from '@genkin/core';

const amounts = [
  genkin(10.5, { currency: 'USD', precision: 1 }),
  genkin(20.50, { currency: 'USD', precision: 2 })
];

const normalized = normalizeScale(amounts);
// All now have precision 2
```

## Comparison Operations

### `equals(a, b)`

Check if two amounts are equal.

**Parameters:**
- `a` (Genkin): First amount
- `b` (Genkin): Second amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, equals } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(10, { currency: 'USD' });
console.log(equals(a, b)); // true
```

### `lessThan(a, b)`

Check if first amount is less than second.

**Parameters:**
- `a` (Genkin): First amount
- `b` (Genkin): Second amount

**Returns:** `boolean`

**Throws:** Error if currencies differ

**Example:**
```typescript
import { genkin, lessThan } from '@genkin/core';

const a = genkin(5, { currency: 'USD' });
const b = genkin(10, { currency: 'USD' });
console.log(lessThan(a, b)); // true
```

### `lessThanOrEqual(a, b)`

Check if first amount is less than or equal to second.

**Parameters:**
- `a` (Genkin): First amount
- `b` (Genkin): Second amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, lessThanOrEqual } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(10, { currency: 'USD' });
console.log(lessThanOrEqual(a, b)); // true
```

### `greaterThan(a, b)`

Check if first amount is greater than second.

**Parameters:**
- `a` (Genkin): First amount
- `b` (Genkin): Second amount

**Returns:** `boolean`

**Throws:** Error if currencies differ

**Example:**
```typescript
import { genkin, greaterThan } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(5, { currency: 'USD' });
console.log(greaterThan(a, b)); // true
```

### `greaterThanOrEqual(a, b)`

Check if first amount is greater than or equal to second.

**Parameters:**
- `a` (Genkin): First amount
- `b` (Genkin): Second amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, greaterThanOrEqual } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(10, { currency: 'USD' });
console.log(greaterThanOrEqual(a, b)); // true
```

### `isZero(genkin)`

Check if amount is zero.

**Parameters:**
- `genkin` (Genkin): Amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, isZero } from '@genkin/core';

const zero = genkin(0, { currency: 'USD' });
console.log(isZero(zero)); // true
```

### `isPositive(genkin)`

Check if amount is positive (>= 0).

**Parameters:**
- `genkin` (Genkin): Amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, isPositive } from '@genkin/core';

const positive = genkin(10, { currency: 'USD' });
console.log(isPositive(positive)); // true
```

### `isNegative(genkin)`

Check if amount is negative (< 0).

**Parameters:**
- `genkin` (Genkin): Amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, isNegative } from '@genkin/core';

const negative = genkin(-10, { currency: 'USD' });
console.log(isNegative(negative)); // true
```

### `min(...genkins)`

Find minimum amount.

**Parameters:**
- `...genkins` (Genkin[]): Amounts to compare

**Returns:** `Genkin`

**Throws:** Error if called with no arguments

**Example:**
```typescript
import { genkin, min } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(5, { currency: 'USD' });
const c = genkin(8, { currency: 'USD' });

const minimum = min(a, b, c);
console.log(minimum.amount); // 5
```

### `max(...genkins)`

Find maximum amount.

**Parameters:**
- `...genkins` (Genkin[]): Amounts to compare

**Returns:** `Genkin`

**Throws:** Error if called with no arguments

**Example:**
```typescript
import { genkin, max } from '@genkin/core';

const a = genkin(10, { currency: 'USD' });
const b = genkin(5, { currency: 'USD' });
const c = genkin(8, { currency: 'USD' });

const maximum = max(a, b, c);
console.log(maximum.amount); // 10
```

### `hasSubUnits(genkin)`

Check if amount has fractional parts.

**Parameters:**
- `genkin` (Genkin): Amount

**Returns:** `boolean`

**Example:**
```typescript
import { genkin, hasSubUnits } from '@genkin/core';

const withCents = genkin(10.50, { currency: 'USD' });
const wholeDollars = genkin(10.00, { currency: 'USD' });

console.log(hasSubUnits(withCents)); // true
console.log(hasSubUnits(wholeDollars)); // false
```

## Generic Operations

For use with custom calculators (BigInt, Big.js, etc.):

### `createArithmeticOperations(calculator)`

Create arithmetic operations for a calculator.

**Parameters:**
- `calculator` (Calculator&lt;T&gt;): Calculator implementation

**Returns:** Object with arithmetic operations

**Example:**
```typescript
import { createArithmeticOperations, bigintCalculator } from '@genkin/core';

const ops = createArithmeticOperations(bigintCalculator);
// ops.add, ops.subtract, ops.multiply, etc.
```

### `createComparisonOperations(calculator)`

Create comparison operations for a calculator.

**Parameters:**
- `calculator` (Calculator&lt;T&gt;): Calculator implementation

**Returns:** Object with comparison operations

**Example:**
```typescript
import { createComparisonOperations, bigintCalculator } from '@genkin/core';

const ops = createComparisonOperations(bigintCalculator);
// ops.equals, ops.lessThan, ops.greaterThan, etc.
```

### `createOperations(calculator)`

Create all operations for a calculator.

**Parameters:**
- `calculator` (Calculator&lt;T&gt;): Calculator implementation

**Returns:** Object with all operations

**Example:**
```typescript
import { createOperations, bigintCalculator } from '@genkin/core';

const ops = createOperations(bigintCalculator);
// All arithmetic and comparison operations
```

## See Also

- [Operations Guide](../core/operations)
- [Custom Calculators](../core/custom-calculators)
- [Genkin Class API](./genkin-class)

