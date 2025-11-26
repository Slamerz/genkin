import { Genkin } from '../core/genkin.js';
import { safeAdd, safeSubtract, safeMultiply, safeDivide } from '../core/precision.js';

/**
 * Represents a scaled ratio for allocation
 */
export interface ScaledRatio {
  amount: number;
  scale: number;
}

/**
 * Union type for allocation ratios - can be simple numbers or scaled ratios
 */
export type AllocationRatio = number | ScaledRatio;

/**
 * Add two Genkin instances
 * Both instances must have the same currency
 */
export function add(a: Genkin, b: Genkin): Genkin {
  if (!a.hasSameCurrency(b)) {
    throw new Error(`Cannot add different currencies: ${a.currencyCode} and ${b.currencyCode}`);
  }

  // Use the higher precision for the result
  const maxPrecision = Math.max(a.precision, b.precision);
  
  // Convert both to the same precision for calculation
  const aUnits = a.minorUnits * Math.pow(10, maxPrecision - a.precision);
  const bUnits = b.minorUnits * Math.pow(10, maxPrecision - b.precision);
  
  const resultUnits = safeAdd(aUnits, bUnits);
  const resultAmount = resultUnits / Math.pow(10, maxPrecision);

  return new Genkin(resultAmount, {
    currency: a.currency,
    precision: maxPrecision,
    rounding: a.rounding,
  });
}

/**
 * Subtract one Genkin instance from another
 * Both instances must have the same currency
 */
export function subtract(a: Genkin, b: Genkin): Genkin {
  if (!a.hasSameCurrency(b)) {
    throw new Error(`Cannot subtract different currencies: ${a.currencyCode} and ${b.currencyCode}`);
  }

  // Use the higher precision for the result
  const maxPrecision = Math.max(a.precision, b.precision);
  
  // Convert both to the same precision for calculation
  const aUnits = a.minorUnits * Math.pow(10, maxPrecision - a.precision);
  const bUnits = b.minorUnits * Math.pow(10, maxPrecision - b.precision);
  
  const resultUnits = safeSubtract(aUnits, bUnits);
  const resultAmount = resultUnits / Math.pow(10, maxPrecision);

  return new Genkin(resultAmount, {
    currency: a.currency,
    precision: maxPrecision,
    rounding: a.rounding,
  });
}

/**
 * Multiply a Genkin instance by a number
 */
export function multiply(genkin: Genkin, multiplier: number): Genkin {
  if (!Number.isFinite(multiplier)) {
    throw new Error('Multiplier must be a finite number');
  }

  // Multiply the minor units directly
  const resultUnits = Math.round(genkin.minorUnits * multiplier);
  
  return new Genkin(resultUnits / Math.pow(10, genkin.precision), {
    currency: genkin.currency,
    precision: genkin.precision,
    rounding: genkin.rounding,
  });
}

/**
 * Divide a Genkin instance by a number
 */
export function divide(genkin: Genkin, divisor: number): Genkin {
  if (!Number.isFinite(divisor)) {
    throw new Error('Divisor must be a finite number');
  }

  if (divisor === 0) {
    throw new Error('Cannot divide by zero');
  }

  // Divide the minor units directly
  const resultUnits = Math.round(genkin.minorUnits / divisor);

  return new Genkin(resultUnits / Math.pow(10, genkin.precision), {
    currency: genkin.currency,
    precision: genkin.precision,
    rounding: genkin.rounding,
  });
}

/**
 * Calculate the absolute value of a Genkin instance
 */
export function abs(genkin: Genkin): Genkin {
  if (genkin.minorUnits >= 0) {
    return genkin;
  }

  return new Genkin(Math.abs(genkin.amount), {
    currency: genkin.currency,
    precision: genkin.precision,
    rounding: genkin.rounding,
  });
}

/**
 * Negate a Genkin instance (multiply by -1)
 */
export function negate(genkin: Genkin): Genkin {
  return multiply(genkin, -1);
}

/**
 * Allocate a Genkin amount across a list of ratios
 * 
 * Distributes the amount across ratios, handling remainders by distributing them
 * as evenly as possible. Supports both simple ratios [25, 75] and scaled ratios
 * [{ amount: 505, scale: 1 }, { amount: 495, scale: 1 }].
 * 
 * @param genkin - The Genkin instance to allocate
 * @param ratios - Array of ratios to distribute across
 * @returns Array of Genkin instances representing the allocated amounts
 */
export function allocate(genkin: Genkin, ratios: AllocationRatio[]): Genkin[] {
  if (ratios.length === 0) {
    throw new Error('Ratios array cannot be empty');
  }

  // Convert all ratios to a common scale for calculation
  const normalizedRatios = normalizeRatios(ratios);
  const totalRatio = normalizedRatios.reduce((sum, ratio) => sum + ratio, 0);

  if (totalRatio === 0) {
    throw new Error('Total ratio cannot be zero');
  }

  // Work with minor units to avoid floating-point issues
  const totalMinorUnits = genkin.minorUnits;
  
  // Calculate base allocations
  const allocations: number[] = [];
  const remainders: number[] = [];
  let allocatedSum = 0;

  for (let i = 0; i < normalizedRatios.length; i++) {
    const ratio = normalizedRatios[i];
    
    if (ratio === 0) {
      // Zero ratios get zero allocation
      allocations.push(0);
      remainders.push(0);
    } else {
      // Calculate exact allocation (may have fractional part)
      const exactAllocation = (totalMinorUnits * ratio) / totalRatio;
      const baseAllocation = Math.floor(exactAllocation);
      const remainder = exactAllocation - baseAllocation;
      
      allocations.push(baseAllocation);
      remainders.push(remainder);
      allocatedSum += baseAllocation;
    }
  }

  // Distribute the remaining units
  const unallocatedUnits = totalMinorUnits - allocatedSum;
  
  if (unallocatedUnits > 0) {
    // Create array of indices with their remainders, excluding zero ratios
    const indexedRemainders = remainders
      .map((remainder, index) => ({ index, remainder }))
      .filter(item => normalizedRatios[item.index] !== 0)
      .sort((a, b) => b.remainder - a.remainder); // Sort by remainder descending

    // Distribute remaining units to indices with largest remainders
    for (let i = 0; i < unallocatedUnits && i < indexedRemainders.length; i++) {
      const targetIndex = indexedRemainders[i].index;
      allocations[targetIndex] += 1;
    }
  }

  // Convert back to Genkin instances
  return allocations.map(units => {
    const amount = units / Math.pow(10, genkin.precision);
    return new Genkin(amount, {
      currency: genkin.currency,
      precision: genkin.precision,
      rounding: genkin.rounding,
    });
  });
}

/**
 * Normalize ratios to a common scale for calculation
 * Converts both simple numbers and scaled ratios to simple numbers
 */
function normalizeRatios(ratios: AllocationRatio[]): number[] {
  // Check if any ratios are scaled
  const hasScaledRatios = ratios.some(ratio => typeof ratio === 'object');
  
  if (!hasScaledRatios) {
    // All ratios are simple numbers
    return ratios as number[];
  }

  // Find the maximum scale to convert all ratios to the same precision
  let maxScale = 0;
  for (const ratio of ratios) {
    if (typeof ratio === 'object') {
      maxScale = Math.max(maxScale, ratio.scale);
    }
  }

  // Convert all ratios to the same scale
  return ratios.map(ratio => {
    if (typeof ratio === 'number') {
      // Simple ratio - scale it up to match maxScale
      return ratio * Math.pow(10, maxScale);
    } else {
      // Scaled ratio - convert to target scale
      const scaleDifference = maxScale - ratio.scale;
      return ratio.amount * Math.pow(10, scaleDifference);
    }
  });
} 

/**
 * Calculate the percentage of a Genkin instance
 */
export function percentage(genkin: Genkin, percentage: number): Genkin {
  return multiply(genkin, percentage / 100);
}