import { useState, useEffect, useRef } from 'react';
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
  const [results, setResults] = useState<Pokemon[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search as user types
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.slice(0, 5).map(result => result.item));
  }, [query]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Pokémon Legends Z-A
          </h1>
          <p className="text-white/80 text-lg">
            Battle Helper
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pokemon..."
            className="w-full px-6 py-4 text-2xl md:text-3xl font-semibold text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-400"
          />

          {/* Search Results */}
          {results.length > 0 && (
            <div className="mt-2 space-y-2">
              {results.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handleSelectPokemon(pokemon)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  {/* Sprite */}
                  <img
                    src={getPokemonSpriteUrl(pokemon.id)}
                    alt={pokemon.name}
                    className="w-16 h-16"
                    loading="lazy"
                  />

                  {/* Name and Types */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {pokemon.name}
                    </h3>
                    <div className="flex gap-2">
                      {pokemon.types.map((type) => (
                        <TypeBadge key={type} type={type} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hint Text */}
        <p className="text-center text-white/60 mt-6">
          Type a Pokemon name to see its weaknesses and counters
        </p>
      </div>
    </div>
  );
}
