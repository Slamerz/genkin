---
sidebar_position: 2
---

# Dinero.js v2 API Reference

Complete API reference for the Dinero.js v2 compatibility layer.

## Overview

The `@genkin/dinero-v2` package provides compatibility with Dinero.js v2 API, including generic type support.

## Factory Function

### `dinero(options)`

Create a Dinero v2 instance.

**Parameters:**
- `options` (DineroOptions&lt;number&gt;): Configuration options

**Returns:** `Dinero<number>`

**Example:**
```typescript
import { dinero } from '@genkin/dinero-v2';
import { USD } from '@genkin/dinero-v2/currencies';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
```

## Generic Factory

### `createDinero(options)`

Create a generic Dinero factory.

**Parameters:**
- `options` (CreateDineroOptions&lt;T&gt;): Factory options

**Returns:** `DineroFactory<T>`

**Example:**
```typescript
import { createDinero } from '@genkin/dinero-v2';
import { bigintCalculator } from '@genkin/core';

const bigintDinero = createDinero({ calculator: bigintCalculator });
const price = bigintDinero({ amount: 1000n, currency: USD_BIGINT, scale: 2n });
```

## Operations

### Arithmetic

#### `add(augend, addend)`

Add two Dinero instances.

```typescript
import { dinero, add } from '@genkin/dinero-v2';
import { USD } from '@genkin/dinero-v2/currencies';

const a = dinero({ amount: 1000, currency: USD, scale: 2 });
const b = dinero({ amount: 500, currency: USD, scale: 2 });
const sum = add(a, b);
```

#### `subtract(minuend, subtrahend)`

Subtract one Dinero from another.

```typescript
import { dinero, subtract } from '@genkin/dinero-v2';

const a = dinero({ amount: 1000, currency: USD, scale: 2 });
const b = dinero({ amount: 300, currency: USD, scale: 2 });
const diff = subtract(a, b);
```

#### `multiply(dinero, multiplier)`

Multiply a Dinero by a number.

```typescript
import { dinero, multiply } from '@genkin/dinero-v2';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
const doubled = multiply(price, 2);
```

#### `allocate(dinero, ratios)`

Distribute across ratios.

```typescript
import { dinero, allocate } from '@genkin/dinero-v2';

const total = dinero({ amount: 10000, currency: USD, scale: 2 });
const parts = allocate(total, [25, 75]);
```

### Comparison

#### `compare(left, right)`

Compare two Dinero instances.

**Returns:** `-1 | 0 | 1`

```typescript
import { dinero, compare } from '@genkin/dinero-v2';

const a = dinero({ amount: 500, currency: USD, scale: 2 });
const b = dinero({ amount: 1000, currency: USD, scale: 2 });
console.log(compare(a, b)); // -1
```

#### `equal(left, right)`

Check equality.

```typescript
import { dinero, equal } from '@genkin/dinero-v2';

const a = dinero({ amount: 1000, currency: USD, scale: 2 });
const b = dinero({ amount: 1000, currency: USD, scale: 2 });
console.log(equal(a, b)); // true
```

#### `lessThan(left, right)`

Check if less than.

```typescript
import { dinero, lessThan } from '@genkin/dinero-v2';

const a = dinero({ amount: 500, currency: USD, scale: 2 });
const b = dinero({ amount: 1000, currency: USD, scale: 2 });
console.log(lessThan(a, b)); // true
```

#### `greaterThan(left, right)`

Check if greater than.

```typescript
import { dinero, greaterThan } from '@genkin/dinero-v2';

const a = dinero({ amount: 1000, currency: USD, scale: 2 });
const b = dinero({ amount: 500, currency: USD, scale: 2 });
console.log(greaterThan(a, b)); // true
```

#### `isZero(dinero)`

Check if zero.

```typescript
import { dinero, isZero } from '@genkin/dinero-v2';

const zero = dinero({ amount: 0, currency: USD, scale: 2 });
console.log(isZero(zero)); // true
```

#### `isPositive(dinero)`

Check if positive.

```typescript
import { dinero, isPositive } from '@genkin/dinero-v2';

const positive = dinero({ amount: 1000, currency: USD, scale: 2 });
console.log(isPositive(positive)); // true
```

#### `isNegative(dinero)`

Check if negative.

```typescript
import { dinero, isNegative } from '@genkin/dinero-v2';

const negative = dinero({ amount: -1000, currency: USD, scale: 2 });
console.log(isNegative(negative)); // true
```

#### `minimum(dineros)`

Find minimum.

```typescript
import { dinero, minimum } from '@genkin/dinero-v2';

const amounts = [
  dinero({ amount: 1000, currency: USD, scale: 2 }),
  dinero({ amount: 500, currency: USD, scale: 2 })
];
const min = minimum(amounts);
```

#### `maximum(dineros)`

Find maximum.

```typescript
import { dinero, maximum } from '@genkin/dinero-v2';

const amounts = [
  dinero({ amount: 1000, currency: USD, scale: 2 }),
  dinero({ amount: 500, currency: USD, scale: 2 })
];
const max = maximum(amounts);
```

### Conversion

#### `convert(dinero, currency, rates)`

Convert to another currency.

```typescript
import { dinero, convert } from '@genkin/dinero-v2';
import { USD, EUR } from '@genkin/dinero-v2/currencies';

const usd = dinero({ amount: 10000, currency: USD, scale: 2 });
const eur = convert(usd, EUR, { EUR: { amount: 89, scale: 2 } });
```

#### `normalizeScale(dineros)`

Normalize scale across instances.

```typescript
import { dinero, normalizeScale } from '@genkin/dinero-v2';

const amounts = [
  dinero({ amount: 100, currency: USD, scale: 1 }),
  dinero({ amount: 1000, currency: USD, scale: 2 })
];
const normalized = normalizeScale(amounts);
```

#### `transformScale(dinero, newScale)`

Change the scale.

```typescript
import { dinero, transformScale } from '@genkin/dinero-v2';

const amount = dinero({ amount: 1000, currency: USD, scale: 2 });
const highScale = transformScale(amount, 4);
```

#### `trimScale(dinero)`

Remove trailing zeros from scale.

```typescript
import { dinero, trimScale } from '@genkin/dinero-v2';

const amount = dinero({ amount: 10000, currency: USD, scale: 4 });
const trimmed = trimScale(amount); // scale: 2
```

### Inspection

#### `toSnapshot(dinero)`

Get snapshot of Dinero instance.

```typescript
import { dinero, toSnapshot } from '@genkin/dinero-v2';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
const snapshot = toSnapshot(price);
// { amount: 1000, currency: USD, scale: 2 }
```

#### `toDecimal(dinero)`

Get decimal representation.

```typescript
import { dinero, toDecimal } from '@genkin/dinero-v2';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
console.log(toDecimal(price)); // "10"
```

#### `toUnits(dinero)`

Get array of units.

```typescript
import { dinero, toUnits } from '@genkin/dinero-v2';

const price = dinero({ amount: 1050, currency: USD, scale: 2 });
console.log(toUnits(price)); // [10, 50]
```

### Predicates

#### `haveSameCurrency(dineros)`

Check if all have same currency.

```typescript
import { dinero, haveSameCurrency } from '@genkin/dinero-v2';

const amounts = [
  dinero({ amount: 1000, currency: USD, scale: 2 }),
  dinero({ amount: 500, currency: USD, scale: 2 })
];
console.log(haveSameCurrency(amounts)); // true
```

#### `haveSameAmount(dineros)`

Check if all have same amount.

```typescript
import { dinero, haveSameAmount } from '@genkin/dinero-v2';

const amounts = [
  dinero({ amount: 1000, currency: USD, scale: 2 }),
  dinero({ amount: 1000, currency: EUR, scale: 2 })
];
console.log(haveSameAmount(amounts)); // true
```

#### `hasSubUnits(dinero)`

Check if has fractional parts.

```typescript
import { dinero, hasSubUnits } from '@genkin/dinero-v2';

const withCents = dinero({ amount: 1050, currency: USD, scale: 2 });
console.log(hasSubUnits(withCents)); // true
```

## Types

### `Dinero<TAmount>`

Generic Dinero instance type.

```typescript
interface Dinero<TAmount> {
  readonly amount: TAmount;
  readonly currency: Currency<TAmount>;
  readonly scale: TAmount;
}
```

### `DineroOptions<TAmount>`

Options for creating Dinero instances.

```typescript
interface DineroOptions<TAmount> {
  amount: TAmount;
  currency: Currency<TAmount>;
  scale: TAmount;
}
```

### `Currency<TAmount>`

Currency type for Dinero v2.

```typescript
interface Currency<TAmount> {
  code: string;
  base: TAmount;
  exponent: TAmount;
}
```

## See Also

- [Migration Guide](./migration-guide)
- [Generic Types Guide](./generic-types)
- [Dinero.js v2 Documentation](https://v2.dinerojs.com)

