# USD Currency Usage Examples

The Genkin.js library now includes a complete USD currency module that provides type-safe, precise currency handling for US Dollars.

## Basic Usage

### Importing

```typescript
// Import just USD
import { USD } from 'genkin/currencies';

// Import from main package
import { USD } from 'genkin';

// Import everything from currencies
import * as Currencies from 'genkin/currencies';
const { USD } = Currencies;
```

### Formatting Currency

```typescript
import { USD } from 'genkin';

// Basic formatting
console.log(USD.format(1234.56)); // "$1,234.56"
console.log(USD.format(99.99));   // "$99.99"
console.log(USD.format(0.99));    // "$0.99"

// Custom formatting options
console.log(USD.format(1234.56, { showSymbol: false }));  // "1,234.56"
console.log(USD.format(1234.56, { showCode: true }));     // "$1,234.56 USD"
console.log(USD.format(1234.56, { showName: true }));     // "$1,234.56 (US Dollar)"
console.log(USD.format(1234.56, { useGrouping: false })); // "$1234.56"
console.log(USD.format(1234.56, { decimalPlaces: 3 }));   // "$1,234.560"
```

### Parsing Currency Strings

```typescript
import { USD } from 'genkin';

console.log(USD.parse('$1,234.56')); // 1234.56
console.log(USD.parse('1234.56'));   // 1234.56
console.log(USD.parse('$1000'));     // 1000
console.log(USD.parse('$0.99'));     // 0.99
```

## Using with Genkin Core

### Creating Money Objects

```typescript
import { genkin } from 'genkin';
import { USD } from 'genkin/currencies';

// Create a money object with USD
const price = genkin(99.99, { currency: USD });
console.log(price.toString()); // "$99.99"
console.log(price.currencyCode); // "USD"
console.log(price.precision);  // 2
```

### Money Operations

```typescript
import { genkin, add, subtract, multiply } from 'genkin';
import { USD } from 'genkin/currencies';

const price1 = genkin(99.99, { currency: USD });
const price2 = genkin(49.99, { currency: USD });

const total = add(price1, price2);
console.log(total.toString()); // "$149.98"

const discount = multiply(price1, 0.1);
console.log(discount.toString()); // "$10.00"

const salePrice = subtract(price1, discount);
console.log(salePrice.toString()); // "$89.99"
```

## Configuration Details

The USD currency is configured with:

- **Code**: `USD` (ISO 4217 standard)
- **Symbol**: `$`
- **Name**: `US Dollar`
- **Precision**: `2` decimal places

```typescript
import { USD_CONFIG } from 'genkin/currencies';

console.log(USD_CONFIG);
// {
//   code: 'USD',
//   precision: 2,
//   symbol: '$',
//   name: 'US Dollar'
// }
```

## Creating Custom USD Instances

```typescript
import { createUSD } from 'genkin/currencies';

const customUSD = createUSD();
console.log(customUSD.format(123.45)); // "$123.45"
```

## Tree-Shaking Friendly

The USD currency module is designed to be tree-shakable:

```typescript
// Only imports USD - small bundle size
import { USD } from 'genkin/currencies';

// Only imports the factory function
import { createUSD } from 'genkin/currencies';

// Import specific pieces
import { USD_CONFIG, USD_CODE } from 'genkin/currencies';
```

This modular approach ensures you only include what you need in your application bundle. 