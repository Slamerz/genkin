---
sidebar_position: 4
---

# Working with Currencies

Learn how to use currencies in Genkin for type-safe monetary operations.

## Using Built-in Currencies

Genkin provides 180+ ISO 4217 currencies out of the box:

```typescript
import { genkin } from '@genkin/core';
import { USD, EUR, GBP, JPY, CAD, AUD } from '@genkin/currencies';

const usd = genkin(100, { currency: USD });
const eur = genkin(85, { currency: EUR });
const gbp = genkin(75, { currency: GBP });
const jpy = genkin(15000, { currency: JPY });
```

## Currency Objects

Currency objects provide formatting and parsing capabilities:

```typescript
import { USD } from '@genkin/currencies';

// Format amounts
console.log(USD.format(1234.56)); // "$1,234.56"

// Parse strings
console.log(USD.parse('$1,234.56')); // 1234.56

// Access currency properties
console.log(USD.code); // "USD"
console.log(USD.symbol); // "$"
console.log(USD.name); // "US Dollar"
console.log(USD.precision); // 2
```

## Currency Codes

Use currency codes as strings for simple cases:

```typescript
import { genkin } from '@genkin/core';

// Using currency code strings
const amount = genkin(100, { currency: 'USD' });
console.log(amount.currencyCode); // "USD"
```

## Currency Configuration

Get currency configuration from the registry:

```typescript
import { getCurrencyConfig } from '@genkin/core';

const usdConfig = getCurrencyConfig('USD');
console.log(usdConfig);
// {
//   code: 'USD',
//   numeric: 840,
//   precision: 2,
//   symbol: '$',
//   name: 'US Dollar',
//   base: 10
// }
```

## Creating Custom Currencies

Define custom currencies for special use cases:

```typescript
import { genkin, createCurrency } from '@genkin/core';

// Create a cryptocurrency
const btc = createCurrency({
  code: 'BTC',
  numeric: 0,
  precision: 8,
  symbol: '₿',
  name: 'Bitcoin',
  base: 10
});

const amount = genkin(0.5, { currency: btc });
console.log(amount.toString()); // "₿0.50000000"
```

### Custom Currency with Formatting

```typescript
const customCurrency = createCurrency({
  code: 'XAU',
  numeric: 959,
  precision: 4,
  symbol: 'oz',
  name: 'Gold Troy Ounce',
  base: 10
});

const gold = genkin(1.2345, { currency: customCurrency });
console.log(customCurrency.format(1.2345)); // "oz1.2345"
```

## Currency Registry

Register custom currencies globally:

```typescript
import { currencyRegistry } from '@genkin/core';

// Register a custom currency
currencyRegistry.register({
  code: 'XYZ',
  numeric: 0,
  precision: 2,
  symbol: 'X',
  name: 'Custom Currency',
  base: 10
});

// Check if currency is registered
console.log(currencyRegistry.has('XYZ')); // true

// Get all registered currencies
const allCurrencies = currencyRegistry.all();
console.log(allCurrencies.length); // 180+ (built-in + custom)
```

## Formatting Options

Customize how amounts are formatted:

```typescript
import { USD } from '@genkin/currencies';

const amount = 1234.56;

// With symbol (default)
console.log(USD.format(amount)); // "$1,234.56"

// Without grouping
console.log(USD.format(amount, { useGrouping: false })); // "$1234.56"

// With currency code
console.log(USD.format(amount, { showCode: true })); // "$1,234.56 USD"

// Custom decimal places
console.log(USD.format(amount, { decimalPlaces: 0 })); // "$1,235"
```

## Zero-Precision Currencies

Some currencies like Japanese Yen don't have sub-units:

```typescript
import { genkin } from '@genkin/core';
import { JPY } from '@genkin/currencies';

const yen = genkin(1000, { currency: JPY });
console.log(yen.precision); // 0
console.log(yen.toString()); // "1000 JPY"
```

## Currency Comparison

Check if amounts have the same currency:

```typescript
import { genkin } from '@genkin/core';
import { USD, EUR } from '@genkin/currencies';

const usd = genkin(100, { currency: USD });
const eur = genkin(85, { currency: EUR });

console.log(usd.hasSameCurrency(eur)); // false
console.log(usd.currencyCode === eur.currencyCode); // false
```

## Changing Currency

Convert an amount to a different currency (without exchange rate):

```typescript
import { genkin } from '@genkin/core';
import { USD, EUR } from '@genkin/currencies';

const usd = genkin(100, { currency: USD });
const asEur = usd.withCurrency(EUR);

console.log(asEur.amount); // 100 (same numerical value)
console.log(asEur.currencyCode); // "EUR"
```

Note: This doesn't apply exchange rates - use the `convert` function for actual currency conversion.

## Best Practices

1. **Import from @genkin/currencies**: Use the pre-configured currency objects
2. **Type Safety**: Use currency objects instead of strings when possible
3. **Custom Currencies**: Register custom currencies in the global registry
4. **Precision**: Always specify precision for non-standard currencies
5. **Formatting**: Use currency formatting methods for display
6. **Validation**: Check currency compatibility before operations

## Available Currencies

See the complete list of [ISO 4217 currencies](../currencies/iso4217) supported by Genkin.

## Next Steps

- Learn about [precision and rounding](./precision-and-rounding)
- Explore the [@genkin/currencies package](../currencies/getting-started)
- See [currency conversion examples](./operations#currency-conversion)

