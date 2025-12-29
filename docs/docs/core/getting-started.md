---
sidebar_position: 1
---

# Getting Started with @genkin/core

The `@genkin/core` package provides the fundamental building blocks for currency and money calculations in Genkin.

## Installation

```bash
bun add @genkin/core
```

## Basic Usage

### Creating Money Amounts

```typescript
import { genkin, USD } from '@genkin/core';

// Create a money amount (amount in minor units)
const price = genkin(1000, { currency: USD }); // $10.00
console.log(price.amount); // 1000 (minor units)
console.log(price.toString()); // "$10.00"
```

### Arithmetic Operations

```typescript
import { add, subtract, multiply, divide } from '@genkin/core';

const price1 = genkin(1000, { currency: USD }); // $10.00
const price2 = genkin(500, { currency: USD });  // $5.00

const total = add(price1, price2);        // $15.00
const difference = subtract(price1, price2); // $5.00
const doubled = multiply(price1, 2);     // $20.00
const half = divide(price1, 2);          // $5.00
```

### Currency Support

```typescript
import { getCurrencyConfig } from '@genkin/core';

// Built-in currency support
const usdConfig = getCurrencyConfig('USD');
console.log(usdConfig); // { code: 'USD', precision: 2, symbol: '$', ... }

// Create custom currencies
import { createCurrency } from '@genkin/core';

const customCurrency = createCurrency({
  code: 'BTC',
  precision: 8,
  symbol: '₿',
  name: 'Bitcoin'
});
```

## Advanced Features

### Generic Factory

```typescript
import { createGenkin, GenericGenkin } from '@genkin/core';

const bigintGenkin = createGenkin(bigintCalculator);
const amount = bigintGenkin(1000n, { currency: USD });
```

### Custom Calculators

```typescript
import { Calculator, numberCalculator } from '@genkin/core';

// Create a custom calculator for Big.js
const bigjsCalculator: Calculator<BigJs> = {
  add: (a, b) => new BigJs(a).add(b),
  subtract: (a, b) => new BigJs(a).subtract(b),
  // ... other operations
};
```

## Type Safety

Genkin is built with TypeScript first-class support:

```typescript
import type { Genkin, CurrencyCode } from '@genkin/core';

// Fully typed
const amount: Genkin = genkin(1000, { currency: USD });
const currencyCode: CurrencyCode = 'USD';
```

## API Reference

- [Genkin class](./api/genkin)
- [Operations](./api/operations)
- [Currencies](./api/currencies)
- [Calculators](./api/calculators)