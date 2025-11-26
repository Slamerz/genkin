// Demo script showing Dinero.js compatibility layers in action
// Run with: node examples/compatibility-demo.js

import { Dinero } from '../dist/dinero-v1.js';
import { dinero, add, toDecimal, allocate } from '../dist/dinero-v2.js';

console.log('🚀 Genkin Dinero.js Compatibility Demo\n');

// === Dinero v1 Compatibility Demo ===
console.log('📦 Dinero v1 Compatibility Layer:');

const v1Price = Dinero({ amount: 2000, currency: 'USD' });
const v1Tax = Dinero({ amount: 200, currency: 'USD' });
const v1Total = v1Price.add(v1Tax);

console.log(`Price: ${v1Price.toString()}`);
console.log(`Tax: ${v1Tax.toString()}`);
console.log(`Total: ${v1Total.toString()}`);
console.log(`Total (number): $${v1Total.toNumber()}`);

// Allocation demo
const v1Parts = v1Total.allocate([60, 40]);
console.log(`Split 60/40: ${v1Parts[0].toString()} and ${v1Parts[1].toString()}`);

console.log('');

// === Dinero v2 Compatibility Demo ===
console.log('📦 Dinero v2 Compatibility Layer:');

const USD = { code: 'USD', scale: 2 };
const v2Price = dinero({ amount: 2000, currency: USD });
const v2Tax = dinero({ amount: 200, currency: USD });
const v2Total = add(v2Price, v2Tax);

console.log(`Price: $${toDecimal(v2Price)}`);
console.log(`Tax: $${toDecimal(v2Tax)}`);
console.log(`Total: $${toDecimal(v2Total)}`);
console.log(`Total JSON:`, v2Total.toJSON());

// Allocation demo
const v2Parts = allocate(v2Total, [60, 40]);
console.log(`Split 60/40: $${toDecimal(v2Parts[0])} and $${toDecimal(v2Parts[1])}`);

console.log('');

// === Comparison Demo ===
console.log('🔍 Compatibility Layer Comparison:');
console.log(`v1 total amount: ${v1Total.getAmount()} minor units`);
console.log(`v2 total amount: ${v2Total.toJSON().amount} minor units`);
console.log(`Both represent: $${v1Total.toNumber()}`);
console.log(`Results match: ${v1Total.getAmount() === v2Total.toJSON().amount}`);

console.log('\n✅ Compatibility layers working correctly!');
console.log('\n📚 Ready for migration from Dinero.js to Genkin!');
console.log('See examples/dinero-migration.md for detailed migration guide.');
