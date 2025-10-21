import { TrainerIndex } from '../types';
import { RankBadge } from './RankBadge';

interface TrainerCardProps {
  trainer: TrainerIndex;
  onClick: () => void;
}

export function TrainerCard({ trainer, onClick }: TrainerCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-4 text-left border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 min-h-[88px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Trainer Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
            {trainer.name}
          </h3>

          {/* Category & Faction */}
          <div className="flex flex-wrap gap-2 items-center">
            {trainer.category === 'Boss' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Boss
              </span>
            )}
            {trainer.category === 'PromotionMatch' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Promotion
              </span>
            )}
            {trainer.faction && (
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {trainer.faction}
              </span>
            )}
          </div>
        </div>

        {/* Rank Badge */}
        {trainer.rank && (
          <div className="flex-shrink-0">
            <RankBadge rank={trainer.rank} size="lg" />
          </div>
        )}
      </div>
    </button>
  );
}
