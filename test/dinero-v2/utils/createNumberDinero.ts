import type { DineroOptions } from "../../../src/dinero-v2";
import { dinero } from "../../../src/dinero-v2";

export function createNumberDinero(options: DineroOptions) {
  return dinero(options);
}
