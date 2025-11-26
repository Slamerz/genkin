# Genkin.js

A JavaScript library for making currency math easy and accurate.

## About

Genkin.js is inspired by [Dinero.js](https://dinerojs.com/), which we loved using for precise monetary calculations. When Dinero.js v2 development was abandoned, we decided to create Genkin.js to fill that gap and provide developers with a reliable, modern solution for currency operations.

## Why Genkin.js?

Working with money in JavaScript is notoriously tricky due to floating-point precision issues. Genkin.js solves this by:

- **Precision**: Uses integer-based calculations to avoid floating-point errors
- **Type Safety**: Built with TypeScript for better developer experience
- **Immutability**: Operations return new instances, preventing accidental mutations
- **Flexibility**: Support for multiple currencies and custom formatting
- **Modern**: Designed for modern JavaScript environments with ESM support

## Features

- Precise monetary calculations (addition, subtraction, multiplication, division)
- Currency conversion support  
- Multiple output formats (string, object, number)
- Internationalization support
- Zero dependencies
- Lightweight and tree-shakeable
- Full TypeScript support
- **Dinero.js compatibility layers** for easy migration

## Migration from Dinero.js

Genkin provides backward-compatible APIs that make migrating from Dinero.js seamless:

### Dinero.js v1 Compatibility
```javascript
// Just change your import - no code changes needed!
// import Dinero from 'dinero.js';
import Dinero from 'genkin/dinero';

const price = Dinero({ amount: 2000, currency: 'USD' });
const tax = Dinero({ amount: 200, currency: 'USD' }); 
const total = price.add(tax);
console.log(total.toNumber()); // 22.00
```

### Dinero.js v2 Compatibility  
```javascript
// Just change your import - minimal code changes!
// import { dinero, add } from 'dinero.js';
import { dinero, add, toDecimal } from 'genkin/dineroV2';

const USD = { code: 'USD', scale: 2 };
const price = dinero({ amount: 2000, currency: USD });
const tax = dinero({ amount: 200, currency: USD });
const total = add(price, tax);
console.log(toDecimal(total)); // "22"
```

### Gradual Migration to Native API
```javascript
// Eventually migrate to native Genkin for better performance
import { genkin, add } from 'genkin';
import { USD } from 'genkin/currencies';

const price = genkin(20.00, { currency: USD });
const tax = genkin(2.00, { currency: USD });
const total = add(price, tax);
console.log(total.amount); // 22
```

See [Migration Guide](examples/dinero-migration.md) for detailed migration instructions.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
