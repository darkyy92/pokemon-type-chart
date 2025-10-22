import { useParams, useNavigate } from 'react-router-dom';
import { pokemonDatabase } from '../data/pokemon';
import { TypeBadge } from '../components/TypeBadge';
import {
  calculateDefenseMatchups,
  groupMatchupsByCategory,
  getPokemonSpriteUrl,
  getTypeColor,
} from '../utils/typeCalculator';

export function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const pokemon = pokemonDatabase.find(
    (p) => p.name.toLowerCase() === name?.toLowerCase()
  );

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-4">Pokemon not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg font-semibold"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const matchups = calculateDefenseMatchups(pokemon.types[0], pokemon.types[1]);
  const grouped = groupMatchupsByCategory(matchups);

  // Combine all effective types (4x and 2x)
  const useTheseTypes = [...grouped.quadWeak, ...grouped.doubleWeak];

  // Combine all resisted types (0.5x, 0.25x, and 0x)
  const avoidTheseTypes = [...grouped.immune, ...grouped.quadResist, ...grouped.doubleResist];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Pokemon Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <img
              src={getPokemonSpriteUrl(pokemon)}
              alt={pokemon.name}
              className="w-24 h-24 md:w-32 md:h-32"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {pokemon.name}
              </h1>
              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} size="lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* USE THESE TYPES - Green, Prominent */}
        {useTheseTypes.length > 0 && (
          <div className="border-4 border-green-600 dark:border-green-700 rounded-2xl shadow-2xl p-6 mb-4" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(22,163,74,0.08) 5px, rgba(22,163,74,0.08) 6px)', backgroundColor: '#ffffff' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
              USE THESE TYPES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {useTheseTypes.map(({ type, multiplier }) => {
                const textColor = multiplier === 4 ? 'text-yellow-500' : 'text-green-600';
                return (
                  <div
                    key={type}
                    className="rounded-xl overflow-hidden shadow-lg p-3 flex flex-col items-center justify-center gap-2 min-h-16"
                    style={{ backgroundColor: getTypeColor(type) }}
                  >
                    <img
                      src={`/pokemon-type-chart/icons/${type}.svg`}
                      alt={type}
                      className="w-12 h-12"
                      style={{ filter: 'drop-shadow(1px 1px 0 #000)' }}
                    />
                    <span className="text-lg md:text-xl font-bold text-white capitalize text-center" style={{ textShadow: '1px 1px 0 #000' }}>
                      {type}
                    </span>
                    <div className={`bg-white font-extrabold text-base md:text-lg px-3 py-1 rounded-full ${textColor}`}>
                      {multiplier}×
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AVOID THESE TYPES - Red, Warning */}
        {avoidTheseTypes.length > 0 && (
          <div className="border-4 border-red-600 dark:border-red-700 rounded-2xl shadow-2xl p-6" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(220,38,38,0.08) 5px, rgba(220,38,38,0.08) 6px)', backgroundColor: '#ffffff' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
              AVOID THESE TYPES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {avoidTheseTypes.map(({ type, multiplier }) => {
                const getTextColor = () => {
                  if (multiplier === 0) return 'text-gray-900';
                  if (multiplier === 0.25) return 'text-red-700';
                  return 'text-orange-500';
                };
                return (
                  <div
                    key={type}
                    className="rounded-xl overflow-hidden shadow-lg p-3 flex flex-col items-center justify-center gap-2 min-h-16"
                    style={{ backgroundColor: getTypeColor(type) }}
                  >
                    <img
                      src={`/pokemon-type-chart/icons/${type}.svg`}
                      alt={type}
                      className="w-12 h-12"
                      style={{ filter: 'drop-shadow(1px 1px 0 #000)' }}
                    />
                    <span className="text-lg md:text-xl font-bold text-white capitalize text-center" style={{ textShadow: '1px 1px 0 #000' }}>
                      {type}
                    </span>
                    <div className={`bg-white font-extrabold text-base md:text-lg px-3 py-1 rounded-full ${getTextColor()}`}>
                      {multiplier}×
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
