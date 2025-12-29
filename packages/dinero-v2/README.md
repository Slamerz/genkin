# @genkin/dinero-v2

Dinero.js v2 compatible API built on Genkin core with support for generic numeric types.

## Installation

```bash
bun add @genkin/dinero-v2 @genkin/core
```

## Usage

```typescript
import { dinero, add, toDecimal } from '@genkin/dinero-v2';
import { USD } from '@genkin/currencies';

const price = dinero({ amount: 1000, currency: USD, scale: 2 }); // $10.00
const total = add(price, dinero({ amount: 500, currency: USD, scale: 2 })); // $15.00
console.log(toDecimal(total)); // "15.00"
```

## Generic Numeric Types

Works with any numeric type including BigInt, Big.js, and custom types:

```typescript
import { createDinero, bigintCalculator } from '@genkin/dinero-v2';
import { USD_BIGINT } from '@genkin/currencies';

const bigintDinero = createDinero({ calculator: bigintCalculator });
const price = bigintDinero({ amount: 1000n, currency: USD_BIGINT, scale: 2n });
```

## Migration from Dinero.js v2

This package provides a drop-in replacement for Dinero.js v2:

```typescript
// Before (Dinero.js v2)
import { dinero, add } from 'dinero.js';
const amount = dinero({ amount: 1000, currency: USD });

// After (@genkin/dinero-v2)
import { dinero, add } from '@genkin/dinero-v2';
import { USD } from '@genkin/currencies';
const amount = dinero({ amount: 1000, currency: USD });
```

## Features

- Full Dinero.js v2 API compatibility
- Generic numeric type support (number, bigint, Big.js, custom)
- High-precision decimal arithmetic
- Currency conversion and formatting
- TypeScript first-class support

## API

See the [documentation](https://genkin.dev) for complete API reference.