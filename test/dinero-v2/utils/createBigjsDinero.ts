import Big from 'big.js';
import { createDinero, bigjsCalculator } from '../../../src/dinero-v2/index.js';
import type { DineroOptions, Dinero } from '../../../src/dinero-v2/index.js';

// Create a Big.js-based dinero factory using the generic createDinero
const bigjsDinero = createDinero({ calculator: bigjsCalculator });

export function createBigjsDinero(options: DineroOptions<Big>): Dinero<Big> {
  return bigjsDinero(options);
}
