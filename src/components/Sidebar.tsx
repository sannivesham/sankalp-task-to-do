import React from 'react';
import type { ViewFilter, PriorityFilter, TaskStats } from '../types/task';
import { Logo } from './Logo';
import { TaskCompletionSummary } from './TaskCompletionSummary';
import { useTheme } from '../context/ThemeContext';
import {
  ListTodo,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Bell,
  HardDriveDownload,
  Sun,
  Moon,
  Laptop,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewFilter;
  onSelectView: (view: ViewFilter) => void;
  priorityFilter: PriorityFilter;
  onSelectPriority: (priority: PriorityFilter) => void;
  stats: TaskStats;
  notificationPermission: NotificationPermission;
  onOpenNotificationsModal: () => void;
  onOpenBackupModal: () => void;
  onOpenShortcutsModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  priorityFilter,
  onSelectPriority,
  stats,
  notificationPermission,
  onOpenNotificationsModal,
  onOpenBackupModal,
  onOpenShortcutsModal,
}) => {
  const { theme, setTheme } = useTheme();

  const navItems = [
    {
      id: 'all' as ViewFilter,
      label: 'All Tasks',
      icon: ListTodo,
      count: stats.active,
      badgeColor: 'bg-sankalp-burgundy/10 text-sankalp-burgundy dark:bg-sankalp-burgundy/30 dark:text-sankalp-rose',
    },
    {
      id: 'today' as ViewFilter,
      label: 'Today',
      icon: CalendarCheck2,
      count: stats.dueToday,
      overdueCount: stats.overdue,
      badgeColor: 'bg-sankalp-gold/20 text-sankalp-maroon dark:text-sankalp-gold',
    },
    {
      id: 'upcoming' as ViewFilter,
      label: 'Upcoming',
      icon: CalendarDays,
      count: stats.upcoming,
      badgeColor: 'bg-sankalp-rose/40 text-sankalp-maroon dark:bg-sankalp-dark-surface2 dark:text-sankalp-rose',
    },
    {
      id: 'completed' as ViewFilter,
      label: 'Completed',
      icon: CheckCircle2,
      count: stats.completed,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
  ];

  const priorities: { id: PriorityFilter; label: string; color: string }[] = [
    { id: 'all', label: 'All Priorities', color: 'bg-gray-400' },
    { id: 'high', label: 'High Priority', color: 'bg-sankalp-burgundy' },
    { id: 'medium', label: 'Medium Priority', color: 'bg-sankalp-gold' },
    { id: 'low', label: 'Low Priority', color: 'bg-emerald-600' },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-72 lg:w-80 h-screen sticky top-0 bg-white/70 dark:bg-sankalp-dark-surface/90 backdrop-blur-md border-r border-sankalp-rose/40 dark:border-sankalp-dark-border p-5 z-20 shrink-0 select-none overflow-y-auto"
      aria-label="Application Sidebar"
    >
      {/* Brand Header */}
      <div className="pb-5 border-b border-sankalp-rose/40 dark:border-sankalp-dark-border">
        <Logo size="md" />
      </div>

      {/* Main Views Navigation */}
      <nav className="my-5 flex-1 space-y-1">
        <p className="px-3 text-xs font-semibold tracking-wider uppercase text-sankalp-maroon/50 dark:text-sankalp-rose/50 mb-2">
          Views
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold ${
                isActive
                  ? 'bg-gradient-to-r from-sankalp-burgundy to-sankalp-maroon text-sankalp-ivory shadow-sm font-semibold'
                  : 'text-sankalp-maroon/80 dark:text-sankalp-ivory/80 hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-sankalp-gold' : 'text-sankalp-burgundy dark:text-sankalp-gold'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.overdueCount !== undefined && item.overdueCount > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${
                      isActive ? 'bg-red-500/80 text-white' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    }`}
                    title={`${item.overdueCount} overdue`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    {item.overdueCount}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.count}
                </span>
              </div>
            </button>
          );
        })}

        {/* Priority Filter Subsection */}
        <div className="pt-5 mt-4 border-t border-sankalp-rose/30 dark:border-sankalp-dark-border">
          <p className="px-3 text-xs font-semibold tracking-wider uppercase text-sankalp-maroon/50 dark:text-sankalp-rose/50 mb-2">
            Priority Filter
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {priorities.map((p) => {
              const isSelected = priorityFilter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPriority(p.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sankalp-gold ${
                    isSelected
                      ? 'bg-sankalp-rose/50 dark:bg-sankalp-dark-surface2 border-sankalp-burgundy/40 dark:border-sankalp-gold/50 text-sankalp-maroon dark:text-sankalp-ivory font-bold'
                      : 'border-transparent text-sankalp-maroon/70 dark:text-sankalp-rose/70 hover:bg-sankalp-rose/20 dark:hover:bg-sankalp-dark-surface2'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.color}`} />
                  <span className="truncate">{p.label.replace(' Priority', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Summary Card */}
        <div className="pt-4">
          <TaskCompletionSummary stats={stats} />
        </div>
      </nav>

      {/* Footer Controls & Utilities */}
      <div className="pt-4 border-t border-sankalp-rose/40 dark:border-sankalp-dark-border space-y-3">
        {/* Action Buttons: Notifications & Backup */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotificationsModal}
            title={
              notificationPermission === 'granted'
                ? 'Notifications Enabled (Click for info)'
                : 'Configure Browser Reminders'
            }
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold ${
              notificationPermission === 'granted'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white/60 dark:bg-sankalp-dark-surface text-sankalp-maroon dark:text-sankalp-rose border-sankalp-rose/50 dark:border-sankalp-dark-border hover:bg-sankalp-rose/20'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-sankalp-gold" />
            <span>{notificationPermission === 'granted' ? 'Alerts On' : 'Reminders'}</span>
          </button>

          <button
            onClick={onOpenBackupModal}
            title="Backup & Restore Tasks (JSON)"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-sankalp-rose/50 dark:border-sankalp-dark-border bg-white/60 dark:bg-sankalp-dark-surface text-sankalp-maroon dark:text-sankalp-rose hover:bg-sankalp-rose/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-sankalp-burgundy dark:text-sankalp-rose" />
            <span>Backup</span>
          </button>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center justify-between p-1 rounded-xl bg-sankalp-rose/30 dark:bg-sankalp-dark-surface border border-sankalp-rose/40 dark:border-sankalp-dark-border">
          <button
            onClick={() => setTheme('light')}
            aria-label="Light mode"
            className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'light'
                ? 'bg-white text-sankalp-burgundy shadow-xs font-bold'
                : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-maroon'
            }`}
          >
            <Sun className="w-3.5 h-3.5 mr-1" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            aria-label="Dark mode"
            className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'dark'
                ? 'bg-sankalp-burgundy text-sankalp-ivory shadow-xs font-bold'
                : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-ivory'
            }`}
          >
            <Moon className="w-3.5 h-3.5 mr-1" />
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            aria-label="System mode"
            className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'system'
                ? 'bg-white dark:bg-sankalp-dark-surface2 text-sankalp-gold shadow-xs font-bold'
                : 'text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-gold'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 mr-1" />
            Auto
          </button>
        </div>

        {/* Local Storage Transparency Notice */}
        <div className="flex items-start gap-1.5 px-2 text-[11px] text-sankalp-maroon/60 dark:text-sankalp-rose/60 leading-tight">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sankalp-gold" />
          <span>
            Data stored locally in this browser.
            <button
              onClick={onOpenShortcutsModal}
              className="ml-1 underline text-sankalp-burgundy dark:text-sankalp-gold hover:opacity-80"
            >
              Shortcuts (?)
            </button>
          </span>
        </div>
      </div>
    </aside>
  );
};
