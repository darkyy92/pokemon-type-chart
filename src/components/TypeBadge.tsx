import { PokemonType } from '../types';
import { getTypeColor } from '../utils/typeCalculator';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
}

export function TypeBadge({ type, size = 'md', showLabel = true, showIcon = true }: TypeBadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-5 py-2.5 text-lg min-h-[48px]',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: getTypeColor(type) }}
    >
      {showIcon && (
        <img
          src={`/pokemon-type-chart/icons/${type}.svg`}
          alt={type}
          className={iconSizes[size]}
        />
      )}
      {showLabel && <span className="capitalize">{type}</span>}
    </span>
  );
}
