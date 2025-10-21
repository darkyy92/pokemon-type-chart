import { PokemonType } from '../types';
import { getTypeColor } from '../utils/typeCalculator';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TypeBadge({ type, size = 'md', showLabel = true }: TypeBadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-5 py-2.5 text-lg min-h-[48px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: getTypeColor(type) }}
    >
      {showLabel && <span className="capitalize">{type}</span>}
    </span>
  );
}
