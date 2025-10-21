import { PokemonType, TypeMatchup } from '../types';

export const offenseMatchups: Record<PokemonType, TypeMatchup> = {
  normal: {
    superEffective: [],
    notEffective: ['rock', 'steel'],
    noEffect: ['ghost'],
  },
  fire: {
    superEffective: ['grass', 'ice', 'bug', 'steel'],
    notEffective: ['fire', 'water', 'rock', 'dragon'],
    noEffect: [],
  },
  water: {
    superEffective: ['fire', 'ground', 'rock'],
    notEffective: ['water', 'grass', 'dragon'],
    noEffect: [],
  },
  electric: {
    superEffective: ['water', 'flying'],
    notEffective: ['electric', 'grass', 'dragon'],
    noEffect: ['ground'],
  },
  grass: {
    superEffective: ['water', 'ground', 'rock'],
    notEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    noEffect: [],
  },
  ice: {
    superEffective: ['grass', 'ground', 'flying', 'dragon'],
    notEffective: ['fire', 'water', 'ice', 'steel'],
    noEffect: [],
  },
  fighting: {
    superEffective: ['normal', 'ice', 'rock', 'dark', 'steel'],
    notEffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    noEffect: ['ghost'],
  },
  poison: {
    superEffective: ['grass', 'fairy'],
    notEffective: ['poison', 'ground', 'rock', 'ghost'],
    noEffect: ['steel'],
  },
  ground: {
    superEffective: ['fire', 'electric', 'poison', 'rock', 'steel'],
    notEffective: ['grass', 'bug'],
    noEffect: ['flying'],
  },
  flying: {
    superEffective: ['grass', 'fighting', 'bug'],
    notEffective: ['electric', 'rock', 'steel'],
    noEffect: [],
  },
  psychic: {
    superEffective: ['fighting', 'poison'],
    notEffective: ['psychic', 'steel'],
    noEffect: ['dark'],
  },
  bug: {
    superEffective: ['grass', 'psychic', 'dark'],
    notEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    noEffect: [],
  },
  rock: {
    superEffective: ['fire', 'ice', 'flying', 'bug'],
    notEffective: ['fighting', 'ground', 'steel'],
    noEffect: [],
  },
  ghost: {
    superEffective: ['psychic', 'ghost'],
    notEffective: ['dark'],
    noEffect: ['normal'],
  },
  dragon: {
    superEffective: ['dragon'],
    notEffective: ['steel'],
    noEffect: ['fairy'],
  },
  dark: {
    superEffective: ['psychic', 'ghost'],
    notEffective: ['fighting', 'dark', 'fairy'],
    noEffect: [],
  },
  steel: {
    superEffective: ['ice', 'rock', 'fairy'],
    notEffective: ['fire', 'water', 'electric', 'steel'],
    noEffect: [],
  },
  fairy: {
    superEffective: ['fighting', 'dragon', 'dark'],
    notEffective: ['fire', 'poison', 'steel'],
    noEffect: [],
  },
};
