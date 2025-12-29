---
sidebar_position: 2
---

# Dinero.js v1 API Reference

Complete API reference for the Dinero.js v1 compatibility layer.

## Overview

The `@genkin/dinero` package provides full compatibility with Dinero.js v1 API while using Genkin's core underneath.

## Factory Function

### `Dinero(options)`

Create a Dinero v1 instance.

**Parameters:**
- `options` (DineroV1Options): Configuration options

**Returns:** `DineroV1Instance`

**Example:**
```typescript
import Dinero from '@genkin/dinero';

const price = Dinero({ amount: 1000, currency: 'USD' });
console.log(price.getAmount()); // 1000 (cents)
```

## Options

### `DineroV1Options`

```typescript
interface DineroV1Options {
  amount?: number;
  currency?: string | DineroV1Currency;
  precision?: number;
}
```

**Example:**
```typescript
const price = Dinero({
  amount: 1000,
  currency: 'USD',
  precision: 2
});
```

## Instance Methods

### Getters

#### `getAmount()`

Get the amount in minor units.

**Returns:** `number`

```typescript
const price = Dinero({ amount: 1000 });
console.log(price.getAmount()); // 1000
```

#### `getCurrency()`

Get the currency code.

**Returns:** `string`

```typescript
const price = Dinero({ amount: 1000, currency: 'USD' });
console.log(price.getCurrency()); // "USD"
```

#### `getPrecision()`

Get the precision.

**Returns:** `number`

```typescript
const price = Dinero({ amount: 1000, currency: 'USD' });
console.log(price.getPrecision()); // 2
```

#### `toUnit()`

Get the amount in major units.

**Returns:** `number`

```typescript
const price = Dinero({ amount: 1000 });
console.log(price.toUnit()); // 10
```

### Arithmetic

#### `add(addend)`

Add another Dinero instance.

**Parameters:**
- `addend` (DineroV1Instance): Amount to add

**Returns:** `DineroV1Instance`

```typescript
const a = Dinero({ amount: 1000 });
const b = Dinero({ amount: 500 });
const sum = a.add(b);
console.log(sum.getAmount()); // 1500
```

#### `subtract(subtrahend)`

Subtract another Dinero instance.

**Parameters:**
- `subtrahend` (DineroV1Instance): Amount to subtract

**Returns:** `DineroV1Instance`

```typescript
const a = Dinero({ amount: 1000 });
const b = Dinero({ amount: 300 });
const diff = a.subtract(b);
console.log(diff.getAmount()); // 700
```

#### `multiply(multiplier)`

Multiply by a number.

**Parameters:**
- `multiplier` (number): Factor to multiply by

**Returns:** `DineroV1Instance`

```typescript
const price = Dinero({ amount: 1000 });
const doubled = price.multiply(2);
console.log(doubled.getAmount()); // 2000
```

#### `divide(divisor)`

Divide by a number.

**Parameters:**
- `divisor` (number): Number to divide by

**Returns:** `DineroV1Instance`

```typescript
const total = Dinero({ amount: 1000 });
const half = total.divide(2);
console.log(half.getAmount()); // 500
```

#### `percentage(percent)`

Calculate a percentage.

**Parameters:**
- `percent` (number): Percentage value

**Returns:** `DineroV1Instance`

```typescript
const price = Dinero({ amount: 10000 }); // $100
const tax = price.percentage(8); // 8%
console.log(tax.getAmount()); // 800 ($8)
```

#### `allocate(ratios)`

Distribute across ratios.

**Parameters:**
- `ratios` (number[]): Distribution ratios

**Returns:** `DineroV1Instance[]`

```typescript
const total = Dinero({ amount: 10000 });
const [first, second] = total.allocate([25, 75]);
console.log(first.getAmount());  // 2500
console.log(second.getAmount()); // 7500
```

### Comparison

#### `equalsTo(comparator)`

Check equality.

**Parameters:**
- `comparator` (DineroV1Instance): Amount to compare

**Returns:** `boolean`

```typescript
const a = Dinero({ amount: 1000 });
const b = Dinero({ amount: 1000 });
console.log(a.equalsTo(b)); // true
```

#### `lessThan(comparator)`

Check if less than.

**Parameters:**
- `comparator` (DineroV1Instance): Amount to compare

**Returns:** `boolean`

```typescript
const a = Dinero({ amount: 500 });
const b = Dinero({ amount: 1000 });
console.log(a.lessThan(b)); // true
```

#### `greaterThan(comparator)`

Check if greater than.

**Parameters:**
- `comparator` (DineroV1Instance): Amount to compare

**Returns:** `boolean`

```typescript
const a = Dinero({ amount: 1000 });
const b = Dinero({ amount: 500 });
console.log(a.greaterThan(b)); // true
```

#### `isZero()`

Check if zero.

**Returns:** `boolean`

```typescript
const zero = Dinero({ amount: 0 });
console.log(zero.isZero()); // true
```

#### `isPositive()`

Check if positive.

**Returns:** `boolean`

```typescript
const positive = Dinero({ amount: 1000 });
console.log(positive.isPositive()); // true
```

#### `isNegative()`

Check if negative.

**Returns:** `boolean`

```typescript
const negative = Dinero({ amount: -1000 });
console.log(negative.isNegative()); // true
```

#### `hasSubUnits()`

Check if has fractional parts.

**Returns:** `boolean`

```typescript
const withCents = Dinero({ amount: 1050 });
const wholeDollars = Dinero({ amount: 1000 });
console.log(withCents.hasSubUnits()); // true
console.log(wholeDollars.hasSubUnits()); // false
```

### Conversion

#### `convert(currency, options)`

Convert to another currency.

**Parameters:**
- `currency` (string): Target currency code
- `options` (object): Conversion options with `endpoint` function

**Returns:** `Promise<DineroV1Instance>`

```typescript
const usd = Dinero({ amount: 10000, currency: 'USD' });
const eur = await usd.convert('EUR', {
  endpoint: async () => ({ rates: { EUR: 0.89 } })
});
```

### Formatting

#### `toFormat(format?)`

Format as string.

**Parameters:**
- `format` (string, optional): Format string

**Returns:** `string`

```typescript
const price = Dinero({ amount: 1000, currency: 'USD' });
console.log(price.toFormat()); // "$10.00"
console.log(price.toFormat('$0,0.00')); // "$10.00"
```

#### `toObject()`

Convert to plain object.

**Returns:** `object`

```typescript
const price = Dinero({ amount: 1000, currency: 'USD' });
const obj = price.toObject();
// { amount: 1000, currency: 'USD', precision: 2 }
```

## Static Methods

### `normalizePrecision(dineros)`

Normalize precision across instances.

**Parameters:**
- `dineros` (DineroV1Instance[]): Instances to normalize

**Returns:** `DineroV1Instance[]`

```typescript
const amounts = [
  Dinero({ amount: 100, precision: 1 }),
  Dinero({ amount: 1000, precision: 2 })
];
const normalized = Dinero.normalizePrecision(amounts);
```

### `minimum(dineros)`

Find minimum amount.

**Parameters:**
- `dineros` (DineroV1Instance[]): Instances to compare

**Returns:** `DineroV1Instance`

```typescript
const amounts = [
  Dinero({ amount: 1000 }),
  Dinero({ amount: 500 }),
  Dinero({ amount: 750 })
];
const min = Dinero.minimum(amounts);
console.log(min.getAmount()); // 500
```

### `maximum(dineros)`

Find maximum amount.

**Parameters:**
- `dineros` (DineroV1Instance[]): Instances to compare

**Returns:** `DineroV1Instance`

```typescript
const amounts = [
  Dinero({ amount: 1000 }),
  Dinero({ amount: 500 }),
  Dinero({ amount: 750 })
];
const max = Dinero.maximum(amounts);
console.log(max.getAmount()); // 1000
```

## Global Configuration

### `Dinero.globalLocale`

Set global locale for formatting.

```typescript
Dinero.globalLocale = 'en-US';
```

### `Dinero.defaultCurrency`

Set default currency.

```typescript
Dinero.defaultCurrency = 'USD';
```

### `Dinero.defaultPrecision`

Set default precision.

```typescript
Dinero.defaultPrecision = 2;
```

## See Also

- [Migration Guide](./migration-guide)
- [Dinero.js v1 Documentation](https://v1.dinerojs.com)
- [Genkin Core](../core/getting-started)

