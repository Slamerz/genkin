---
sidebar_position: 3
---

# Generic Types with Dinero v2

Using Dinero.js v2 with BigInt, Big.js, and custom numeric types.

## Overview

Dinero.js v2 supports generic numeric types, allowing you to use BigInt, Big.js, Decimal.js, or any custom type for monetary calculations.

## Using BigInt

Create a BigInt-based Dinero factory:

```typescript
import { createDinero } from '@genkin/dinero-v2';
import { bigintCalculator } from '@genkin/core';

// Create factory
const bigintDinero = createDinero({ calculator: bigintCalculator });

// Create BigInt currency
const USD_BIGINT = {
  code: 'USD',
  base: 10n,
  exponent: 2n
};

// Create amounts
const price = bigintDinero({
  amount: 1000n,
  currency: USD_BIGINT,
  scale: 2n
});
```

## BigInt Operations

All operations work with BigInt:

```typescript
import { createDinero, createOperations } from '@genkin/dinero-v2';
import { bigintCalculator } from '@genkin/core';

const bigintDinero = createDinero({ calculator: bigintCalculator });
const ops = createOperations(bigintCalculator);

const a = bigintDinero({ amount: 1000n, currency: USD_BIGINT, scale: 2n });
const b = bigintDinero({ amount: 500n, currency: USD_BIGINT, scale: 2n });

// Arithmetic
const sum = ops.add(a, b);
const diff = ops.subtract(a, b);
const product = ops.multiply(a, 2n);

// Comparison
console.log(ops.lessThan(b, a)); // true
console.log(ops.equal(a, a)); // true
```

## Using Big.js

Create a Big.js-based Dinero factory:

```typescript
import Big from 'big.js';
import { createDinero } from '@genkin/dinero-v2';
import { bigjsCalculator } from '@genkin/core';

// Create factory
const bigDinero = createDinero({ calculator: bigjsCalculator });

// Create Big.js currency
const USD_BIG = {
  code: 'USD',
  base: new Big(10),
  exponent: new Big(2)
};

// Create amounts
const price = bigDinero({
  amount: new Big('10.50'),
  currency: USD_BIG,
  scale: new Big(2)
});
```

## Big.js Operations

```typescript
import Big from 'big.js';
import { createDinero, createOperations } from '@genkin/dinero-v2';
import { bigjsCalculator } from '@genkin/core';

const bigDinero = createDinero({ calculator: bigjsCalculator });
const ops = createOperations(bigjsCalculator);

const a = bigDinero({
  amount: new Big('10.50'),
  currency: USD_BIG,
  scale: new Big(2)
});

const b = bigDinero({
  amount: new Big('5.25'),
  currency: USD_BIG,
  scale: new Big(2)
});

const sum = ops.add(a, b);
console.log(sum.amount.toString()); // "15.75"
```

## Custom Numeric Types

Implement a calculator for any numeric type:

```typescript
import Decimal from 'decimal.js';
import { Calculator, ComparisonOperator } from '@genkin/core';
import { createDinero } from '@genkin/dinero-v2';

// Create calculator
const decimalCalculator: Calculator<Decimal> = {
  add: (a, b) => a.plus(b),
  subtract: (a, b) => a.minus(b),
  multiply: (a, b) => a.times(b),
  integerDivide: (a, b) => a.dividedToIntegerBy(b),
  modulo: (a, b) => a.mod(b),
  power: (a, b) => a.pow(b.toNumber()),
  compare: (a, b) => a.comparedTo(b) as ComparisonOperator,
  increment: (a) => a.plus(1),
  decrement: (a) => a.minus(1),
  zero: () => new Decimal(0),
};

// Create factory
const decimalDinero = createDinero({ calculator: decimalCalculator });

// Create currency
const USD_DECIMAL = {
  code: 'USD',
  base: new Decimal(10),
  exponent: new Decimal(2)
};

// Use it
const price = decimalDinero({
  amount: new Decimal('10.50'),
  currency: USD_DECIMAL,
  scale: new Decimal(2)
});
```

## Type Safety

TypeScript ensures type safety across operations:

```typescript
import { createDinero } from '@genkin/dinero-v2';
import { bigintCalculator } from '@genkin/core';

const bigintDinero = createDinero({ calculator: bigintCalculator });

// Type error: can't mix number and bigint
const price = bigintDinero({
  amount: 1000n,
  currency: USD_BIGINT,
  scale: 2  // Error: Type 'number' is not assignable to type 'bigint'
});
```

## Lifecycle Hooks

Add hooks to your factory:

```typescript
import { createDinero } from '@genkin/dinero-v2';
import { bigintCalculator } from '@genkin/core';

const bigintDinero = createDinero({
  calculator: bigintCalculator,
  onCreate: (options) => {
    console.log('Creating Dinero:', options);
  }
});
```

## Conversion Between Types

Convert between different numeric types:

```typescript
import Big from 'big.js';
import { createDinero } from '@genkin/dinero-v2';
import { numberCalculator, bigjsCalculator } from '@genkin/core';

// Number-based
const numberDinero = createDinero({ calculator: numberCalculator });
const numPrice = numberDinero({ amount: 1050, currency: USD, scale: 2 });

// Convert to Big.js
const bigDinero = createDinero({ calculator: bigjsCalculator });
const bigPrice = bigDinero({
  amount: new Big(numPrice.amount.toString()),
  currency: USD_BIG,
  scale: new Big(numPrice.scale.toString())
});
```

## Performance Considerations

Different types have different performance characteristics:

| Type | Speed | Precision | Use Case |
|------|-------|-----------|----------|
| `number` | Fastest | ~15 digits | Most applications |
| `bigint` | Fast | Unlimited | Large integers |
| `Big.js` | Slower | Unlimited | Exact decimals |
| `Decimal.js` | Slower | Unlimited | Scientific calculations |

## Best Practices

1. **Consistent Types**: Use the same calculator throughout your application
2. **Type Safety**: Let TypeScript infer types from your calculator
3. **Currency Matching**: Ensure currency types match your numeric type
4. **Testing**: Test edge cases with your chosen type
5. **Performance**: Use `number` unless you need higher precision

## Examples

### Cryptocurrency with BigInt

```typescript
import { createDinero } from '@genkin/dinero-v2';
import { bigintCalculator } from '@genkin/core';

const bigintDinero = createDinero({ calculator: bigintCalculator });

const BTC = {
  code: 'BTC',
  base: 10n,
  exponent: 8n
};

const bitcoin = bigintDinero({
  amount: 50000000n, // 0.5 BTC in satoshis
  currency: BTC,
  scale: 8n
});
```

### Exact Decimal Calculations

```typescript
import Big from 'big.js';
import { createDinero, createOperations } from '@genkin/dinero-v2';
import { bigjsCalculator } from '@genkin/core';

const bigDinero = createDinero({ calculator: bigjsCalculator });
const ops = createOperations(bigjsCalculator);

const price = bigDinero({
  amount: new Big('99.99'),
  currency: USD_BIG,
  scale: new Big(2)
});

const tax = ops.multiply(price, new Big('0.0875')); // 8.75%
const total = ops.add(price, tax);

console.log(total.amount.toString()); // Exact result
```

## See Also

- [Custom Calculators](../core/custom-calculators)
- [API Reference](./api-reference)
- [Migration Guide](./migration-guide)

