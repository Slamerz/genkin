# Genkin.js Architecture

## Design Philosophy

Genkin.js follows a **modular single-package architecture** that prioritizes:
- **Tree-shaking friendliness** - Users only bundle what they import
- **Developer experience** - Simple installation, clear APIs
- **Maintainability** - Single codebase, unified versioning
- **Performance** - Minimal bundle size, efficient operations

## Package Structure

```
genkin/
├── src/
│   ├── core/              # Core functionality (always needed)
│   │   ├── genkin.ts      # Main Genkin class
│   │   ├── currency.ts    # Currency type definitions
│   │   ├── precision.ts   # Precision handling utilities
│   │   └── index.ts       # Core module exports
│   ├── operations/        # Mathematical operations
│   │   ├── arithmetic.ts  # Basic math: add, subtract, multiply, divide
│   │   ├── comparison.ts  # Comparison: equals, lessThan, greaterThan
│   │   ├── conversion.ts  # Currency conversion utilities
│   │   └── index.ts       # Operations module exports
│   ├── formatters/        # Output formatting
│   │   ├── intl.ts        # Intl.NumberFormat integration
│   │   ├── custom.ts      # Custom formatter functions
│   │   ├── templates.ts   # Template-based formatting
│   │   └── index.ts       # Formatters module exports
│   ├── currencies/        # Currency definitions
│   │   ├── iso4217.ts     # ISO 4217 standard currencies
│   │   ├── crypto.ts      # Cryptocurrency definitions
│   │   └── index.ts       # Currencies module exports
│   ├── utils/             # Utility functions
│   │   ├── validation.ts  # Input validation
│   │   ├── rounding.ts    # Rounding strategies
│   │   └── index.ts       # Utils module exports
│   └── index.ts           # Main package entry point
└── dist/                  # Built output (generated)
    ├── index.js           # Main ESM bundle
    ├── index.cjs          # Main CommonJS bundle
    ├── core.js            # Core module bundle
    ├── operations.js      # Operations module bundle
    └── ...                # Other module bundles
```

## Import Strategies

### 1. Minimal Core Import
```typescript
import { genkin } from 'genkin';
// ~2KB - Just the core Genkin class
```

### 2. Specific Module Import
```typescript
import { add, subtract } from 'genkin/operations';
import { formatCurrency } from 'genkin/formatters';
// ~3-4KB - Only what you need
```

### 3. Full Import (Convenience)
```typescript
import * as Genkin from 'genkin';
// ~8-12KB - Everything included
```

## Module Responsibilities

### Core Module (`genkin/core`)
- **Genkin class** - Main money object
- **Currency types** - Type definitions and interfaces
- **Precision handling** - Integer-based calculations
- **Base functionality** - Required by all other modules

### Operations Module (`genkin/operations`)
- **Arithmetic operations** - Math functions that return new Genkin instances
- **Comparison operations** - Boolean comparison functions
- **Currency conversion** - Exchange rate calculations
- **Batch operations** - Working with arrays of Genkin instances

### Formatters Module (`genkin/formatters`)
- **Intl.NumberFormat** - Locale-aware formatting
- **Custom formatters** - User-defined formatting functions
- **Templates** - String template-based formatting
- **Output formats** - JSON, string, number outputs

### Currencies Module (`genkin/currencies`)
- **ISO 4217 currencies** - Standard fiat currencies
- **Cryptocurrency** - Bitcoin, Ethereum, etc.
- **Custom currencies** - User-defined currency types
- **Currency metadata** - Symbols, decimal places, etc.

### Utils Module (`genkin/utils`)
- **Validation** - Input sanitization and validation
- **Rounding strategies** - Different rounding modes
- **Type guards** - Runtime type checking
- **Helpers** - Utility functions used across modules

## Bundle Size Targets

| Import Strategy | Target Size | Includes |
|----------------|-------------|----------|
| Core only | ~2KB | Genkin class, basic operations |
| Core + Operations | ~4KB | All math operations |
| Core + Formatters | ~3KB | All formatting options |
| Everything | ~8-12KB | Full feature set |

## Development Phases

### Phase 1: Core Foundation
- [x] Project setup and build configuration
- [ ] Core Genkin class implementation
- [ ] Basic arithmetic operations
- [ ] Essential type definitions

### Phase 2: Operations & Validation
- [ ] Complete arithmetic operations
- [ ] Comparison operations
- [ ] Input validation
- [ ] Error handling

### Phase 3: Formatting & Currencies
- [ ] Intl.NumberFormat integration
- [ ] Custom formatters
- [ ] ISO 4217 currency definitions
- [ ] Currency conversion basics

### Phase 4: Advanced Features
- [ ] Cryptocurrency support
- [ ] Advanced rounding strategies
- [ ] Batch operations
- [ ] Performance optimizations

### Phase 5: Polish & Documentation
- [ ] Comprehensive testing
- [ ] Performance benchmarks
- [ ] API documentation
- [ ] Migration guide from Dinero.js

## Design Decisions

### Why Single Package?
1. **Simpler maintenance** - One repository, one version
2. **Better DX** - Single `npm install`, clear import paths
3. **Modern tooling** - Bundlers handle tree-shaking well
4. **Avoid dependency hell** - No version mismatches

### Why Tree-Shaking Over Micro-Packages?
1. **Modern standard** - All major bundlers support it
2. **Easier development** - Cross-module refactoring
3. **Better integration testing** - All modules in one codebase
4. **Simplified publishing** - One package to maintain

### Build Tool Choice: tsup
1. **Zero config** - Works out of the box
2. **Multiple formats** - ESM, CJS, with types
3. **Code splitting** - Supports multiple entry points
4. **Fast builds** - esbuild-based compilation

## Testing Strategy

- **Unit tests** - Each module tested independently
- **Integration tests** - Cross-module functionality
- **Bundle size tests** - Verify tree-shaking works
- **Performance tests** - Ensure operations are fast
- **Type tests** - TypeScript type checking

This architecture provides the flexibility of micro-packages with the simplicity of a single package, giving users the best of both worlds. 