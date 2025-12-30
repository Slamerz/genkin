import type { DineroOptions } from "@genkin/dinero-v2";
import { dinero } from "@genkin/dinero-v2";

export function createNumberDinero(options: DineroOptions<number>) {
  return dinero(options);
}
