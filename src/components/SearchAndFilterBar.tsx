import React from 'react';
import type { PriorityFilter, SortOption } from '../types/task';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  searchInputRef,
}) => {
  const priorities: { id: PriorityFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sankalp-maroon/40 dark:text-sankalp-rose/40">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resolves and tasks... (Press /)"
          className="w-full bg-white/70 dark:bg-sankalp-dark-surface pl-9 pr-9 py-2 rounded-xl text-sm border border-sankalp-rose/50 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory placeholder-sankalp-maroon/40 dark:placeholder-sankalp-rose/40 focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sankalp-maroon/50 dark:text-sankalp-rose/50 hover:text-sankalp-burgundy"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Controls: Priority Pills & Sort Dropdown */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {/* Priority Filter */}
        <div className="flex items-center p-1 rounded-xl bg-sankalp-rose/30 dark:bg-sankalp-dark-surface border border-sankalp-rose/40 dark:border-sankalp-dark-border text-xs shrink-0">
          <span className="px-1.5 text-sankalp-maroon/50 dark:text-sankalp-rose/50 hidden lg:inline">
            <Filter className="w-3 h-3" />
          </span>
          {priorities.map((p) => {
            const isActive = priorityFilter === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPriorityChange(p.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-sankalp-burgundy text-sankalp-ivory shadow-xs font-bold'
                    : 'text-sankalp-maroon/70 dark:text-sankalp-rose/70 hover:text-sankalp-maroon dark:hover:text-sankalp-ivory'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-sankalp-dark-surface border border-sankalp-rose/50 dark:border-sankalp-dark-border text-xs text-sankalp-maroon dark:text-sankalp-ivory font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-sankalp-gold shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs text-sankalp-maroon dark:text-sankalp-ivory font-medium focus:outline-none cursor-pointer pr-1"
              aria-label="Sort tasks by"
            >
              <option value="deadline" className="bg-white dark:bg-sankalp-dark text-sankalp-maroon dark:text-sankalp-ivory">
                Sort: Deadline
              </option>
              <option value="priority" className="bg-white dark:bg-sankalp-dark text-sankalp-maroon dark:text-sankalp-ivory">
                Sort: Priority
              </option>
              <option value="created" className="bg-white dark:bg-sankalp-dark text-sankalp-maroon dark:text-sankalp-ivory">
                Sort: Created Date
              </option>
              <option value="title" className="bg-white dark:bg-sankalp-dark text-sankalp-maroon dark:text-sankalp-ivory">
                Sort: Title (A-Z)
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
