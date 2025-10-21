import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonType } from '../types';
import { offenseMatchups } from '../data/typeMatchupsOffense';
import { defenseMatchups } from '../data/typeMatchupsDefense';
import { TypeBadge } from '../components/TypeBadge';
import { getTypeColor } from '../utils/typeCalculator';

type TabType = 'offense' | 'defense';

const allTypes: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export function TypeChart() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('offense');

  return (
    <div className="min-h-screen p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center px-8 pt-8 pb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Pokemon Legends Z-A
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="sticky top-0 z-10 bg-white shadow-md">
            <div className="flex max-w-2xl mx-auto">
              <button
                onClick={() => setActiveTab('offense')}
                className={`flex-1 py-5 px-6 text-lg md:text-xl font-extrabold uppercase tracking-wide transition-all border-b-4 ${
                  activeTab === 'offense'
                    ? 'bg-white text-red-700 border-red-500'
                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Attack
              </button>
              <button
                onClick={() => setActiveTab('defense')}
                className={`flex-1 py-5 px-6 text-lg md:text-xl font-extrabold uppercase tracking-wide transition-all border-b-4 ${
                  activeTab === 'defense'
                    ? 'bg-white text-blue-700 border-blue-500'
                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                Defense
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'offense' && <OffenseTab />}
            {activeTab === 'defense' && <DefenseTab />}
          </div>

          {/* Footer */}
          <div className="text-center mt-10 mb-8 px-6 py-6 mx-6 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Note:</strong> This chart shows all type interactions for Pokemon Legends Z-A (2025)
            </p>
            <p className="text-xs text-gray-400">
              Includes same-type matchups (e.g., Grass vs Grass = 0.5×) and all immunity interactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OffenseTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {allTypes.map((type) => (
        <TypeCard key={type} type={type} mode="offense" />
      ))}
    </div>
  );
}

function DefenseTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {allTypes.map((type) => (
        <TypeCard key={type} type={type} mode="defense" />
      ))}
    </div>
  );
}

interface TypeCardProps {
  type: PokemonType;
  mode: 'offense' | 'defense';
}

function TypeCard({ type, mode }: TypeCardProps) {
  const matchups = mode === 'offense' ? offenseMatchups[type] : defenseMatchups[type];
  const typeColor = getTypeColor(type);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
      {/* Card Header */}
      <div
        className="py-6 px-6 text-white text-center"
        style={{ backgroundColor: typeColor }}
      >
        <h2 className="text-3xl font-extrabold uppercase tracking-wide capitalize">
          {type}
        </h2>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-8">
        {mode === 'offense' ? (
          <>
            <EffectivenessSection
              title="Super effective against:"
              types={matchups.superEffective}
              color="bg-green-500"
              symbol="2×"
            />
            <div className="border-t border-gray-200" />
            <EffectivenessSection
              title="Not very effective against:"
              types={matchups.notEffective}
              color="bg-orange-500"
              symbol="½×"
            />
            <div className="border-t border-gray-200" />
            <EffectivenessSection
              title="No effect against:"
              types={matchups.noEffect}
              color="bg-gray-500"
              symbol="0×"
            />
          </>
        ) : (
          <>
            <EffectivenessSection
              title="Weak against:"
              types={(matchups as any).weak}
              color="bg-green-500"
              symbol="2×"
            />
            <div className="border-t border-gray-200" />
            <EffectivenessSection
              title="Resistant against:"
              types={(matchups as any).resistant}
              color="bg-orange-500"
              symbol="½×"
            />
            <div className="border-t border-gray-200" />
            <EffectivenessSection
              title="Immune to:"
              types={(matchups as any).immune}
              color="bg-gray-500"
              symbol="0×"
            />
          </>
        )}
      </div>
    </div>
  );
}

interface EffectivenessSectionProps {
  title: string;
  types: PokemonType[];
  color: string;
  symbol: string;
}

function EffectivenessSection({ title, types, color, symbol }: EffectivenessSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color} text-white w-9 h-9 rounded-lg flex items-center justify-center text-base font-extrabold`}>
          {symbol}
        </div>
        <span className="text-base font-extrabold text-gray-800">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {types.length > 0 ? (
          types.map((type) => (
            <TypeBadge key={type} type={type} size="md" />
          ))
        ) : (
          <span className="text-gray-400 text-base italic ml-1">—</span>
        )}
      </div>
    </div>
  );
}
