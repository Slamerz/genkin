import { createDinero, bigintCalculator } from '../../../src/dinero-v2/index.js';
import type { DineroOptions, Dinero } from '../../../src/dinero-v2/index.js';

// Create a bigint-based dinero factory using the generic createDinero
const bigintDinero = createDinero({ calculator: bigintCalculator });

export function createBigintDinero(options: DineroOptions<bigint>): Dinero<bigint> {
  return bigintDinero(options);
}