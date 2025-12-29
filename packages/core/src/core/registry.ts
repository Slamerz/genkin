import type { CurrencyCode, CurrencyConfig } from './currency.js';

/**
 * A registry for managing currency configurations.
 * Supports registering, retrieving, and managing currencies dynamically.
 */
export class CurrencyRegistry {
  private currencies: Map<string, CurrencyConfig> = new Map();

  /**
   * Register a single currency configuration.
   * By default, registering a currency with an existing code will override it.
   * @param config The currency configuration to register
   */
  register(config: CurrencyConfig): void {
    this.currencies.set(config.code, config);
  }

  /**
   * Register multiple currency configurations at once.
   * @param configs Array of currency configurations to register
   */
  registerAll(configs: CurrencyConfig[]): void {
    for (const config of configs) {
      this.register(config);
    }
  }

  /**
   * Get a currency configuration by its code.
   * @param code The currency code (e.g., 'USD', 'EUR')
   * @returns The currency configuration or undefined if not found
   */
  get(code: CurrencyCode): CurrencyConfig | undefined {
    return this.currencies.get(code);
  }

  /**
   * Check if a currency is registered.
   * @param code The currency code to check
   * @returns True if the currency is registered
   */
  has(code: CurrencyCode): boolean {
    return this.currencies.has(code);
  }

  /**
   * Remove a currency from the registry.
   * @param code The currency code to remove
   * @returns True if the currency was removed, false if it wasn't registered
   */
  unregister(code: CurrencyCode): boolean {
    return this.currencies.delete(code);
  }

  /**
   * Clear all registered currencies from the registry.
   */
  clear(): void {
    this.currencies.clear();
  }

  /**
   * Get all registered currency configurations.
   * @returns Array of all registered currency configurations
   */
  all(): CurrencyConfig[] {
    return Array.from(this.currencies.values());
  }

  /**
   * Get the number of registered currencies.
   * @returns The count of registered currencies
   */
  get size(): number {
    return this.currencies.size;
  }

  /**
   * Get all registered currency codes.
   * @returns Array of all registered currency codes
   */
  codes(): CurrencyCode[] {
    return Array.from(this.currencies.keys());
  }
}

/**
 * The global default currency registry.
 * This is used by getCurrencyConfig when no registry is specified.
 */
export const currencyRegistry = new CurrencyRegistry();

/**
 * Create a new isolated currency registry.
 * Use this when you need a separate registry that doesn't affect the global state.
 * @returns A new CurrencyRegistry instance
 */
export function createCurrencyRegistry(): CurrencyRegistry {
  return new CurrencyRegistry();
}

