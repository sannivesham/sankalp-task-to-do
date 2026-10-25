import React from 'react';
import type { ActiveReminderAlert } from '../hooks/useReminders';
import { Bell, Clock, CheckCircle2, X } from 'lucide-react';

interface ReminderBannerProps {
  alerts: ActiveReminderAlert[];
  onDismiss: (taskId: string) => void;
  onSnooze: (taskId: string, minutes: number) => void;
  onComplete: (taskId: string) => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({
  alerts,
  onDismiss,
  onSnooze,
  onComplete,
}) => {
  if (alerts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="assertive"
    >
      {alerts.map(({ task }) => (
        <div
          key={task.id}
          className="pointer-events-auto bg-white/95 dark:bg-sankalp-dark-surface/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-sankalp-gold/60 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sankalp-gold/20 text-sankalp-gold flex items-center justify-center shrink-0 animate-bounce">
              <Bell className="w-4 h-4 fill-sankalp-gold" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sankalp-burgundy dark:text-sankalp-gold">
                  Reminder Alert
                </span>
                <button
                  type="button"
                  onClick={() => onDismiss(task.id)}
                  className="text-sankalp-maroon/50 dark:text-sankalp-rose/50 hover:text-sankalp-maroon p-0.5"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-sankalp-maroon dark:text-sankalp-ivory leading-tight mt-0.5 break-words">
                {task.title}
              </h4>

              {task.description && (
                <p className="text-xs text-sankalp-maroon/70 dark:text-sankalp-rose/70 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-sankalp-rose/30 dark:border-sankalp-dark-border">
                <button
                  type="button"
                  onClick={() => {
                    onComplete(task.id);
                    onDismiss(task.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mark Done</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSnooze(task.id, 10);
                    onDismiss(task.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon dark:text-sankalp-rose hover:bg-sankalp-rose/50 transition-colors"
                >
                  <Clock className="w-3 h-3" />
                  <span>Snooze 10m</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSnooze(task.id, 60);
                    onDismiss(task.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon dark:text-sankalp-rose hover:bg-sankalp-rose/50 transition-colors"
                >
                  <Clock className="w-3 h-3" />
                  <span>1h</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
