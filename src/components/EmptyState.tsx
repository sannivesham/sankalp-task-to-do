import React from 'react';
import type { ViewFilter } from '../types/task';
import { CheckCircle2, Calendar, Sparkles, Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  currentView: ViewFilter;
  hasSearchQuery: boolean;
  onOpenNewTask: () => void;
  onClearSearch: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentView,
  hasSearchQuery,
  onOpenNewTask,
  onClearSearch,
}) => {
  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-white/40 dark:bg-sankalp-dark-surface/40 border border-dashed border-sankalp-rose/60 dark:border-sankalp-dark-border my-6">
        <div className="w-12 h-12 rounded-2xl bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 flex items-center justify-center text-sankalp-burgundy dark:text-sankalp-gold mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-sankalp-maroon dark:text-sankalp-ivory mb-1">
          No matching resolves found
        </h3>
        <p className="text-sm text-sankalp-maroon/60 dark:text-sankalp-rose/60 max-w-sm mb-4">
          We couldn’t find any tasks matching your keywords or active filters.
        </p>
        <button
          onClick={onClearSearch}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-sankalp-burgundy text-sankalp-ivory hover:brightness-110 transition-all"
        >
          Clear search & filters
        </button>
      </div>
    );
  }

  const contentMap: Record<
    ViewFilter,
    { title: string; desc: string; icon: React.ElementType; actionLabel: string }
  > = {
    all: {
      title: 'No active resolves',
      desc: 'Your slate is completely clear. What important promise will you make and keep today?',
      icon: Sparkles,
      actionLabel: 'Add your first resolve',
    },
    today: {
      title: 'Nothing due today!',
      desc: 'All promises for today are completed or scheduled for upcoming days. Take a breath and reflect.',
      icon: CheckCircle2,
      actionLabel: 'Schedule a task for today',
    },
    upcoming: {
      title: 'No upcoming tasks scheduled',
      desc: 'Looking forward brings peace of mind. Add future deadlines and milestones to stay prepared.',
      icon: Calendar,
      actionLabel: 'Plan an upcoming task',
    },
    completed: {
      title: 'No completed tasks yet',
      desc: 'Every journey begins with a single step. Check off your tasks as you accomplish them.',
      icon: CheckCircle2,
      actionLabel: 'Create a task to complete',
    },
  };

  const current = contentMap[currentView];
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl bg-white/50 dark:bg-sankalp-dark-surface/50 border border-dashed border-sankalp-rose/60 dark:border-sankalp-dark-border my-6">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sankalp-rose/50 to-sankalp-gold/20 dark:from-sankalp-dark-surface2 dark:to-sankalp-burgundy/30 flex items-center justify-center text-sankalp-burgundy dark:text-sankalp-gold mb-3 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-sankalp-maroon dark:text-sankalp-ivory mb-1">
        {current.title}
      </h3>
      <p className="text-sm text-sankalp-maroon/60 dark:text-sankalp-rose/60 max-w-sm mb-5">
        {current.desc}
      </p>
      {currentView !== 'completed' && (
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-sankalp-burgundy to-sankalp-maroon text-sankalp-ivory hover:brightness-110 shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-sankalp-gold" />
          <span>{current.actionLabel}</span>
        </button>
      )}
    </div>
  );
};
