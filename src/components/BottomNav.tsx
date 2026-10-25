import React from 'react';
import type { ViewFilter, TaskStats } from '../types/task';
import { ListTodo, CalendarCheck2, CalendarDays, CheckCircle2, Plus } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewFilter;
  onSelectView: (view: ViewFilter) => void;
  onOpenNewTask: () => void;
  stats: TaskStats;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenNewTask,
  stats,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-sankalp-dark/95 backdrop-blur-lg border-t border-sankalp-rose/40 dark:border-sankalp-dark-border px-3 py-1.5 flex items-center justify-around shadow-lg safe-bottom"
      aria-label="Mobile Navigation"
    >
      {/* All Tasks */}
      <button
        onClick={() => onSelectView('all')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
          currentView === 'all'
            ? 'text-sankalp-burgundy dark:text-sankalp-gold font-bold scale-105'
            : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 font-medium'
        }`}
      >
        <ListTodo className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">All ({stats.active})</span>
      </button>

      {/* Today */}
      <button
        onClick={() => onSelectView('today')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
          currentView === 'today'
            ? 'text-sankalp-burgundy dark:text-sankalp-gold font-bold scale-105'
            : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 font-medium'
        }`}
      >
        <div className="relative">
          <CalendarCheck2 className="w-5 h-5" />
          {stats.overdue > 0 && (
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          )}
        </div>
        <span className="text-[10px] mt-0.5">Today</span>
      </button>

      {/* Center Floating Action Button */}
      <button
        onClick={onOpenNewTask}
        className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-sankalp-burgundy via-sankalp-maroon to-sankalp-burgundy-hover text-sankalp-ivory shadow-lg border-2 border-sankalp-gold/50 active:scale-95 transition-transform"
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6 text-sankalp-gold" />
      </button>

      {/* Upcoming */}
      <button
        onClick={() => onSelectView('upcoming')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
          currentView === 'upcoming'
            ? 'text-sankalp-burgundy dark:text-sankalp-gold font-bold scale-105'
            : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 font-medium'
        }`}
      >
        <CalendarDays className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Upcoming</span>
      </button>

      {/* Completed */}
      <button
        onClick={() => onSelectView('completed')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
          currentView === 'completed'
            ? 'text-sankalp-burgundy dark:text-sankalp-gold font-bold scale-105'
            : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 font-medium'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Done</span>
      </button>
    </nav>
  );
};
