# @genkin/currencies

ISO 4217 currency definitions and utilities for Genkin.

## Installation

```bash
bun add @genkin/currencies @genkin/core
```

## Usage

```typescript
import { USD, EUR, GBP } from '@genkin/currencies';
import { genkin } from '@genkin/core';

const usdAmount = genkin(1000, { currency: USD }); // $10.00
const eurAmount = genkin(850, { currency: EUR }); // €8.50
const gbpAmount = genkin(750, { currency: GBP }); // £7.50
```

## Features

- Complete ISO 4217 currency support
- 180+ currency definitions
- Type-safe currency codes
- Currency formatting utilities
- Auto-registration with currency registry

## API

See the [documentation](https://slamerz.github.io/genkin/) for complete API reference.