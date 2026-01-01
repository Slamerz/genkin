---
slug: announcing-genkin-js
title: Announcing Genkin.js - High-Precision Currency Calculations for TypeScript
authors: [slamerz]
tags: [announcement, core, currencies, dinero, dinero-v2]
---

We're thrilled to announce the official launch of **Genkin.js** - a modern, TypeScript-first library for precise monetary calculations that fills the gap left by the abandonment of Dinero.js v2!

<!-- truncate -->

## The Story Behind Genkin.js

It all started with a familiar scenario: I was building a project that required working with currencies, so I naturally reached for [Dinero.js](https://dinerojs.com/) - a library I'd used successfully in the past and really appreciated for its approach to handling money calculations.

I'd worked with Dinero.js v1 before, but when I noticed they had a v2.0.0 alpha available, I thought this would be the perfect opportunity to upgrade and explore the new features. I was particularly excited about the improved TypeScript support and potential enhancements that might be included.

However, as I started diving deeper and needed to reference the documentation for some functions, I discovered the documentation site was down. I initially chalked it up to temporary deployment issues, but as time passed and GitHub issues (including the documentation outage) went unanswered, it became clear that the project was no longer being actively maintained.

This was disappointing news. Dinero.js was a fantastic library that solved real problems in JavaScript's notoriously tricky currency calculations. While v1's documentation remained accessible and the package still functioned, I was eager to see what improvements and modernizations v2 would bring.

## From Disappointment to Opportunity

Rather than let this setback derail my project, I started building my own utility functions to handle the currency operations I needed. As these functions grew and proved reliable, I began using them across more of my projects.

Meanwhile, I noticed something interesting happening in the Dinero.js community - developers were starting to look for forks or alternatives as maintenance concerns became more apparent. This got me thinking: what if I could create something that not only solved my immediate needs but also provided a smooth migration path for others?

That's when the idea for Genkin.js was born. I decided to publish my functions as a proper package, but with a twist - I'd make it compatible with Dinero.js so developers could migrate incrementally without having to rewrite everything at once.

## What Makes Genkin.js Special?

Genkin.js isn't just another currency library - it's designed to be the modern successor to Dinero.js with several key improvements:

### **Full TypeScript Support**
Built from the ground up with TypeScript, providing excellent developer experience with type safety, autocompletion, and comprehensive IntelliSense support.

### **Drop-in Dinero.js Compatibility**
We provide compatibility layers for both Dinero.js v1 and v2, making migration as simple as changing your import statement:

```javascript
// Migrate from Dinero.js v1
// import Dinero from 'dinero.js';
import Dinero from '@genkin/dinero';

const price = Dinero({ amount: 2000, currency: 'USD' });
const tax = Dinero({ amount: 200, currency: 'USD' });
const total = price.add(tax);
console.log(total.toNumber()); // 22.00
```

```javascript
// Migrate from Dinero.js v2
// import { dinero, add } from 'dinero.js';
import { dinero, add, toDecimal } from '@genkin/dinero-v2';

const USD = { code: 'USD', scale: 2 };
const price = dinero({ amount: 2000, currency: USD });
const tax = dinero({ amount: 200, currency: USD });
const total = add(price, tax);
console.log(toDecimal(total)); // "22"
```

### **Comprehensive Currency Support**
Out of the box, Genkin.js supports all 166 ISO 4217 currencies, from major world currencies like USD, EUR, GBP, and JPY to regional currencies across every continent. Need a custom currency for cryptocurrencies or tokens? No problem - our dynamic registry system makes it easy.

### ⚡ **Modern and Lightweight**
- Zero dependencies
- Tree-shakeable for optimal bundle sizes
- ESM-first with CommonJS support
- Immutable operations to prevent accidental mutations

### 🔧 **Precision You Can Trust**
Using integer-based calculations to eliminate floating-point precision errors that plague regular JavaScript number operations.

## Getting Started

Installation is simple - start with the core package:

```bash
npm install @genkin/core
# or
yarn add @genkin/core
# or
bun add @genkin/core
```

For full ISO 4217 currency support:

```bash
npm install @genkin/currencies
# or
yarn add @genkin/currencies
# or
bun add @genkin/currencies
```

For Dinero.js compatibility:

```bash
# For Dinero.js v1 compatibility
npm install @genkin/dinero
# or
yarn add @genkin/dinero
# or
bun add @genkin/dinero

# For Dinero.js v2 compatibility  
npm install @genkin/dinero-v2
# or
yarn add @genkin/dinero-v2
# or
bun add @genkin/dinero-v2
```

Basic usage:

```javascript
import { genkin, getCurrencyConfig } from 'genkin';

const price = genkin(19.99, { currency: 'USD' });
console.log(price.format()); // "$19.99"

// Access currency information
const usd = getCurrencyConfig('USD');
console.log(usd); // { code: 'USD', numeric: 840, precision: 2, symbol: '$', name: 'US Dollar' }
```

For full ISO 4217 currency support:

```javascript
import { genkin, getCurrencyConfig } from 'genkin';
import '@genkin/currencies'; // Auto-registers all 166 ISO 4217 currencies

// Now you can use any currency
const malagasyAriary = genkin(50000, { currency: 'MGA' });
console.log(malagasyAriary.format()); // "50,000"
```

## Available Packages

Genkin.js is organized into several focused packages that you can install based on your needs:

- **[@genkin/core](https://www.npmjs.com/package/@genkin/core)** - Core library with basic currency support (USD, EUR, GBP, JPY)
- **[@genkin/currencies](https://www.npmjs.com/package/@genkin/currencies)** - All 166 ISO 4217 currencies
- **[@genkin/dinero](https://www.npmjs.com/package/@genkin/dinero)** - Dinero.js v1 compatibility layer
- **[@genkin/dinero-v2](https://www.npmjs.com/package/@genkin/dinero-v2)** - Dinero.js v2 compatibility layer

## What's Next?

This launch represents just the beginning for Genkin.js. We have exciting plans for the future, including:

- Advanced currency conversion with real-time exchange rates
- Enhanced internationalization features
- Performance optimizations
- Community-driven feature requests

## Join the Community

We're excited to see how you use Genkin.js in your projects! Whether you're migrating from Dinero.js, starting a new project, or working with complex financial calculations, we'd love to hear from you.

- [Documentation](https://slamerz.github.io/genkin/)
- [GitHub Repository](https://github.com/Slamerz/genkin)
- [Issue Tracker](https://github.com/Slamerz/genkin/issues)

## Special Thanks

A huge thank you to the original Dinero.js team for creating such a fantastic library that inspired this project. We're standing on the shoulders of giants and hope Genkin.js continues the tradition of making currency calculations in JavaScript reliable and enjoyable.

---

*Ready to make your currency calculations precise and painless? [Get started with Genkin.js today!](https://slamerz.github.io/genkin/)*
