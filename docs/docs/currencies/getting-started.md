---
sidebar_position: 1
---

# Getting Started with @genkin/currencies

The `@genkin/currencies` package provides ISO 4217 currency definitions and utilities.

## Installation

```bash
bun add @genkin/currencies @genkin/core
```

## Usage

### Importing Currencies

```typescript
import { USD, EUR, GBP, JPY } from '@genkin/currencies';
import { genkin } from '@genkin/core';

// Use with genkin
const usdAmount = genkin(1000, { currency: USD }); // $10.00
const eurAmount = genkin(850, { currency: EUR });  // €8.50
const gbpAmount = genkin(750, { currency: GBP });  // £7.50
const jpyAmount = genkin(10000, { currency: JPY }); // ¥10,000
```

### Currency Objects

Each currency export provides:

```typescript
import { USD } from '@genkin/currencies';

console.log(USD.code);      // "USD"
console.log(USD.precision); // 2
console.log(USD.symbol);    // "$"
console.log(USD.name);      // "US Dollar"
```

### Available Currencies

The package includes all ISO 4217 currencies:

**Major World Currencies:**
- `USD` - US Dollar
- `EUR` - Euro
- `GBP` - British Pound
- `JPY` - Japanese Yen
- `CHF` - Swiss Franc
- `CAD` - Canadian Dollar
- `AUD` - Australian Dollar
- `CNY` - Chinese Yuan

**European Currencies:**
- `SEK` - Swedish Krona
- `NOK` - Norwegian Krone
- `DKK` - Danish Krone
- `PLN` - Polish Złoty
- `CZK` - Czech Koruna
- `HUF` - Hungarian Forint

**Asian Currencies:**
- `HKD` - Hong Kong Dollar
- `SGD` - Singapore Dollar
- `KRW` - South Korean Won
- `INR` - Indian Rupee
- `THB` - Thai Baht

**Middle Eastern Currencies:**
- `AED` - UAE Dirham
- `SAR` - Saudi Riyal
- `ILS` - Israeli Shekel
- `EGP` - Egyptian Pound

And many more...

### Custom Currencies

```typescript
import { createCurrency } from '@genkin/core';

const customCurrency = createCurrency({
  code: 'BTC',
  precision: 8,
  symbol: '₿',
  name: 'Bitcoin'
});
```

## Integration with Core

Currencies work seamlessly with all core operations:

```typescript
import { add, convert } from '@genkin/core';
import { USD, EUR } from '@genkin/currencies';

const usdAmount = genkin(1000, { currency: USD });
const eurAmount = genkin(850, { currency: EUR });

// Arithmetic between same currencies
const totalUSD = add(usdAmount, genkin(500, { currency: USD }));

// Currency conversion (requires exchange rates)
const converted = await convert(usdAmount, EUR, { EUR: 0.85 });
```

## Benefits

- **Complete Coverage**: All 180+ ISO 4217 currencies
- **Type Safe**: Full TypeScript support with currency codes
- **Auto-registration**: Currencies are automatically registered with the currency registry
- **Consistent API**: Same interface across all currencies
- **Performance**: Optimized for fast lookups and operations