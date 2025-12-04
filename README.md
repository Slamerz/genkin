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
- **Dynamic currency registry** supporting all ISO 4217 currencies and custom currencies

## Currency Registry

Genkin.js includes a powerful currency registry system that makes working with any currency easy. The registry supports:

- **166 ISO 4217 currencies** (auto-registered)
- **Custom currency definitions** for non-standard currencies
- **Registry isolation** for specialized use cases
- **Backward compatibility** with existing code

### Basic Usage

By default, Genkin includes support for major currencies (USD, EUR, GBP, JPY):

```javascript
import { genkin, getCurrencyConfig } from 'genkin';

const price = genkin(19.99, { currency: 'USD' });
console.log(price.format()); // "$19.99"

// Get currency configuration
const usd = getCurrencyConfig('USD');
console.log(usd); // { code: 'USD', numeric: 840, precision: 2, symbol: '$', name: 'US Dollar' }
```

### Full ISO 4217 Currency Support

Import the currencies module to access all 166 ISO 4217 currencies:

```javascript
import { genkin, getCurrencyConfig } from 'genkin';
import 'genkin/currencies'; // Auto-registers all ISO 4217 currencies

// Now you can use any ISO 4217 currency
const malagasyAriary = genkin(50000, { currency: 'MGA' });
console.log(malagasyAriary.format()); // "50,000" (Malagasy Ariary uses base-5 precision)

// Get detailed currency info
const mga = getCurrencyConfig('MGA');
console.log(mga);
// {
//   code: 'MGA',
//   numeric: 969,
//   precision: 1,
//   symbol: '',
//   name: 'Malagasy Ariary',
//   base: 5
// }
```

### Custom Currencies

Register your own currencies for cryptocurrencies, tokens, or specialized currencies:

```javascript
import { genkin, currencyRegistry } from 'genkin';

// Register a custom cryptocurrency
currencyRegistry.register({
  code: 'BTC',
  numeric: 0,
  precision: 8,
  symbol: '₿',
  name: 'Bitcoin'
});

// Use it immediately
const bitcoin = genkin(0.00001234, { currency: 'BTC' });
console.log(bitcoin.format()); // "₿0.00001234"

// Register a custom currency with override
currencyRegistry.register({
  code: 'USD',
  numeric: 840,
  precision: 4, // Higher precision USD
  symbol: '$',
  name: 'High Precision USD'
}, { override: true });
```

### Isolated Registries

Create isolated registries for specialized use cases:

```javascript
import { genkin, createCurrencyRegistry, getCurrencyConfig } from 'genkin';

const cryptoRegistry = createCurrencyRegistry();

// Register crypto currencies in isolated registry
cryptoRegistry.register({
  code: 'ETH',
  numeric: 0,
  precision: 18,
  symbol: 'Ξ',
  name: 'Ethereum'
});

cryptoRegistry.register({
  code: 'USDC',
  numeric: 0,
  precision: 6,
  symbol: '$',
  name: 'USD Coin'
});

// Use isolated registry for crypto operations
const ethAmount = genkin(1.5, { currency: 'ETH' });
const usdcAmount = genkin(1500, { currency: 'USDC' });

// Global registry still unaffected
const usd = getCurrencyConfig('USD'); // Still the default USD
console.log(usd.precision); // 2

// Use isolated registry
const ethConfig = cryptoRegistry.get('ETH');
console.log(ethConfig.precision); // 18
```

### Available ISO 4217 Currencies

When you import `'genkin/currencies'`, all 166 ISO 4217 currencies become available, including:

**Major World Currencies:**
- USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen)
- AUD (Australian Dollar), CAD (Canadian Dollar), CHF (Swiss Franc)
- CNY (Chinese Yuan), NZD (New Zealand Dollar)

**Regional Currencies:**
- All European currencies (SEK, NOK, DKK, PLN, CZK, HUF, TRY, RUB)
- Asian currencies (HKD, SGD, KRW, INR, THB, MYR, PHP, IDR, VND)
- Middle Eastern currencies (AED, SAR, KWD, BHD, OMR, JOD, ILS, EGP)
- African currencies (ZAR, MAD, EGP, KES, NGN, ZMW)
- American currencies (MXN, BRL, ARS, COP, PEN)
- And many more...

### Currency Configuration

Each currency supports the following properties:

```typescript
interface CurrencyConfig {
  code: string;        // ISO 4217 code (e.g., 'USD', 'EUR')
  numeric: number;     // ISO 4217 numeric code (e.g., 840 for USD)
  precision: number;   // Decimal places (e.g., 2 for USD, 0 for JPY)
  symbol?: string;     // Currency symbol (e.g., '$', '€', '£')
  name?: string;       // Full currency name
  base?: number;       // Base/radix (defaults to 10, MGA uses 5)
}
```

### API Reference

#### Registry Functions

```typescript
import {
  currencyRegistry,           // Global registry instance
  createCurrencyRegistry,     // Factory for isolated registries
  getCurrencyConfig           // Get currency config by code
} from 'genkin';
```

#### CurrencyRegistry Methods

```typescript
interface CurrencyRegistry {
  register(config: CurrencyConfig): void;                    // Register currency
  registerAll(configs: CurrencyConfig[]): void;             // Register multiple currencies
  get(code: string): CurrencyConfig | undefined;            // Get currency config
  has(code: string): boolean;                                // Check if currency exists
  unregister(code: string): boolean;                         // Remove currency
  clear(): void;                                             // Clear all currencies
  all(): CurrencyConfig[];                                   // Get all currencies
  codes(): string[];                                         // Get all currency codes
  readonly size: number;                                     // Number of registered currencies
}
```

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
