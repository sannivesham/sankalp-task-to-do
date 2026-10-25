import React from 'react';
import { Logo } from './Logo';
import type { ViewFilter, TaskStats } from '../types/task';
import { useTheme } from '../context/ThemeContext';
import { Plus, Sun, Moon, HardDriveDownload, Bell, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentView: ViewFilter;
  stats: TaskStats;
  notificationPermission: NotificationPermission;
  onOpenNewTask: () => void;
  onOpenNotificationsModal: () => void;
  onOpenBackupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  notificationPermission,
  onOpenNewTask,
  onOpenNotificationsModal,
  onOpenBackupModal,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-sankalp-dark/95 backdrop-blur-md border-b border-sankalp-rose/40 dark:border-sankalp-dark-border px-4 py-3 flex items-center justify-between">
      {/* Brand & Overdue indicator */}
      <div className="flex items-center gap-2">
        <Logo size="sm" showTagline={false} />
        {stats.overdue > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300">
            <AlertTriangle className="w-2.5 h-2.5" />
            {stats.overdue}
          </span>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          onClick={onOpenNotificationsModal}
          className={`p-2 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold ${
            notificationPermission === 'granted'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-sankalp-rose/30 dark:bg-sankalp-dark-surface text-sankalp-maroon dark:text-sankalp-rose border-sankalp-rose/50 dark:border-sankalp-dark-border'
          }`}
          aria-label="Browser notifications settings"
          title="Notification Settings"
        >
          <Bell className="w-4 h-4 text-sankalp-gold" />
        </button>

        {/* Backup */}
        <button
          onClick={onOpenBackupModal}
          className="p-2 rounded-xl border border-sankalp-rose/50 dark:border-sankalp-dark-border bg-sankalp-rose/30 dark:bg-sankalp-dark-surface text-sankalp-maroon dark:text-sankalp-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold"
          aria-label="Backup and restore tasks"
          title="Backup & Restore"
        >
          <HardDriveDownload className="w-4 h-4 text-sankalp-burgundy dark:text-sankalp-rose" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-sankalp-rose/50 dark:border-sankalp-dark-border bg-sankalp-rose/30 dark:bg-sankalp-dark-surface text-sankalp-maroon dark:text-sankalp-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-sankalp-gold" /> : <Moon className="w-4 h-4 text-sankalp-burgundy" />}
        </button>

        {/* Add Task CTA */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1 bg-gradient-to-r from-sankalp-burgundy to-sankalp-maroon text-sankalp-ivory font-semibold text-xs px-3 py-2 rounded-xl shadow-xs active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold"
          aria-label="Create new task"
        >
          <Plus className="w-4 h-4 text-sankalp-gold" />
          <span>Add</span>
        </button>
      </div>
    </header>
  );
};
