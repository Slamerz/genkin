---
sidebar_position: 2
---

# Creating Monetary Amounts

Learn how to create and work with monetary amounts using Genkin.

## Basic Usage

The simplest way to create a monetary amount is using the `genkin` factory function:

```typescript
import { genkin } from '@genkin/core';

// Create a USD amount (defaults to USD if no currency specified)
const price = genkin(29.99);
console.log(price.toString()); // "$29.99"

// Specify currency explicitly
const euros = genkin(19.50, { currency: 'EUR' });
console.log(euros.toString()); // "€19.50"
```

## Using the Genkin Class

You can also use the `Genkin` class constructor directly:

```typescript
import { Genkin } from '@genkin/core';

const amount = new Genkin(100.50, { currency: 'USD' });
console.log(amount.amount); // 100.5
console.log(amount.currencyCode); // "USD"
```

## Working with Currency Objects

For better type safety and reusability, use currency objects from `@genkin/currencies`:

```typescript
import { genkin } from '@genkin/core';
import { USD, EUR, GBP, JPY } from '@genkin/currencies';

const usdAmount = genkin(100, { currency: USD });
const eurAmount = genkin(85, { currency: EUR });
const gbpAmount = genkin(75, { currency: GBP });
const jpyAmount = genkin(15000, { currency: JPY });
```

## Precision Control

Control the number of decimal places for your monetary amounts:

```typescript
import { genkin } from '@genkin/core';

// Standard 2 decimal places (cents)
const standard = genkin(10.50, { currency: 'USD', precision: 2 });

// High precision for cryptocurrency
const crypto = genkin(0.12345678, { currency: 'BTC', precision: 8 });

// Zero precision for currencies without sub-units
const yen = genkin(1000, { currency: 'JPY', precision: 0 });
```

## Minor Units vs Major Units

By default, amounts are specified in major units (dollars, euros, etc.). You can also work directly with minor units (cents, satoshis, etc.):

```typescript
import { genkin } from '@genkin/core';

// Major units (dollars)
const dollars = genkin(10.50, { currency: 'USD' });
console.log(dollars.amount); // 10.5
console.log(dollars.minorUnits); // 1050

// Minor units (cents)
const cents = genkin(1050, { 
  currency: 'USD', 
  isMinorUnits: true 
});
console.log(cents.amount); // 10.5
console.log(cents.minorUnits); // 1050
```

## Rounding Modes

Specify how fractional amounts should be rounded:

```typescript
import { genkin, RoundingMode } from '@genkin/core';

const amount = genkin(10.125, {
  currency: 'USD',
  precision: 2,
  rounding: RoundingMode.ROUND_HALF_UP
});

// Other rounding modes:
// - ROUND_HALF_EVEN (banker's rounding, default)
// - ROUND_UP (always round up)
// - ROUND_DOWN (always round down)
// - ROUND_HALF_DOWN
// - ROUND_TOWARDS_ZERO
// - ROUND_AWAY_FROM_ZERO
```

## Creating from Strings

Parse string amounts into Genkin instances:

```typescript
import { genkin } from '@genkin/core';

// Parse string as number
const amount = genkin('29.99', { currency: 'USD' });
console.log(amount.amount); // 29.99
```

## Custom Currencies

Create monetary amounts with custom currency configurations:

```typescript
import { genkin, createCurrency } from '@genkin/core';

const customCurrency = createCurrency({
  code: 'XAU',
  numeric: 959,
  precision: 4,
  symbol: 'oz',
  name: 'Gold Troy Ounce',
  base: 10
});

const gold = genkin(1.2345, { currency: customCurrency });
console.log(gold.toString()); // "1.2345 XAU"
```

## Negative Amounts

Genkin supports negative amounts for debts, refunds, or credits:

```typescript
import { genkin } from '@genkin/core';

const debt = genkin(-50.00, { currency: 'USD' });
const refund = genkin(-25.99, { currency: 'USD' });

console.log(debt.toString()); // "$-50.00"
```

## Zero Amounts

Create zero-value amounts:

```typescript
import { genkin, isZero } from '@genkin/core';

const zero = genkin(0, { currency: 'USD' });
console.log(isZero(zero)); // true
```

## Best Practices

1. **Use Currency Objects**: Import currencies from `@genkin/currencies` for type safety
2. **Specify Precision**: Always specify precision for cryptocurrencies or non-standard currencies
3. **Use Minor Units for APIs**: When working with payment APIs, use `isMinorUnits: true`
4. **Choose Appropriate Rounding**: Select rounding modes based on your business requirements
5. **Validate Input**: Always validate user input before creating monetary amounts

## Next Steps

- Learn about [arithmetic operations](./operations)
- Explore [precision and rounding](./precision-and-rounding)
- Work with [custom calculators](./custom-calculators) for BigInt or Big.js

