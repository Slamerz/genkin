# @genkin/dinero

Dinero.js v1 compatible API built on the powerful Genkin core.

## Installation

```bash
bun add @genkin/dinero @genkin/core
```

## Usage

```typescript
import { Dinero } from '@genkin/dinero';
import { USD } from '@genkin/currencies';

const price = Dinero({ amount: 1000, currency: USD }); // $10.00
const total = price.add(Dinero({ amount: 500, currency: USD })); // $15.00
console.log(total.toFormat('$0,0.00')); // "$15.00"
```

## Migration from Dinero.js v1

This package provides a drop-in replacement for Dinero.js v1:

```typescript
// Before (Dinero.js v1)
import { Dinero } from 'dinero.js';
const amount = Dinero({ amount: 1000, currency: 'USD' });

// After (@genkin/dinero)
import { Dinero } from '@genkin/dinero';
import { USD } from '@genkin/currencies';
const amount = Dinero({ amount: 1000, currency: USD });
```

## Features

- Full Dinero.js v1 API compatibility
- High-precision decimal arithmetic
- Currency conversion with exchange rates
- Formatting and localization
- TypeScript support

## API

See the [documentation](https://genkin.dev) for complete API reference.