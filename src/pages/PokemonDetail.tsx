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
          <h2 className="text-2xl font-bold text-white mb-4">Pokemon not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold"
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
          className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Pokemon Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4">
          <div className="flex items-center gap-6">
            <img
              src={getPokemonSpriteUrl(pokemon)}
              alt={pokemon.name}
              className="w-24 h-24 md:w-32 md:h-32"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
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
          <div className="bg-green-500 rounded-2xl shadow-2xl p-6 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
              USE THESE TYPES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {useTheseTypes.map(({ type, multiplier }) => {
                const badgeColor = multiplier === 4 ? 'bg-yellow-500' : 'bg-green-600';
                return (
                  <div
                    key={type}
                    className="relative rounded-xl overflow-hidden shadow-lg p-4 flex flex-col items-center justify-center min-h-20"
                    style={{ backgroundColor: getTypeColor(type) }}
                  >
                    <span className="text-base md:text-lg font-bold text-white capitalize text-center">
                      {type}
                    </span>
                    <div className={`absolute top-2 right-2 ${badgeColor} text-white font-bold text-xs md:text-sm px-2 py-1 rounded-full`}>
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
          <div className="bg-red-500 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
              AVOID THESE TYPES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {avoidTheseTypes.map(({ type, multiplier }) => {
                const getBadgeColor = () => {
                  if (multiplier === 0) return 'bg-gray-900';
                  if (multiplier === 0.25) return 'bg-red-700';
                  return 'bg-orange-500';
                };
                return (
                  <div
                    key={type}
                    className="relative rounded-xl overflow-hidden shadow-lg p-4 flex flex-col items-center justify-center min-h-20"
                    style={{ backgroundColor: getTypeColor(type) }}
                  >
                    <span className="text-base md:text-lg font-bold text-white capitalize text-center">
                      {type}
                    </span>
                    <div className={`absolute top-2 right-2 ${getBadgeColor()} text-white font-bold text-xs md:text-sm px-2 py-1 rounded-full`}>
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
