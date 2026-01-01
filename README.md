# Genkin

[![npm](https://img.shields.io/npm/dy/@genkin/core?label=@Genkin/Core:%200.1.1)](https://www.npmjs.com/package/@genkin/core)

[![npm](https://img.shields.io/npm/dy/@genkin/currencies?label=@Genkin/Currencies:%200.1.0)](https://www.npmjs.com/package/@genkin/currencies)

[![npm](https://img.shields.io/npm/dy/@genkin/dinero?label=@Genkin/Dinero:%200.1.0)](https://www.npmjs.com/package/@genkin/dinero)

[![npm](https://img.shields.io/npm/dy/@genkin/dinero-v2?label=@Genkin/Dinero-v2:%200.1.0)](https://www.npmjs.com/package/@genkin/dinero-v2)

High-precision currency and money calculations in TypeScript

Say goodbye to floating-point precision errors. Genkin provides rock-solid financial calculations with full TypeScript support and drop-in compatibility for existing Dinero.js projects.

**[Read the Docs](https://slamerz.github.io/genkin/)**

## Why Choose Genkin?

Built for developers who demand precision and reliability in financial calculations

### Perfect Precision

Integer-based arithmetic eliminates floating-point errors. Your calculations will always be accurate, no matter how complex.

### Drop-in Compatible

Seamlessly migrate from Dinero.js v1 or v2. Keep your existing code while gaining better performance and TypeScript support.

### TypeScript First

Full type safety with excellent developer experience. Catch errors at compile time, not runtime.

## Packages

Choose the packages that fit your needs

### [@genkin/core](https://www.npmjs.com/package/@genkin/core)

The foundation of Genkin. High-precision arithmetic with integer-based calculations, currency formatting, and generic numeric type support for maximum accuracy and performance.

### [@genkin/currencies](https://www.npmjs.com/package/@genkin/currencies)

Complete ISO 4217 currency support with 180+ currencies. Type-safe currency codes, automatic formatting, and seamless integration with the currency registry.

### [@genkin/dinero](https://www.npmjs.com/package/@genkin/dinero)

Dinero.js v1 compatible API built on Genkin core for easy migration.

### [@genkin/dinero-v2](https://www.npmjs.com/package/@genkin/dinero-v2)

Dinero.js v2 compatible API with generic numeric types (BigInt, Big.js) for unlimited precision.

## Quick Start

### For New Projects

```bash
# Install core and currencies
bun add @genkin/core @genkin/currencies
```

Perfect for new applications requiring precise financial calculations.

### Migrating from Dinero.js?

```bash
# For Dinero.js v1 projects
bun add @genkin/dinero @genkin/currencies

# For Dinero.js v2 projects
bun add @genkin/dinero-v2 @genkin/currencies
```

Drop-in replacements with enhanced performance and TypeScript support.

## Basic Usage

### Core API

```typescript
import { genkin, add } from '@genkin/core';
import { USD } from '@genkin/currencies';

const price = genkin(1999, { currency: USD }); // $19.99
const tax = genkin(299, { currency: USD });    // $2.99
const total = add(price, tax);                 // $22.98

console.log(total.toString()); // "$22.98"
```

### Dinero.js Migration

```typescript
// Before (Dinero.js v1)
import { Dinero } from 'dinero.js';
const amount = Dinero({ amount: 1000, currency: 'USD' });

// After (@genkin/dinero)
import { Dinero } from '@genkin/dinero';
const amount = Dinero({ amount: 1000, currency: 'USD' });
```

### Generic Types (Dinero.js v2)

```typescript
import { dinero, add } from '@genkin/dinero-v2';

// Works with BigInt for unlimited precision
const price = dinero({
  amount: 1000000000n,
  currency: USD,
  scale: 2n
});

// Or with Big.js for decimal precision
const rate = dinero({
  amount: new BigJs('1.0599'),
  currency: USD,
  scale: 4
});
```

## Features

- **Precise monetary calculations** (addition, subtraction, multiplication, division)
- **Currency conversion support**
- **Multiple output formats** (string, object, number)
- **Internationalization support**
- **Zero dependencies**
- **Lightweight and tree-shakeable**
- **Full TypeScript support**
- **Dinero.js compatibility layers** for easy migration
- **Dynamic currency registry** supporting all ISO 4217 currencies and custom currencies
- **Generic numeric types** for unlimited precision (BigInt, Big.js)

## License

MIT © [Slamerz](https://github.com/Slamerz)
