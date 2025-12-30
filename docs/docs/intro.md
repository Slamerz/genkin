---
sidebar_position: 1
---

# Welcome to Genkin

Genkin is a powerful, high-precision currency and money calculation library for TypeScript. It provides drop-in replacements for popular libraries like Dinero.js while offering enhanced performance and flexibility.

## What is Genkin?

Genkin solves the fundamental problems with floating-point arithmetic in JavaScript by using integer-based calculations with proper scaling. This ensures accurate financial calculations without rounding errors.

## Key Features

- **High Precision**: Integer-based arithmetic with proper scaling
- **TypeScript First**: Full type safety and excellent developer experience
- **Multiple Packages**: Modular architecture for different use cases
- **Dinero.js Compatible**: Drop-in replacements for existing projects
- **Generic Types**: Support for BigInt, Big.js, and custom numeric types
- **180+ Currencies**: Complete ISO 4217 currency support

## Packages

### [@genkin/core](core/getting-started)

The core package provides the fundamental currency and arithmetic operations.

```typescript
import { genkin, add, USD } from '@genkin/core';

const price = genkin(1000, { currency: USD }); // $10.00
const total = add(price, genkin(500, { currency: USD })); // $15.00
```

### [@genkin/currencies](currencies/getting-started)

ISO 4217 currency definitions and utilities.

```typescript
import { USD, EUR, GBP } from '@genkin/currencies';
import { genkin } from '@genkin/core';
```

### [@genkin/dinero](dinero/migration-guide)

Dinero.js v1 compatible API built on Genkin core.

```typescript
import { Dinero } from '@genkin/dinero';
import { USD } from '@genkin/currencies';

const amount = Dinero({ amount: 1000, currency: USD });
```

### [@genkin/dinero-v2](dinero-v2/migration-guide)

Dinero.js v2 compatible API with generic numeric type support.

```typescript
import { dinero, add } from '@genkin/dinero-v2';
import { USD } from '@genkin/currencies';

const price = dinero({ amount: 1000, currency: USD, scale: 2 });
```

## Quick Start

```bash
# Install the packages you need
bun add @genkin/core @genkin/currencies

# Or install everything
bun add @genkin/core @genkin/currencies @genkin/dinero @genkin/dinero-v2
```

## Why Genkin?

- **Accuracy**: No floating-point precision issues
- **Performance**: Optimized integer arithmetic
- **Compatibility**: Drop-in replacements for existing libraries
- **Flexibility**: Support for different numeric types
- **Maintainable**: Clean, well-tested codebase

## Migration Guides

- [Migrating from Dinero.js v1](dinero/migration-guide)
- [Migrating from Dinero.js v2](dinero-v2/migration-guide)

## Community

- [GitHub](https://github.com/Slamerz/genkin)
- [Issues](https://github.com/Slamerz/genkin/issues)
- [NPM](https://www.npmjs.com/org/genkin)