import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { TrainerEntry, TrainerIndex, Pokemon, PokemonType } from '../types';
import { TrainerCard } from '../components/TrainerCard';
import { RankBadge } from '../components/RankBadge';
import { TypeBadge } from '../components/TypeBadge';
import { pokemonDatabase } from '../data/pokemon';
import { getTypeColor, calculateDefenseMatchups, groupMatchupsByCategory, getPokemonSpriteUrl } from '../utils/typeCalculator';
import { prefetchMoveTypes } from '../utils/moveTypeHelper';

export function Trainers() {
  const [trainersIndex, setTrainersIndex] = useState<TrainerIndex[]>([]);
  const [trainersData, setTrainersData] = useState<TrainerEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [moveTypes, setMoveTypes] = useState<Map<string, PokemonType | null>>(new Map());
  const [selectedPokemonDetail, setSelectedPokemonDetail] = useState<Pokemon | null>(null);
  const [isPokemonDrawerOpen, setIsPokemonDrawerOpen] = useState(false);

  // Load trainers index on mount
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        // Use import.meta.env.BASE_URL to handle GitHub Pages base path
        const basePath = import.meta.env.BASE_URL || '/';

        // Load lightweight index first
        const indexResponse = await fetch(`${basePath}data/trainers.index.json`);
        const index: TrainerIndex[] = await indexResponse.json();
        setTrainersIndex(index);

        // Load full data
        const dataResponse = await fetch(`${basePath}data/trainers.json`);
        const data: TrainerEntry[] = await dataResponse.json();
        setTrainersData(data);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load trainer data:', error);
        setIsLoading(false);
      }
    };

    loadTrainers();
  }, []);

  // Fuzzy search setup
  const fuse = useMemo(() => {
    return new Fuse(trainersIndex, {
      keys: ['name', 'rank', 'faction'],
      threshold: 0.35,
      includeScore: true,
    });
  }, [trainersIndex]);

  // Search results
  const filteredTrainers = useMemo(() => {
    if (!searchQuery.trim()) {
      return trainersIndex;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse, trainersIndex]);

  // Open trainer detail
  const openTrainerDetail = (trainerId: string) => {
    const trainer = trainersData.find((t) => t.id === trainerId);
    if (trainer) {
      setSelectedTrainer(trainer);
      setIsDrawerOpen(true);
    }
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedTrainer(null), 300);
  };

  // Open Pokemon detail drawer
  const openPokemonDetail = (pokemon: Pokemon) => {
    setSelectedPokemonDetail(pokemon);
    setIsPokemonDrawerOpen(true);
  };

  // Close Pokemon detail drawer
  const closePokemonDrawer = () => {
    setIsPokemonDrawerOpen(false);
    setTimeout(() => setSelectedPokemonDetail(null), 300);
  };

  // Prefetch move types when trainer is selected
  useEffect(() => {
    if (!selectedTrainer) return;

    const allMoves: string[] = [];
    selectedTrainer.party.forEach((pokemon) => {
      if (pokemon.knownMoves) {
        allMoves.push(...pokemon.knownMoves);
      }
    });

    // Fetch move types in background
    if (allMoves.length > 0) {
      prefetchMoveTypes(allMoves).then((types) => {
        setMoveTypes(types);
      });
    }
  }, [selectedTrainer]);

  // Get Pokemon sprite URL
  const getPokemonSprite = (species: string): string => {
    const speciesNormalized = species.toLowerCase().replace(/\s+/g, '-');

    // Handle Mega Evolutions
    if (species.includes('Mega')) {
      return `https://img.pokemondb.net/sprites/home/normal/${speciesNormalized}.png`;
    }

    return `https://img.pokemondb.net/sprites/home/normal/${speciesNormalized}.png`;
  };

  // Get Pokemon from our database
  const getPokemonData = (species: string): Pokemon | undefined => {
    return pokemonDatabase.find(
      (p: Pokemon) => p.name.toLowerCase() === species.toLowerCase() ||
             p.name.toLowerCase().replace(/\s+/g, '-') === species.toLowerCase().replace(/\s+/g, '-')
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Trainers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Z-A Royale Promotion Matches & Story Bosses
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainers by name, rank, or faction..."
            className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            autoFocus
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Showing {filteredTrainers.length} of {trainersIndex.length} trainers
        </div>

        {/* Trainer Cards Grid */}
        <div className="space-y-3">
          {filteredTrainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onClick={() => openTrainerDetail(trainer.id)}
            />
          ))}

          {filteredTrainers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No trainers found matching "{searchQuery}"
              </p>
            </div>
          )}
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
        {selectedTrainer && (
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

            {/* Trainer Header */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex-1">
                  {selectedTrainer.name}
                </h2>
                {selectedTrainer.rank && <RankBadge rank={selectedTrainer.rank} size="lg" />}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTrainer.category === 'Boss' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Boss Battle
                  </span>
                )}
                {selectedTrainer.category === 'PromotionMatch' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Promotion Match
                  </span>
                )}
                {selectedTrainer.faction && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {selectedTrainer.faction}
                  </span>
                )}
              </div>

              {selectedTrainer.notes && (
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {selectedTrainer.notes}
                </p>
              )}
            </div>

            {/* Pokemon Party */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Party ({selectedTrainer.party.length})
              </h3>

              {selectedTrainer.party.length === 0 ? (
                /* Empty party message */
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    No Pokemon Data Available
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Party data for this trainer hasn't been added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedTrainer.party.map((pokemon, idx) => {
                    // Handle missing species gracefully
                    const species = pokemon.species || 'Unknown Pokemon';
                    const pokemonData = pokemon.species ? getPokemonData(pokemon.species) : undefined;

                    return (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start gap-4">
                          {/* Pokemon Sprite */}
                          {pokemon.species ? (
                            <div className="flex-shrink-0">
                              <img
                                src={getPokemonSprite(pokemon.species)}
                                alt={pokemon.species}
                                className="w-20 h-20 object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  // Fallback to placeholder on image error
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}

                          {/* Pokemon Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                  {species}
                                  {pokemon.isMega && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                                      MEGA
                                    </span>
                                  )}
                                  {!pokemon.species && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 font-semibold">
                                      DATA PENDING
                                    </span>
                                  )}
                                </h4>
                                {pokemon.level && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Level {pokemon.level}
                                  </p>
                                )}
                                {/* Pokemon Types */}
                                {pokemonData && pokemonData.types && (
                                  <div className="flex gap-1.5 mb-1">
                                    {pokemonData.types.map((type) => (
                                      <TypeBadge key={type} type={type} size="sm" />
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* View in Pokedex link */}
                              {pokemonData && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPokemonDetail(pokemonData);
                                  }}
                                  className="text-xs px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 font-medium transition-colors"
                                >
                                  View
                                </button>
                              )}
                            </div>

                            {/* Held Item */}
                            {pokemon.heldItem && (
                              <div className="mb-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 font-medium">
                                  {pokemon.heldItem}
                                </span>
                              </div>
                            )}

                            {/* Known Moves */}
                            {pokemon.knownMoves && pokemon.knownMoves.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                  Known Moves:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {pokemon.knownMoves.map((move, moveIdx) => {
                                    const moveType = moveTypes.get(move);
                                    const hasType = moveType !== null && moveType !== undefined;

                                    return hasType ? (
                                      <div
                                        key={moveIdx}
                                        className="text-xs px-2 py-1 rounded-md font-medium text-white flex items-center gap-1.5"
                                        style={{ backgroundColor: getTypeColor(moveType) }}
                                      >
                                        <img
                                          src={`/pokemon-type-chart/icons/${moveType}.svg`}
                                          alt={moveType}
                                          className="w-4 h-4"
                                        />
                                        <span>{move}</span>
                                      </div>
                                    ) : (
                                      <span
                                        key={moveIdx}
                                        className="text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium"
                                      >
                                        {move}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sources */}
            {selectedTrainer.sources && selectedTrainer.sources.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                  Data Sources
                </h3>
                <div className="space-y-2">
                  {selectedTrainer.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      {source.site} →
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  Last verified: {selectedTrainer.last_verified}
                </p>

                {/* Report Mismatch Link */}
                <a
                  href={`https://github.com/darkyy92/pokemon-type-chart/issues/new?title=Trainer%20Data%20Mismatch:%20${encodeURIComponent(selectedTrainer.name)}&body=Please%20describe%20the%20issue%20with%20${encodeURIComponent(selectedTrainer.name)}'s%20data:`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
                >
                  Report mismatch →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pokemon Detail Drawer Overlay */}
      {isPokemonDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-60 transition-opacity"
          onClick={closePokemonDrawer}
        />
      )}

      {/* Pokemon Detail Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white dark:bg-gray-800 shadow-2xl z-70 transform transition-transform duration-300 overflow-y-auto ${
          isPokemonDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedPokemonDetail && (
          <div className="p-6 pb-24">
            {/* Close Button */}
            <button
              onClick={closePokemonDrawer}
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
                  src={getPokemonSpriteUrl(selectedPokemonDetail)}
                  alt={selectedPokemonDetail.name}
                  className="w-20 h-20 object-contain flex-shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedPokemonDetail.name}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    {selectedPokemonDetail.types.map((type) => (
                      <TypeBadge key={type} type={type} size="lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const matchups = calculateDefenseMatchups(selectedPokemonDetail.types[0], selectedPokemonDetail.types[1]);
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
                              className="rounded-xl overflow-hidden shadow-lg p-2 flex items-center gap-2"
                              style={{ backgroundColor: getTypeColor(type) }}
                            >
                              <img
                                src={`/pokemon-type-chart/icons/${type}.svg`}
                                alt={type}
                                className="w-12 h-12 flex-shrink-0"
                              />
                              <span className="text-base font-bold text-white capitalize flex-1" style={{ textShadow: '1px 1px 0 #000' }}>
                                {type}
                              </span>
                              <div className={`bg-white font-extrabold text-base px-3 py-1 rounded-full ${textColor} flex-shrink-0`}>
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
                              className="rounded-xl overflow-hidden shadow-lg p-2 flex items-center gap-2"
                              style={{ backgroundColor: getTypeColor(type) }}
                            >
                              <img
                                src={`/pokemon-type-chart/icons/${type}.svg`}
                                alt={type}
                                className="w-12 h-12 flex-shrink-0"
                              />
                              <span className="text-base font-bold text-white capitalize flex-1" style={{ textShadow: '1px 1px 0 #000' }}>
                                {type}
                              </span>
                              <div className={`bg-white font-extrabold text-base px-3 py-1 rounded-full ${getTextColor()} flex-shrink-0`}>
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
