# @genkin/core

The core Genkin package provides currency and number formatting/math functionality.

## Installation

```bash
bun add @genkin/core
```

## Usage

```typescript
import { genkin, add, USD } from '@genkin/core';

const price = genkin(1000, { currency: USD }); // $10.00
const total = add(price, genkin(500, { currency: USD })); // $15.00
```

## Features

- High-precision decimal arithmetic
- Currency formatting and conversion
- Generic numeric type support
- Allocation and scaling operations
- TypeScript first-class support

## API

See the [documentation](https://genkin.dev) for complete API reference.