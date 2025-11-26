# Migrating from Dinero.js to Genkin

This guide shows how to migrate from Dinero.js to Genkin using the compatibility layers for a smooth transition.

## Table of Contents
- [Dinero.js v1 Migration](#dinerojs-v1-migration)
- [Dinero.js v2 Migration](#dinerojs-v2-migration)
- [Gradual Migration Strategy](#gradual-migration-strategy)
- [Import Patterns](#import-patterns)

## Dinero.js v1 Migration

### Step 1: Update Your Imports

**Before (Dinero.js v1):**
```javascript
import Dinero from 'dinero.js';
```

**After (Genkin with compatibility layer):**
```javascript
import { Dinero } from 'genkin/dinero';
// or
import Dinero from 'genkin/dinero'; // default export
```

### Step 2: Update Your Code (No Changes Needed!)

Your existing Dinero.js v1 code should work without modifications:

```javascript
// This code works exactly the same with Genkin's compatibility layer
const price = Dinero({ amount: 2000, currency: 'USD' });
const tax = Dinero({ amount: 200, currency: 'USD' });
const total = price.add(tax);

console.log(total.toNumber()); // 22.00
console.log(total.getAmount()); // 2200 (minor units)
console.log(total.getCurrency()); // 'USD'

// Allocation works the same
const [part1, part2, part3] = total.allocate([50, 30, 20]);
console.log(part1.getAmount()); // 1100
console.log(part2.getAmount()); // 660
console.log(part3.getAmount()); // 440

// Comparisons work the same
const bigPrice = Dinero({ amount: 5000, currency: 'USD' });
console.log(total.lessThan(bigPrice)); // true
console.log(total.equals(bigPrice)); // false
```

### Step 3: Advanced Features

The compatibility layer supports all major Dinero.js v1 features:

```javascript
// Custom precision
const btc = Dinero({ amount: 12345678, currency: 'BTC', precision: 8 });
console.log(btc.toNumber()); // 0.12345678

// Currency objects
const eurCurrency = { code: 'EUR', precision: 2 };
const eurMoney = Dinero({ amount: 1000, currency: eurCurrency });

// Static utility functions
import { DineroStatic } from 'genkin/dinero';

const money1 = Dinero({ amount: 105, currency: 'USD', precision: 1 }); // 10.5
const money2 = Dinero({ amount: 1055, currency: 'USD', precision: 2 }); // 10.55

// Normalize precision across instances
const [normalized1, normalized2] = DineroStatic.normalizePrecision([money1, money2]);
console.log(normalized1.getPrecision()); // 2
console.log(normalized2.getPrecision()); // 2

// Find min/max
const amounts = [
  Dinero({ amount: 1000 }),
  Dinero({ amount: 2000 }),
  Dinero({ amount: 1500 })
];
const min = DineroStatic.minimum(amounts);
const max = DineroStatic.maximum(amounts);
```

## Dinero.js v2 Migration

### Step 1: Update Your Imports

**Before (Dinero.js v2):**
```javascript
import { dinero, add, subtract, multiply, divide, toDecimal } from 'dinero.js';
import { USD, EUR } from '@dinero.js/currencies';
```

**After (Genkin with compatibility layer):**
```javascript
import { dinero, add, subtract, multiply, divide, toDecimal } from 'genkin/dineroV2';

// Define currencies inline (or import from genkin/currencies later)
const USD = { code: 'USD', scale: 2 };
const EUR = { code: 'EUR', scale: 2 };
```

### Step 2: Update Your Code (Minimal Changes)

Your existing Dinero.js v2 code works with minimal changes:

```javascript
// Create money instances (same API)
const price = dinero({ amount: 2000, currency: USD });
const tax = dinero({ amount: 200, currency: USD });

// Arithmetic operations (same API)
const total = add(price, tax);

// Conversion functions (same API)
console.log(toDecimal(total)); // "22"
console.log(total.toJSON()); // { amount: 2200, currency: { code: 'USD', scale: 2 }, scale: 2 }

// Comparisons (same API)
const bigPrice = dinero({ amount: 5000, currency: USD });
console.log(lessThan(total, bigPrice)); // true
console.log(equals(total, bigPrice)); // false

// Allocation (same API)
const allocated = allocate(total, [50, 30, 20]);
console.log(allocated.length); // 3
console.log(toDecimal(allocated[0])); // "11"
console.log(toDecimal(allocated[1])); // "6.6"
console.log(toDecimal(allocated[2])); // "4.4"
```

### Step 3: High Precision and Different Currencies

```javascript
// High precision currencies
const highPrecUSD = { code: 'USD', scale: 4 };
const precise = dinero({ amount: 123456, currency: highPrecUSD });
console.log(toDecimal(precise)); // "12.3456"

// Zero precision currencies (like JPY)
const JPY = { code: 'JPY', scale: 0 };
const yen = dinero({ amount: 1000, currency: JPY });
console.log(toDecimal(yen)); // "1000"
```

## Gradual Migration Strategy

### Phase 1: Drop-in Replacement
Simply change your imports to use Genkin's compatibility layers. Your code continues to work unchanged.

### Phase 2: Mixed Usage
Start using native Genkin APIs alongside the compatibility layer:

```javascript
// Legacy code using compatibility layer
import { Dinero } from 'genkin/dinero';
const legacyMoney = Dinero({ amount: 1000, currency: 'USD' });

// New code using native Genkin
import { genkin } from 'genkin';
import { USD } from 'genkin/currencies';
const newMoney = genkin(10.00, { currency: USD });

// They represent the same value!
console.log(legacyMoney.toNumber() === newMoney.amount); // true
```

### Phase 3: Full Migration
Gradually convert your codebase to use native Genkin APIs:

```javascript
import { genkin, add, multiply } from 'genkin';
import { USD } from 'genkin/currencies';

const price = genkin(20.00, { currency: USD });
const taxRate = 0.1;
const tax = multiply(price, taxRate);
const total = add(price, tax);

console.log(total.amount); // 22
console.log(total.toString()); // "$22.00"
```

## Import Patterns

### Pattern 1: Direct Replacement (Immediate)
```javascript
// Change this:
// import Dinero from 'dinero.js';
// To this:
import Dinero from 'genkin/dinero';

// Change this:
// import { dinero, add } from 'dinero.js';
// To this:
import { dinero, add } from 'genkin/dineroV2';
```

### Pattern 2: Module Aliases (Intermediate)
```javascript
// Use aliases to differentiate between old and new APIs
import { Dinero as DineroCompat } from 'genkin/dinero';
import { genkin as GenkinNative } from 'genkin';

// Gradually migrate function by function
const compatMoney = DineroCompat({ amount: 1000 });
const nativeMoney = GenkinNative(10.00, { currency: 'USD' });
```

### Pattern 3: Native APIs (Target)
```javascript
// Final state: using native Genkin APIs exclusively
import { genkin, add, multiply, allocate } from 'genkin';
import { USD, EUR } from 'genkin/currencies';

const money = genkin(100.00, { currency: USD });
const doubled = multiply(money, 2);
const parts = allocate(doubled, [1, 1, 1]);
```

## Benefits of Migration

1. **Performance**: Genkin is designed to be lightweight and fast
2. **Modern APIs**: Native ES modules, TypeScript support
3. **Tree Shaking**: Import only what you need
4. **Active Development**: Continued support and new features
5. **Gradual Migration**: No need to rewrite everything at once

## Common Gotchas

### Currency Definitions
Dinero.js v2 uses the `@dinero.js/currencies` package, but with Genkin you can:

```javascript
// Option 1: Define currencies inline
const USD = { code: 'USD', scale: 2 };

// Option 2: Use Genkin's currency definitions
import { USD } from 'genkin/currencies';

// Option 3: Create custom currencies
import { createCurrency } from 'genkin/currencies';
const CUSTOM = createCurrency({
  code: 'CUSTOM',
  numeric: 999,
  precision: 3,
  symbol: '¤',
  name: 'Custom Currency'
});
```

### Precision vs Scale
- Dinero.js v2 uses "scale" terminology
- Dinero.js v1 and Genkin use "precision" terminology
- The compatibility layers handle this automatically

### Method vs Function Style
- Dinero.js v1 uses methods: `money.add(other)`
- Dinero.js v2 uses functions: `add(money, other)`
- Genkin supports both via compatibility layers and offers native function-style APIs

This migration path ensures you can adopt Genkin at your own pace while maintaining full compatibility with your existing Dinero.js code.
