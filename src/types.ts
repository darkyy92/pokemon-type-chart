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

// Trainer-related types
export interface TrainerPartyMember {
  species: string;
  level: number | null;
  form: string | null;
  isMega: boolean;
  heldItem?: string | null;
  knownMoves?: string[];
}

export interface TrainerSource {
  url: string;
  site: 'serebii' | 'game8' | 'polygon' | 'gamespot' | 'pokemondb' | 'bulbapedia';
  scraped_at: string;
}

export interface TrainerEntry {
  id: string;
  name: string;
  rank: string | null;
  category: 'PromotionMatch' | 'Boss';
  faction?: string | null;
  battle_order?: number | null;
  party: TrainerPartyMember[];
  rewards?: string[];
  notes?: string;
  sources: TrainerSource[];
  last_verified: string;
  version: string;
}

export interface TrainerIndex {
  id: string;
  name: string;
  rank: string | null;
  category: 'PromotionMatch' | 'Boss';
  faction?: string | null;
}
