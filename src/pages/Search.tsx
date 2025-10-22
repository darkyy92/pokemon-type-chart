import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { pokemonDatabase } from '../data/pokemon';
import { Pokemon } from '../types';
import { TypeBadge } from '../components/TypeBadge';
import {
  getPokemonSpriteUrl,
  calculateDefenseMatchups,
  groupMatchupsByCategory,
  getTypeColor,
} from '../utils/typeCalculator';

const fuse = new Fuse(pokemonDatabase, {
  keys: ['name'],
  threshold: 0.3,
  includeScore: true,
});

export function Search() {
  const [query, setQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(pokemonDatabase);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    setSelectedPokemon(pokemon);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedPokemon(null), 300);
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
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="bg-blue-50 dark:bg-gray-700 rounded-full shadow-lg border-2 border-blue-300 dark:border-blue-500">
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

      {/* Detail Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Detail Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedPokemon && (
          <div className="p-6 pb-24">
            {/* Close Button */}
            <button
              onClick={closeDrawer}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Pokemon Header */}
            <div className="mb-6 pr-8">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={getPokemonSpriteUrl(selectedPokemon)}
                  alt={selectedPokemon.name}
                  className="w-20 h-20 object-contain flex-shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedPokemon.name}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    {selectedPokemon.types.map((type) => (
                      <TypeBadge key={type} type={type} size="lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const matchups = calculateDefenseMatchups(selectedPokemon.types[0], selectedPokemon.types[1]);
              const grouped = groupMatchupsByCategory(matchups);
              const useTheseTypes = [...grouped.quadWeak, ...grouped.doubleWeak];
              const avoidTheseTypes = [...grouped.immune, ...grouped.quadResist, ...grouped.doubleResist];

              return (
                <>
                  {/* USE THESE TYPES */}
                  {useTheseTypes.length > 0 && (
                    <div className="bg-green-600 dark:bg-green-700 rounded-xl shadow-lg p-4 mb-4">
                      <h3 className="text-lg font-bold text-white mb-3">USE THESE TYPES</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {useTheseTypes.map(({ type, multiplier }) => {
                          const textColor = multiplier === 4 ? 'text-yellow-500' : 'text-green-600';
                          return (
                            <div
                              key={type}
                              className="rounded-xl overflow-hidden shadow-lg p-2 flex flex-col items-center gap-2"
                              style={{ backgroundColor: getTypeColor(type) }}
                            >
                              <img
                                src={`/pokemon-type-chart/icons/${type}.svg`}
                                alt={type}
                                className="w-12 h-12"
                              />
                              <span className="text-base font-bold text-white capitalize text-center leading-tight" style={{ textShadow: '1px 1px 0 #000' }}>
                                {type}
                              </span>
                              <div className={`bg-white font-extrabold text-base px-3 py-1 rounded-full ${textColor}`}>
                                {multiplier}×
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AVOID THESE TYPES */}
                  {avoidTheseTypes.length > 0 && (
                    <div className="bg-red-600 dark:bg-red-700 rounded-xl shadow-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-3">AVOID THESE TYPES</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {avoidTheseTypes.map(({ type, multiplier }) => {
                          const getTextColor = () => {
                            if (multiplier === 0) return 'text-gray-900';
                            if (multiplier === 0.25) return 'text-red-700';
                            return 'text-orange-500';
                          };
                          return (
                            <div
                              key={type}
                              className="rounded-xl overflow-hidden shadow-lg p-2 flex flex-col items-center gap-2"
                              style={{ backgroundColor: getTypeColor(type) }}
                            >
                              <img
                                src={`/pokemon-type-chart/icons/${type}.svg`}
                                alt={type}
                                className="w-12 h-12"
                              />
                              <span className="text-base font-bold text-white capitalize text-center leading-tight" style={{ textShadow: '1px 1px 0 #000' }}>
                                {type}
                              </span>
                              <div className={`bg-white font-extrabold text-base px-3 py-1 rounded-full ${getTextColor()}`}>
                                {multiplier}×
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
