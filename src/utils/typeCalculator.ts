import { PokemonType, CalculatedMatchup } from '../types';
import { defenseMatchups } from '../data/typeMatchupsDefense';

/**
 * Calculate combined type effectiveness for dual-type Pokemon
 * Multiplies defense multipliers for each attacking type
 */
export function calculateDefenseMatchups(
  type1: PokemonType,
  type2?: PokemonType
): CalculatedMatchup[] {
  const matchups = new Map<PokemonType, number>();

  // All Pokemon types for iteration
  const allTypes: PokemonType[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  // Calculate for each attacking type
  allTypes.forEach(attackingType => {
    let multiplier = 1;

    // Type 1 defense
    const type1Defense = defenseMatchups[type1];
    if (type1Defense.weak.includes(attackingType)) multiplier *= 2;
    if (type1Defense.resistant.includes(attackingType)) multiplier *= 0.5;
    if (type1Defense.immune.includes(attackingType)) multiplier = 0;

    // Type 2 defense (if exists)
    if (type2) {
      const type2Defense = defenseMatchups[type2];
      if (type2Defense.weak.includes(attackingType)) multiplier *= 2;
      if (type2Defense.resistant.includes(attackingType)) multiplier *= 0.5;
      if (type2Defense.immune.includes(attackingType)) multiplier = 0;
    }

    matchups.set(attackingType, multiplier);
  });

  // Convert to array and sort by multiplier (highest first)
  return Array.from(matchups.entries())
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);
}

/**
 * Group matchups by effectiveness category
 */
export function groupMatchupsByCategory(matchups: CalculatedMatchup[]) {
  return {
    quadWeak: matchups.filter(m => m.multiplier === 4),
    doubleWeak: matchups.filter(m => m.multiplier === 2),
    neutral: matchups.filter(m => m.multiplier === 1),
    doubleResist: matchups.filter(m => m.multiplier === 0.5),
    quadResist: matchups.filter(m => m.multiplier === 0.25),
    immune: matchups.filter(m => m.multiplier === 0),
  };
}

/**
 * Get Pokemon sprite URL from pokemondb.net
 * Regular Pokemon: artwork/avif/{name}.avif
 * Official Megas (Gen 6-7, ID 10033-10090): artwork/avif/{name}-mega.avif
 * Z-A Megas (new, ID outside range): artwork/tmp/{name}-mega.jpg
 */
export function getPokemonSpriteUrl(pokemon: { id: number; name: string }): string {
  const isMega = pokemon.name.startsWith('Mega ');

  if (isMega) {
    // Convert "Mega Feraligatr" → "feraligatr-mega"
    // Convert "Mega Charizard X" → "charizard-mega-x"
    const namePart = pokemon.name.replace('Mega ', '').toLowerCase();
    const parts = namePart.split(' ');

    let megaName: string;
    if (parts.length === 1) {
      // Simple mega: "Mega Feraligatr" → "feraligatr-mega"
      megaName = `${parts[0]}-mega`;
    } else {
      // Form variant: "Mega Charizard X" → "charizard-mega-x"
      const baseName = parts[0];
      const form = parts[1].toLowerCase();
      megaName = `${baseName}-mega-${form}`;
    }

    // Official Megas from Gen 6-7 games use avif format
    // Z-A exclusive Megas use tmp jpg format
    const isOfficialMega = pokemon.id >= 10033 && pokemon.id <= 10090;
    if (isOfficialMega) {
      return `https://img.pokemondb.net/artwork/avif/${megaName}.avif`;
    } else {
      return `https://img.pokemondb.net/artwork/tmp/${megaName}.jpg`;
    }
  }

  // Regular Pokemon: "Feraligatr" → "feraligatr.avif"
  const name = pokemon.name.toLowerCase();
  return `https://img.pokemondb.net/artwork/avif/${name}.avif`;
}

/**
 * Get type color for badges
 */
export function getTypeColor(type: PokemonType): string {
  const colors: Record<PokemonType, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type];
}
