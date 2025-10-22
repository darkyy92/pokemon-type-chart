import { PokemonType } from '../types';

const CACHE_KEY = 'pokemon-move-types-cache';
const CACHE_VERSION = 'v1';

interface MoveTypeCache {
  version: string;
  data: { [moveName: string]: PokemonType | null };
}

// Normalize move name for PokeAPI (e.g., "Water Gun" -> "water-gun")
function normalizeMoveNameForAPI(moveName: string): string {
  return moveName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Get cache from localStorage
function getCache(): MoveTypeCache {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as MoveTypeCache;
      if (parsed.version === CACHE_VERSION) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read move type cache:', e);
  }
  return { version: CACHE_VERSION, data: {} };
}

// Save cache to localStorage
function saveCache(cache: MoveTypeCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to save move type cache:', e);
  }
}

// Fetch move type from PokeAPI
async function fetchMoveTypeFromAPI(moveName: string): Promise<PokemonType | null> {
  const normalizedName = normalizeMoveNameForAPI(moveName);

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${normalizedName}`);

    if (!response.ok) {
      console.warn(`Failed to fetch move type for "${moveName}":`, response.status);
      return null;
    }

    const data = await response.json();
    const typeName = data.type?.name;

    // Validate that it's a valid PokemonType
    const validTypes: PokemonType[] = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    if (typeName && validTypes.includes(typeName as PokemonType)) {
      return typeName as PokemonType;
    }

    return null;
  } catch (error) {
    console.warn(`Error fetching move type for "${moveName}":`, error);
    return null;
  }
}

/**
 * Get the type of a Pokemon move with caching
 * @param moveName The name of the move (e.g., "Water Gun")
 * @returns Promise resolving to the PokemonType or null if unavailable
 */
export async function getMoveType(moveName: string): Promise<PokemonType | null> {
  const cache = getCache();

  // Return cached value if exists
  if (moveName in cache.data) {
    return cache.data[moveName];
  }

  // Fetch from API
  const moveType = await fetchMoveTypeFromAPI(moveName);

  // Cache the result (even if null to avoid repeated failed requests)
  cache.data[moveName] = moveType;
  saveCache(cache);

  return moveType;
}

/**
 * Prefetch move types for multiple moves (with rate limiting)
 * @param moveNames Array of move names to prefetch
 * @param delayMs Delay between requests in milliseconds (default: 100ms)
 */
export async function prefetchMoveTypes(
  moveNames: string[],
  delayMs: number = 100
): Promise<Map<string, PokemonType | null>> {
  const cache = getCache();
  const results = new Map<string, PokemonType | null>();
  const toFetch: string[] = [];

  // Check which moves need fetching
  for (const moveName of moveNames) {
    if (moveName in cache.data) {
      results.set(moveName, cache.data[moveName]);
    } else {
      toFetch.push(moveName);
    }
  }

  // Fetch missing moves with delay between requests
  for (let i = 0; i < toFetch.length; i++) {
    const moveName = toFetch[i];

    // Add delay between requests to avoid rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    const moveType = await fetchMoveTypeFromAPI(moveName);
    results.set(moveName, moveType);

    // Update cache
    cache.data[moveName] = moveType;
  }

  // Save cache once after all fetches
  if (toFetch.length > 0) {
    saveCache(cache);
  }

  return results;
}
