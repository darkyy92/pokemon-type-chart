import { PokemonType } from '../types';
import { getTypeColor } from '../utils/typeCalculator';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TypeBadge({ type, size = 'md', showLabel = true }: TypeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const typeEmojis: Record<PokemonType, string> = {
    normal: '⚪',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    ice: '❄️',
    fighting: '🥊',
    poison: '☠️',
    ground: '⛰️',
    flying: '🌪️',
    psychic: '🔮',
    bug: '🐛',
    rock: '🪨',
    ghost: '👻',
    dragon: '🐉',
    dark: '🌙',
    steel: '⚙️',
    fairy: '✨',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: getTypeColor(type) }}
    >
      <span>{typeEmojis[type]}</span>
      {showLabel && <span className="capitalize">{type}</span>}
    </span>
  );
}
