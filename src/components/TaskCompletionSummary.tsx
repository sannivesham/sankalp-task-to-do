import React from 'react';
import type { TaskStats } from '../types/task';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface TaskCompletionSummaryProps {
  stats: TaskStats;
  compact?: boolean;
}

export const TaskCompletionSummary: React.FC<TaskCompletionSummaryProps> = ({ stats, compact = false }) => {
  const { total, completed, overdue, completionRate } = stats;

  if (compact) {
    return (
      <div className="flex items-center justify-between text-xs font-medium text-sankalp-maroon/80 dark:text-sankalp-rose/80">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-sankalp-gold" />
          <span>{completed} of {total} done ({completionRate}%)</span>
        </div>
        {overdue > 0 && (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
            <AlertTriangle className="w-3 h-3" />
            {overdue} overdue
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-sankalp-dark-surface p-4 rounded-2xl border border-sankalp-rose/50 dark:border-sankalp-dark-border shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sankalp-burgundy/10 dark:bg-sankalp-burgundy/30 text-sankalp-burgundy dark:text-sankalp-rose">
            <Sparkles className="w-4 h-4 text-sankalp-gold" />
          </span>
          <span className="text-sm font-semibold text-sankalp-maroon dark:text-sankalp-ivory">
            Progress Resolve
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sankalp-gold/20 text-sankalp-maroon dark:text-sankalp-gold border border-sankalp-gold/40">
          {completionRate}% Done
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-sankalp-rose/40 dark:bg-sankalp-dark-surface2 h-2.5 rounded-full overflow-hidden my-2.5">
        <div
          className="bg-gradient-to-r from-sankalp-burgundy via-sankalp-gold to-sankalp-gold-hover h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionRate}%` }}
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-sankalp-maroon/70 dark:text-sankalp-rose/70 pt-1">
        <span>{completed} of {total} tasks completed</span>
        {overdue > 0 ? (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            {overdue} overdue
          </span>
        ) : (
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            {completed === total && total > 0 ? 'All promises fulfilled! ✨' : 'On track'}
          </span>
        )}
      </div>
    </div>
  );
};
