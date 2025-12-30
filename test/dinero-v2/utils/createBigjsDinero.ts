import Big from 'big.js';
import { createDinero } from '@genkin/dinero-v2';
import type { DineroOptions, Dinero } from '@genkin/dinero-v2';
import { bigjsCalculator } from './bigjsCalculator.js';

// Create a Big.js-based dinero factory using the test's own Big.js calculator
// This ensures there's only one Big.js instance (from the test's import)
const bigjsDinero = createDinero({ calculator: bigjsCalculator });

export function createBigjsDinero(options: DineroOptions<Big>): Dinero<Big> {
  return bigjsDinero(options);
}
