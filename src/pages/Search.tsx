import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { pokemonDatabase } from '../data/pokemon';
import { Pokemon } from '../types';
import { TypeBadge } from '../components/TypeBadge';
import { getPokemonSpriteUrl } from '../utils/typeCalculator';

const fuse = new Fuse(pokemonDatabase, {
  keys: ['name'],
  threshold: 0.3,
  includeScore: true,
});

export function Search() {
  const [query, setQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(pokemonDatabase);
  const navigate = useNavigate();

  // Filter Pokemon as user types
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredPokemon(pokemonDatabase);
      return;
    }

    const searchResults = fuse.search(query);
    setFilteredPokemon(searchResults.map(result => result.item));
  }, [query]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen pb-32 px-4 pt-6">
      {/* Logo */}
      <div className="text-center mb-6">
        <img
          src="/pokemon-type-chart/legends-za-logo.png"
          alt="Pokémon Legends Z-A"
          className="w-full max-w-xs mx-auto h-auto"
        />
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {filteredPokemon.map((pokemon) => (
          <button
            key={pokemon.id}
            onClick={() => handleSelectPokemon(pokemon)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl
                       transition-all duration-300 hover:scale-105 active:scale-95
                       p-4 flex flex-col items-center gap-3 h-full min-h-[280px]"
          >
            {/* Sprite */}
            <div className="h-40 w-40 flex items-center justify-center flex-shrink-0 mx-auto">
              <img
                src={getPokemonSpriteUrl(pokemon)}
                alt={pokemon.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Name */}
            <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 text-center line-clamp-1 w-full px-1">
              {pokemon.name}
            </h3>

            {/* Types */}
            <div className="flex gap-1 flex-wrap justify-center min-h-[28px]">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} size="sm" />
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* No Results Message */}
      {filteredPokemon.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No Pokemon found for "{query}"
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Try a different search term
          </p>
        </div>
      )}

      {/* Floating Search Bar */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent dark:from-black dark:via-black pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-6 py-4 gap-3">
              {/* Search Icon */}
              <svg
                className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {/* Search Input */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Pokemon..."
                className="flex-1 text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100
                           bg-transparent border-none outline-none
                           placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />

              {/* Clear Button */}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700
                             hover:bg-gray-300 dark:hover:bg-gray-600
                             flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
