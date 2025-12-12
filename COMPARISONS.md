# Currency Library Feature Comparison

This table compares Genkin.js with other popular JavaScript currency and decimal arithmetic libraries.

| Feature | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|---------|-----------|------------|--------|-----------|-------------|---------------|
| **Core Purpose** | Currency math with ISO 4217 support | Arbitrary-precision decimals | Arbitrary-precision decimals | Monetary calculations | Currency formatting & math | Currency formatting |
| **Bundle Size** | ~2-12KB (tree-shakeable) | ~25KB | ~6KB | ~15KB | ~1KB | ~3KB |
| **Dependencies** | 0 | 0 | 0 | 0 | 0 | 0 |
| **TypeScript Support** | ✅ Full | ✅ Declaration files | ❌ | ✅ | ✅ | ❌ |
| **ESM Support** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Precision & Arithmetic

| Feature | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|---------|-----------|------------|--------|-----------|-------------|---------------|
| **Integer-based calculations** | ✅ (avoids floating-point errors) | ❌ (floating-point) | ❌ (floating-point) | ✅ (minor units) | ✅ (internal integers) | ❌ (formatting only) |
| **Arbitrary precision** | ✅ (configurable per currency) | ✅ (configurable) | ✅ (configurable) | ✅ (fixed per currency) | ❌ (fixed 2 decimals) | ❌ (formatting only) |
| **Basic arithmetic** (add/subtract/multiply/divide) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Advanced math** (powers, roots, logs) | ❌ | ✅ | ✅ (sqrt only) | ❌ | ❌ | ❌ |
| **Immutability** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

## Currency Support

| Feature | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|---------|-----------|------------|--------|-----------|-------------|---------------|
| **Built-in currencies** | ✅ (166 ISO 4217) | ❌ | ❌ | ✅ (major currencies) | ❌ | ❌ |
| **Custom currency definitions** | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Currency registry system** | ✅ (dynamic + isolated) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Currency conversion** | ✅ (with exchange rates) | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Multi-currency operations** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

## Formatting & Internationalization

| Feature | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|---------|-----------|------------|--------|-----------|-------------|---------------|
| **Locale-aware formatting** | ✅ (Intl.NumberFormat) | ❌ | ❌ | ✅ (Intl API) | ✅ (customizable) | ✅ (localizable) |
| **Custom formatters** | ✅ | ✅ (toString variants) | ✅ (toString variants) | ✅ | ✅ | ✅ |
| **Template-based formatting** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Column formatting** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Parse formatted strings** | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |

## API Design

| Feature | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|---------|-----------|------------|--------|-----------|-------------|---------------|
| **Object-oriented API** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ (functional) |
| **Functional API** | ✅ (operations) | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Method chaining** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Global configuration** | ✅ (registry-based) | ✅ (multiple constructors) | ❌ | ✅ | ❌ | ✅ |
| **Tree-shaking friendly** | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |

## Compatibility & Migration

| Feature | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|---------|-----------|------------|--------|-----------|-------------|---------------|
| **Dinero.js v1 compatibility** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Dinero.js v2 compatibility** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Base conversion** (2-64) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Cross-platform** (browser + Node.js) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Legacy browser support** | ✅ | ✅ | ✅ | ❌ (modern) | ✅ | ✅ |

## Use Cases

| Best For | Genkin.js | Decimal.js | Big.js | Dinero.js | Currency.js | Accounting.js |
|----------|-----------|------------|--------|-----------|-------------|---------------|
| **Financial applications** | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **E-commerce** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Accounting software** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Cryptocurrency** | ✅ (custom currencies) | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Scientific calculations** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **General decimal math** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## Summary

- **Genkin.js**: Modern, comprehensive currency library with full ISO 4217 support, TypeScript, and Dinero.js compatibility. Best for financial applications needing precise currency math and extensive currency support.

- **Decimal.js**: Powerful arbitrary-precision decimal library. Best for scientific calculations requiring high precision and advanced mathematical functions.

- **Big.js**: Lightweight arbitrary-precision library. Good for general decimal math where precision matters but advanced features aren't needed.

- **Dinero.js**: Established currency library with immutable API. Good for monetary calculations but less comprehensive than Genkin for currency variety.

- **Currency.js**: Tiny, focused currency library. Best for simple currency formatting and basic arithmetic where bundle size is critical.

- **Accounting.js**: Specialized formatting library. Best for display formatting and parsing, not for calculations.

## Performance Notes

- **Bundle size**: Currency.js (1KB) < Accounting.js (3KB) < Big.js (6KB) < Genkin.js (2-12KB) < Dinero.js (15KB) < Decimal.js (25KB)
- **Runtime performance**: All libraries are fast for typical use cases; Decimal.js may be slower for very high precision operations
- **Tree-shaking**: Genkin.js, Currency.js, and Accounting.js work well with modern bundlers for minimal bundle sizes</contents>
