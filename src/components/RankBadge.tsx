interface RankBadgeProps {
  rank: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  if (!rank) return null;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs min-w-[32px] min-h-[28px]',
    md: 'px-3 py-1.5 text-sm min-w-[36px] min-h-[32px]',
    lg: 'px-4 py-2 text-base min-w-[44px] min-h-[44px]',
  };

  // Rank-based gradient colors (higher rank = cooler colors)
  const getRankColor = (rank: string) => {
    const rankUpper = rank.toUpperCase();

    // Special ranks
    if (rankUpper === '∞' || rankUpper === 'INFINITY') {
      return 'bg-gradient-to-br from-purple-500 to-pink-500';
    }

    // A-E ranks (high tier - blue/purple gradients)
    if (['A', 'B', 'C', 'D', 'E'].includes(rankUpper)) {
      return 'bg-gradient-to-br from-blue-500 to-purple-500';
    }

    // F-M ranks (mid tier - green/cyan gradients)
    if (['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].includes(rankUpper)) {
      return 'bg-gradient-to-br from-cyan-500 to-blue-500';
    }

    // N-Z ranks (low tier - yellow/orange gradients)
    return 'bg-gradient-to-br from-yellow-500 to-orange-500';
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-bold text-white shadow-md ${sizeClasses[size]} ${getRankColor(rank)}`}
    >
      {rank === '∞' || rank.toLowerCase() === 'infinity' ? '∞' : rank.toUpperCase()}
    </span>
  );
}
