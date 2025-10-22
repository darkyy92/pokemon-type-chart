import { PokemonType } from '../types';
import { movesToTypes } from '../data/moves';

/**
 * Get the type of a Pokemon move from static database
 * @param moveName The name of the move (e.g., "Water Gun")
 * @returns The PokemonType or null if unavailable
 */
export function getMoveType(moveName: string): PokemonType | null {
  return movesToTypes[moveName] ?? null;
}

/**
 * Get move types for multiple moves from static database
 * @param moveNames Array of move names to get types for
 * @returns Map of move names to their types
 */
export function getMoveTypes(moveNames: string[]): Map<string, PokemonType | null> {
  const results = new Map<string, PokemonType | null>();

  for (const moveName of moveNames) {
    results.set(moveName, getMoveType(moveName));
  }

  return results;
}

/**
 * Prefetch move types for multiple moves (synchronous - static data)
 * @param moveNames Array of move names to prefetch
 * @returns Map of move names to their types
 * @deprecated Use getMoveTypes() instead - this is now synchronous
 */
export function prefetchMoveTypes(
  moveNames: string[]
): Map<string, PokemonType | null> {
  return getMoveTypes(moveNames);
}
