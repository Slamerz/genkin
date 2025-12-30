import { createDinero, bigintCalculator } from '@genkin/dinero-v2';
import type { DineroOptions, Dinero } from '@genkin/dinero-v2';

// Create a bigint-based dinero factory using the generic createDinero
const bigintDinero = createDinero({ calculator: bigintCalculator });

export function createBigintDinero(options: DineroOptions<bigint>): Dinero<bigint> {
  return bigintDinero(options);
}
