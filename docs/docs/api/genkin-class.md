---
sidebar_position: 1
---

# Genkin Class API

Complete API reference for the Genkin class and factory function.

## Factory Function

### `genkin(amount, options?)`

Create a Genkin monetary amount.

**Parameters:**
- `amount` (number): The monetary amount
- `options` (GenkinOptions, optional): Configuration options

**Returns:** `Genkin` instance

**Example:**
```typescript
import { genkin } from '@genkin/core';

const amount = genkin(29.99, { currency: 'USD' });
```

## Constructor

### `new Genkin(amount, options?)`

Create a Genkin instance directly.

**Parameters:**
- `amount` (number): The monetary amount
- `options` (GenkinOptions, optional): Configuration options

**Example:**
```typescript
import { Genkin } from '@genkin/core';

const amount = new Genkin(29.99, { currency: 'USD' });
```

## Properties

### `amount`

Get the amount in major units (e.g., dollars).

**Type:** `number` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.amount); // 10.5
```

### `minorUnits`

Get the amount in minor units (e.g., cents).

**Type:** `number` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.minorUnits); // 1050
```

### `currency`

Get the currency object.

**Type:** `Currency` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.currency.code); // "USD"
console.log(price.currency.symbol); // "$"
```

### `currencyCode`

Get the ISO 4217 currency code.

**Type:** `string` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.currencyCode); // "USD"
```

### `precision`

Get the number of decimal places.

**Type:** `number` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.precision); // 2
```

### `rounding`

Get the rounding mode.

**Type:** `RoundingMode` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.rounding); // RoundingMode.ROUND_HALF_EVEN
```

### `currencyConfig`

Get the complete currency configuration.

**Type:** `CurrencyConfig` (readonly)

**Example:**
```typescript
const price = genkin(10.50, { currency: 'USD' });
console.log(price.currencyConfig);
// {
//   code: 'USD',
//   numeric: 840,
//   precision: 2,
//   symbol: '$',
//   name: 'US Dollar',
//   base: 10
// }
```

## Methods

### `hasSameCurrency(other)`

Check if another Genkin instance has the same currency.

**Parameters:**
- `other` (Genkin): Another Genkin instance

**Returns:** `boolean`

**Example:**
```typescript
const usd = genkin(10, { currency: 'USD' });
const eur = genkin(10, { currency: 'EUR' });

console.log(usd.hasSameCurrency(eur)); // false
```

### `hasSamePrecision(other)`

Check if another Genkin instance has the same precision.

**Parameters:**
- `other` (Genkin): Another Genkin instance

**Returns:** `boolean`

**Example:**
```typescript
const a = genkin(10, { currency: 'USD', precision: 2 });
const b = genkin(10, { currency: 'USD', precision: 3 });

console.log(a.hasSamePrecision(b)); // false
```

### `withAmount(newAmount)`

Create a new Genkin instance with a different amount.

**Parameters:**
- `newAmount` (number): The new amount

**Returns:** `Genkin`

**Example:**
```typescript
const original = genkin(10, { currency: 'USD' });
const updated = original.withAmount(20);

console.log(updated.amount); // 20
console.log(updated.currencyCode); // "USD"
```

### `withCurrency(newCurrency)`

Create a new Genkin instance with a different currency.

**Parameters:**
- `newCurrency` (Currency | CurrencyCode): The new currency

**Returns:** `Genkin`

**Example:**
```typescript
const usd = genkin(10, { currency: 'USD' });
const asEur = usd.withCurrency('EUR');

console.log(asEur.amount); // 10
console.log(asEur.currencyCode); // "EUR"
```

Note: This doesn't apply exchange rates.

### `convertPrecision(targetPrecision)`

Convert to a different precision.

**Parameters:**
- `targetPrecision` (number): The target precision

**Returns:** `Genkin`

**Example:**
```typescript
const amount = genkin(10.50, { currency: 'USD', precision: 2 });
const highPrecision = amount.convertPrecision(4);

console.log(highPrecision.precision); // 4
console.log(highPrecision.amount); // 10.50
```

### `toObject()`

Convert to a plain object.

**Returns:** `GenkinObject`

**Example:**
```typescript
const amount = genkin(10.50, { currency: 'USD' });
const obj = amount.toObject();

console.log(obj);
// {
//   amount: 10.5,
//   minorUnits: 1050,
//   currency: { code: 'USD', ... },
//   precision: 2,
//   rounding: 'ROUND_HALF_EVEN'
// }
```

### `toJSON()`

Convert to JSON representation.

**Returns:** `GenkinJSON`

**Example:**
```typescript
const amount = genkin(10.50, { currency: 'USD' });
const json = amount.toJSON();

console.log(JSON.stringify(json));
// {"amount":10.5,"currency":"USD","precision":2}
```

### `toString()`

Convert to string representation.

**Returns:** `string`

**Example:**
```typescript
const amount = genkin(10.50, { currency: 'USD' });
console.log(amount.toString()); // "$10.50"
```

### `valueOf()`

Get the numeric value (for implicit conversions).

**Returns:** `number`

**Example:**
```typescript
const amount = genkin(10.50, { currency: 'USD' });
console.log(amount.valueOf()); // 10.5
console.log(+amount); // 10.5
```

## Types

### `GenkinOptions`

Configuration options for creating Genkin instances.

```typescript
interface GenkinOptions {
  currency?: Currency | CurrencyCode;
  precision?: number;
  rounding?: RoundingMode;
  isMinorUnits?: boolean;
}
```

### `GenkinObject`

Plain object representation of a Genkin instance.

```typescript
interface GenkinObject {
  amount: number;
  minorUnits: number;
  currency: Currency;
  precision: number;
  rounding: RoundingMode;
}
```

### `GenkinJSON`

JSON representation of a Genkin instance.

```typescript
interface GenkinJSON {
  amount: number;
  currency: string;
  precision: number;
}
```

## See Also

- [Creating Amounts](../core/creating-amounts)
- [Operations API](./operations)
- [Types Reference](./types)

