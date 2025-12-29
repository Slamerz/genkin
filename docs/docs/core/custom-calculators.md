---
sidebar_position: 6
---

# Custom Calculators

Use BigInt, Big.js, or custom numeric types for specialized monetary calculations.

## Why Custom Calculators?

The standard `number` type works for most use cases, but custom calculators are useful for:

- **BigInt**: Arbitrary-precision integers, perfect for large amounts
- **Big.js**: Arbitrary-precision decimals, eliminates floating-point errors
- **Decimal.js**: High-precision decimal arithmetic
- **Custom Types**: Any numeric type with a Calculator implementation

## Using BigInt

BigInt provides exact integer arithmetic without precision limits:

```typescript
import { createGenkin, bigintCalculator } from '@genkin/core';

// Create a BigInt-based factory
const genkin = createGenkin(bigintCalculator);

// Create amounts with BigInt (use 'n' suffix)
const amount = genkin(1050n, {
  currency: 'USD',
  precision: 2,
  isMinorUnits: true // 1050 cents = $10.50
});

console.log(amount.amount); // 10n
console.log(amount.minorUnits); // 1050n
```

### BigInt Operations

All standard operations work with BigInt:

```typescript
import { createGenkin, bigintCalculator, createOperations } from '@genkin/core';

const genkin = createGenkin(bigintCalculator);
const ops = createOperations(bigintCalculator);

const a = genkin(1050n, { currency: 'USD', precision: 2, isMinorUnits: true });
const b = genkin(525n, { currency: 'USD', precision: 2, isMinorUnits: true });

const sum = ops.add(a, b);
console.log(sum.minorUnits); // 1575n ($15.75)

const product = ops.multiply(a, 2n);
console.log(product.minorUnits); // 2100n ($21.00)
```

### When to Use BigInt

- Large monetary amounts (> $9 quadrillion)
- Exact integer arithmetic
- Cryptocurrency with many decimal places
- Financial systems requiring absolute precision

## Using Big.js

Big.js provides exact decimal arithmetic:

```typescript
import Big from 'big.js';
import { createGenkin, bigjsCalculator } from '@genkin/core';

// Create a Big.js-based factory
const genkin = createGenkin(bigjsCalculator);

// Create amounts with Big.js
const amount = genkin(new Big('10.50'), {
  currency: 'USD',
  precision: 2
});

console.log(amount.amount.toString()); // "10.5"
```

### Big.js Operations

```typescript
import Big from 'big.js';
import { createGenkin, bigjsCalculator, createOperations } from '@genkin/core';

const genkin = createGenkin(bigjsCalculator);
const ops = createOperations(bigjsCalculator);

const a = genkin(new Big('10.50'), { currency: 'USD' });
const b = genkin(new Big('5.25'), { currency: 'USD' });

const sum = ops.add(a, b);
console.log(sum.amount.toString()); // "15.75"

// No floating-point errors!
const precise = genkin(new Big('0.1'), { currency: 'USD' });
const morePrecise = genkin(new Big('0.2'), { currency: 'USD' });
const total = ops.add(precise, morePrecise);
console.log(total.amount.toString()); // "0.3" (not 0.30000000000000004)
```

### When to Use Big.js

- Exact decimal arithmetic required
- Scientific or engineering calculations
- Avoiding floating-point errors completely
- Complex percentage calculations

## Creating Custom Calculators

Implement the Calculator interface for any numeric type:

```typescript
import Decimal from 'decimal.js';
import { Calculator, ComparisonOperator, createGenkin } from '@genkin/core';

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

// Use your custom calculator
const genkin = createGenkin(decimalCalculator);
const amount = genkin(new Decimal('10.50'), { currency: 'USD' });
```

## Mixing Calculator Types

You can use different calculators for different purposes:

```typescript
import { genkin as numberGenkin } from '@genkin/core';
import { createGenkin, bigintCalculator } from '@genkin/core';

// Standard number-based amounts
const regularAmount = numberGenkin(10.50, { currency: 'USD' });

// BigInt for large amounts
const bigintGenkin = createGenkin(bigintCalculator);
const largeAmount = bigintGenkin(999999999999n, {
  currency: 'USD',
  precision: 2,
  isMinorUnits: true
});
```

## Performance Considerations

Different calculators have different performance characteristics:

| Calculator | Speed | Precision | Use Case |
|------------|-------|-----------|----------|
| `number` | Fastest | ~15 digits | Most applications |
| `bigint` | Fast | Unlimited | Large integers |
| `Big.js` | Slower | Unlimited | Exact decimals |
| `Decimal.js` | Slower | Unlimited | Scientific calculations |

## Generic Operations

Create operations for any calculator:

```typescript
import { createOperations, bigintCalculator, createGenkin } from '@genkin/core';

const genkin = createGenkin(bigintCalculator);
const ops = createOperations(bigintCalculator);

// All operations available
const { add, subtract, multiply, divide, allocate } = ops;
const { equals, lessThan, greaterThan, min, max } = ops;

const a = genkin(1000n, { currency: 'USD', precision: 2, isMinorUnits: true });
const b = genkin(500n, { currency: 'USD', precision: 2, isMinorUnits: true });

console.log(ops.lessThan(b, a)); // true
console.log(ops.max(a, b).minorUnits); // 1000n
```

## Lifecycle Hooks

Add hooks when creating calculators:

```typescript
import { createGenkin, bigintCalculator } from '@genkin/core';

const genkin = createGenkin({
  calculator: bigintCalculator,
  onCreate: (options) => {
    console.log('Creating Genkin with:', options);
  }
});

const amount = genkin(1000n, { currency: 'USD' });
// Logs: "Creating Genkin with: { currency: 'USD' }"
```

## Best Practices

1. **Choose the Right Calculator**: Match calculator to your precision needs
2. **Consistent Types**: Use the same calculator throughout your application
3. **Type Safety**: Let TypeScript infer the numeric type from your calculator
4. **Performance**: Use `number` for most cases, upgrade when needed
5. **Testing**: Test edge cases with your chosen calculator

## Examples

### Cryptocurrency with BigInt

```typescript
import { createGenkin, bigintCalculator, createOperations } from '@genkin/core';

const genkin = createGenkin(bigintCalculator);
const ops = createOperations(bigintCalculator);

// Bitcoin with 8 decimal places (satoshis)
const btc = genkin(50000000n, {
  currency: 'BTC',
  precision: 8,
  isMinorUnits: true
});

console.log(btc.amount); // 0n (BigInt can't represent 0.5)
console.log(btc.minorUnits); // 50000000n (satoshis)
```

### Exact Decimal Calculations with Big.js

```typescript
import Big from 'big.js';
import { createGenkin, bigjsCalculator, createOperations } from '@genkin/core';

const genkin = createGenkin(bigjsCalculator);
const ops = createOperations(bigjsCalculator);

// Complex percentage calculation
const price = genkin(new Big('99.99'), { currency: 'USD' });
const tax = ops.multiply(price, new Big('0.0875')); // 8.75% tax
const total = ops.add(price, tax);

console.log(total.amount.toString()); // "108.73625"
```

## Next Steps

- See the [Calculator API reference](../api/types#calculator)
- Learn about [precision and rounding](./precision-and-rounding)
- Explore [operations](./operations) with custom calculators

