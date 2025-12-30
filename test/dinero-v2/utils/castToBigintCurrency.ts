import { Currency } from "@genkin/dinero-v2";

// Extended type to handle both @genkin/currencies (precision) and dinero-v2 (exponent) formats
type CurrencyWithPrecisionOrExponent = { 
  code: string; 
  base?: number | readonly number[]; 
  exponent?: number; 
  precision?: number;
};

export function castToBigintCurrency(
  currency: CurrencyWithPrecisionOrExponent
): Currency<bigint> {
  // Handle both dinero-v2 style (exponent) and @genkin/currencies style (precision)
  const exponentValue = currency.exponent ?? currency.precision;
  if (exponentValue === undefined) {
    throw new Error(`Currency ${currency.code} has neither exponent nor precision defined`);
  }
  
  // Only include dinero-v2 Currency properties (code, base, exponent)
  return {
    code: currency.code,
    base: Array.isArray(currency.base)
      ? currency.base.map(BigInt)
      : BigInt((currency.base as number) ?? 10),
    exponent: BigInt(exponentValue),
  };
}
