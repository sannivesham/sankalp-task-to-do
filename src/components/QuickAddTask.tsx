import React, { useState } from 'react';
import type { Priority } from '../types/task';
import { getTodayString, getTomorrowString } from '../utils/dateUtils';
import { Plus, SlidersHorizontal, Calendar, ArrowRight } from 'lucide-react';

interface QuickAddTaskProps {
  onQuickAdd: (title: string, deadlineDate: string, priority: Priority) => void;
  onOpenDetailedModal: (initialTitle?: string) => void;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  onQuickAdd,
  onOpenDetailedModal,
}) => {
  const [title, setTitle] = useState('');
  const [dateChoice, setDateChoice] = useState<'today' | 'tomorrow'>('today');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deadlineDate = dateChoice === 'today' ? getTodayString() : getTomorrowString();
    onQuickAdd(title.trim(), deadlineDate, priority);
    setTitle('');
  };

  const cyclePriority = () => {
    if (priority === 'medium') setPriority('high');
    else if (priority === 'high') setPriority('low');
    else setPriority('medium');
  };

  const priorityColor = {
    high: 'text-red-600 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40',
    medium: 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40',
    low: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40',
  }[priority];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-sankalp-dark-surface p-2 sm:p-2.5 rounded-2xl border border-sankalp-rose/60 dark:border-sankalp-dark-border shadow-xs transition-all focus-within:border-sankalp-burgundy/50 dark:focus-within:border-sankalp-gold/50 focus-within:shadow-md"
    >
      <div className="flex items-center gap-2">
        {/* Left Plus Icon */}
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-burgundy dark:text-sankalp-gold shrink-0">
          <Plus className="w-4 h-4" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick add a new resolve / task (press Enter)..."
          className="flex-1 bg-transparent px-2.5 py-1.5 text-sm sm:text-base text-sankalp-maroon dark:text-sankalp-ivory placeholder-sankalp-maroon/40 dark:placeholder-sankalp-rose/40 focus:outline-none"
          maxLength={200}
        />

        {/* Quick Options */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Date Toggle */}
          <button
            type="button"
            onClick={() => setDateChoice(dateChoice === 'today' ? 'tomorrow' : 'today')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-sankalp-rose/40 dark:border-sankalp-dark-border text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-sankalp-rose/20 dark:hover:bg-sankalp-dark-surface2 transition-colors"
            title="Toggle between Today and Tomorrow"
          >
            <Calendar className="w-3.5 h-3.5 text-sankalp-gold" />
            <span className="capitalize">{dateChoice}</span>
          </button>

          {/* Priority Toggle Button */}
          <button
            type="button"
            onClick={cyclePriority}
            className={`hidden sm:inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold border transition-colors capitalize ${priorityColor}`}
            title="Click to toggle priority"
          >
            <span>{priority}</span>
          </button>

          {/* Detailed Modal Trigger */}
          <button
            type="button"
            onClick={() => onOpenDetailedModal(title)}
            className="flex items-center justify-center p-2 rounded-xl text-sankalp-maroon/70 dark:text-sankalp-rose/70 hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2 transition-colors border border-transparent hover:border-sankalp-rose/40"
            title="Open detailed task form (reminder, time, description)"
            aria-label="Open detailed task form"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-1 bg-gradient-to-r from-sankalp-burgundy to-sankalp-maroon text-sankalp-ivory disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 hover:brightness-110"
          >
            <span>Add</span>
            <ArrowRight className="w-3.5 h-3.5 text-sankalp-gold" />
          </button>
        </div>
      </div>
    </form>
  );
};
