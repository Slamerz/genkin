---
sidebar_position: 1
---

# Migrating from Dinero.js v2

The `@genkin/dinero-v2` package provides a drop-in replacement for Dinero.js v2 with support for generic numeric types.

> **Note:** Unlike `@genkin/dinero` (v1 compatibility), Dinero v2 requires currency objects, not strings. This matches the original Dinero.js v2 API.

## Installation

```bash
bun add @genkin/dinero-v2 @genkin/currencies
```

## Drop-in Replacement

### Before (Dinero.js v2)

```typescript
import { dinero, add, toDecimal } from 'dinero.js';

const price = dinero({ amount: 1000, currency: USD });
const total = add(price, dinero({ amount: 500, currency: USD }));
console.log(toDecimal(total)); // "15.00"
```

### After (@genkin/dinero-v2)

```typescript
import { dinero, add, toDecimal } from '@genkin/dinero-v2';
import { USD } from '@genkin/currencies';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
const total = add(price, dinero({ amount: 500, currency: USD, scale: 2 }));
console.log(toDecimal(total)); // "15.00"
```

## Key Differences

### 1. Currency Objects

**Before:**
```typescript
import { USD } from 'dinero.js';
const amount = dinero({ amount: 1000, currency: USD });
```

**After:**
```typescript
import { USD } from '@genkin/currencies';
const amount = dinero({ amount: 1000, currency: USD, scale: 2 });
```

### 2. Generic Type Support

Genkin supports any numeric type:

```typescript
import { createDinero, bigintCalculator } from '@genkin/dinero-v2';

const bigintDinero = createDinero({ calculator: bigintCalculator });
const price = bigintDinero({ amount: 1000n, currency: USD_BIGINT, scale: 2n });
```

## API Compatibility

All Dinero.js v2 methods are supported:

### Creation

```typescript
import { dinero } from '@genkin/dinero-v2';
import { USD } from '@genkin/currencies';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
```

### Arithmetic

```typescript
import { add, subtract, multiply, divide } from '@genkin/dinero-v2';

const total = add(price1, price2);
const difference = subtract(price1, price2);
const doubled = multiply(price1, 2);
const half = divide(price1, 2);
```

### Comparison

```typescript
import { equal, greaterThan, lessThan } from '@genkin/dinero-v2';

equal(price1, price2);        // true/false
greaterThan(price1, price2);  // true/false
lessThan(price1, price2);     // true/false
```

### Formatting

```typescript
import { toDecimal, toUnits } from '@genkin/dinero-v2';

toDecimal(price);  // "10.00"
toUnits(price);     // [10, 0] for $10.00
```

### Utilities

```typescript
import { toSnapshot, normalizeScale, trimScale } from '@genkin/dinero-v2';

const snapshot = toSnapshot(price);
const normalized = normalizeScale([price1, price2]);
const trimmed = trimScale(price);
```

## Generic Calculator Support

### BigInt Support

```typescript
import { createDinero, bigintCalculator } from '@genkin/dinero-v2';
import { USD_BIGINT } from '@genkin/currencies';

const bigintDinero = createDinero({ calculator: bigintCalculator });
const price = bigintDinero({ amount: 1000n, currency: USD_BIGINT, scale: 2n });
```

### Custom Calculators

```typescript
import { createDinero, Calculator } from '@genkin/dinero-v2';

const bigjsCalculator: Calculator<BigJs> = {
  add: (a, b) => new BigJs(a).add(b),
  subtract: (a, b) => new BigJs(a).subtract(b),
  multiply: (a, b) => new BigJs(a).multiply(b),
  divide: (a, b) => new BigJs(a).divide(b),
  // ... other operations
};

const bigjsDinero = createDinero({ calculator: bigjsCalculator });
```

## Migration Steps

1. **Install packages:**
   ```bash
   bun add @genkin/dinero-v2 @genkin/currencies
   bun remove dinero.js
   ```

2. **Update imports:**
   ```typescript
   // Replace
   import { dinero, add } from 'dinero.js';

   // With
   import { dinero, add } from '@genkin/dinero-v2';
   import { USD } from '@genkin/currencies';
   ```

3. **Update currency references:**
   ```typescript
   // If using built-in currencies, replace:
   import { USD } from 'dinero.js';
   // With:
   import { USD } from '@genkin/currencies';
   ```

4. **Add scale parameter:**
   ```typescript
   // Add scale to dinero calls
   dinero({ amount: 1000, currency: USD, scale: 2 });
   ```

## Benefits

- **Generic Types**: Support for BigInt, Big.js, and custom types
- **Better Performance**: Optimized for each numeric type
- **Type Safety**: Enhanced TypeScript support
- **Accuracy**: Precise calculations without floating-point issues
- **Extensibility**: Easy to add custom calculators

## Advanced Features

### Multi-base Currency Support

```typescript
// British Pound (old system): 20 shillings, 12 pence
const GBP_OLD = {
  code: 'GBP',
  base: [20, 12],
  exponent: 1
};

const amount = dinero({ amount: 267, currency: GBP_OLD, scale: 1 });
toUnits(amount); // [1, 2, 3] - 1 pound, 2 shillings, 3 pence
```

### Scale Operations

```typescript
import { transformScale, trimScale } from '@genkin/dinero-v2';

const scaled = transformScale(price, 3);  // Change to 3 decimal places
const trimmed = trimScale(price);         // Remove trailing zeros
```