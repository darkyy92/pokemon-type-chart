export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
}

export interface TypeMatchup {
  superEffective: PokemonType[];
  notEffective: PokemonType[];
  noEffect: PokemonType[];
}

export interface DefenseMatchup {
  weak: PokemonType[];
  resistant: PokemonType[];
  immune: PokemonType[];
}

export interface CalculatedMatchup {
  type: PokemonType;
  multiplier: number;
}

export type MatchupCategory = 'offense' | 'defense';
