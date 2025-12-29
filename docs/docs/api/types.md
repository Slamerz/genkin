---
sidebar_position: 3
---

# Types Reference

TypeScript type definitions for Genkin.

## Core Types

### `Genkin`

The main Genkin class for monetary amounts.

```typescript
class Genkin {
  readonly amount: number;
  readonly minorUnits: number;
  readonly currency: Currency;
  readonly currencyCode: string;
  readonly precision: number;
  readonly rounding: RoundingMode;
  // ... methods
}
```

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

### `GenkinInstance<T>`

Generic Genkin instance interface.

```typescript
interface GenkinInstance<T> {
  readonly amount: T;
  readonly minorUnits: T;
  readonly currency: Currency;
  readonly currencyCode: string;
  readonly precision: number;
  readonly rounding: RoundingMode;
  // ... methods
}
```

### `GenkinFactory<T>`

Factory function type for creating Genkin instances.

```typescript
type GenkinFactory<T> = (
  amount: T,
  options?: GenkinOptions<T>
) => GenkinInstance<T>;
```

## Currency Types

### `Currency`

Currency interface with formatting capabilities.

```typescript
interface Currency extends CurrencyConfig {
  format(amount: number, options?: CurrencyFormatOptions): string;
  parse(value: string): number;
}
```

### `CurrencyConfig`

Currency configuration object.

```typescript
interface CurrencyConfig {
  code: CurrencyCode;
  numeric: number;
  precision: number;
  symbol?: string;
  name?: string;
  base?: number;
}
```

### `CurrencyCode`

Currency code string type.

```typescript
type CurrencyCode = string;
```

### `CurrencyFormatOptions`

Options for formatting currency amounts.

```typescript
interface CurrencyFormatOptions {
  showSymbol?: boolean;
  useGrouping?: boolean;
  decimalPlaces?: number;
  showCode?: boolean;
}
```

## Calculator Types

### `Calculator<T>`

Calculator interface for numeric operations.

```typescript
interface Calculator<T> {
  add: (a: T, b: T) => T;
  subtract: (a: T, b: T) => T;
  multiply: (a: T, b: T) => T;
  integerDivide: (a: T, b: T) => T;
  modulo: (a: T, b: T) => T;
  power: (base: T, exponent: T) => T;
  compare: (a: T, b: T) => ComparisonOperator;
  increment: (a: T) => T;
  decrement: (a: T) => T;
  zero: () => T;
}
```

### `ComparisonOperator`

Result of comparison operations.

```typescript
enum ComparisonOperator {
  LessThan = -1,
  Equal = 0,
  GreaterThan = 1
}
```

### `CreateGenkinOptions<T>`

Options for creating a Genkin factory.

```typescript
interface CreateGenkinOptions<T> {
  calculator: Calculator<T>;
  onCreate?: (options: GenkinOptions<T>) => void;
}
```

## Operation Types

### `AllocationRatio`

Ratio for allocation operations.

```typescript
type AllocationRatio = number | ScaledRatio;

interface ScaledRatio {
  amount: number;
  scale: number;
}
```

### `ConversionRate`

Exchange rate for currency conversion.

```typescript
type ConversionRate = number | {
  amount: number;
  scale: number;
};
```

### `GenericAllocationRatio<T>`

Generic allocation ratio.

```typescript
type GenericAllocationRatio<T> = T | GenericScaledRatio<T>;

interface GenericScaledRatio<T> {
  amount: T;
  scale: number;
}
```

## Rounding Types

### `RoundingMode`

Rounding strategies for calculations.

```typescript
enum RoundingMode {
  ROUND_UP = 'ROUND_UP',
  ROUND_DOWN = 'ROUND_DOWN',
  ROUND_HALF_UP = 'ROUND_HALF_UP',
  ROUND_HALF_DOWN = 'ROUND_HALF_DOWN',
  ROUND_HALF_EVEN = 'ROUND_HALF_EVEN',
  ROUND_HALF_ODD = 'ROUND_HALF_ODD',
  ROUND_TOWARDS_ZERO = 'ROUND_TOWARDS_ZERO',
  ROUND_AWAY_FROM_ZERO = 'ROUND_AWAY_FROM_ZERO',
  ROUND_HALF_TOWARDS_ZERO = 'ROUND_HALF_TOWARDS_ZERO',
  ROUND_HALF_AWAY_FROM_ZERO = 'ROUND_HALF_AWAY_FROM_ZERO'
}
```

## Serialization Types

### `GenkinObject`

Plain object representation.

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

JSON representation.

```typescript
interface GenkinJSON {
  amount: number;
  currency: string;
  precision: number;
}
```

## See Also

- [Genkin Class API](./genkin-class)
- [Operations API](./operations)
- [Custom Calculators](../core/custom-calculators)

