import React, { useState, useEffect, useRef } from 'react';
import type { Task, TaskFormData, Priority } from '../types/task';
import { getTodayString, getTomorrowString, parseDateTime } from '../utils/dateUtils';
import { X, Calendar, Clock, Bell, Sparkles, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  editingTask?: Task | null;
  initialTitle?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  initialTitle = '',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or reset form state
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || '');
        setDeadlineDate(editingTask.deadlineDate);
        setDeadlineTime(editingTask.deadlineTime || '');
        if (editingTask.reminderDate) {
          setEnableReminder(true);
          setReminderDate(editingTask.reminderDate);
          setReminderTime(editingTask.reminderTime || '');
        } else {
          setEnableReminder(false);
          setReminderDate('');
          setReminderTime('');
        }
        setPriority(editingTask.priority);
      } else {
        setTitle(initialTitle || '');
        setDescription('');
        setDeadlineDate(getTodayString());
        setDeadlineTime('');
        setEnableReminder(false);
        setReminderDate(getTodayString());
        setReminderTime('09:00');
        setPriority('medium');
      }
      setError(null);

      // Autofocus title after modal opens
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, editingTask, initialTitle]);

  if (!isOpen) return null;

  // Quick Deadline Presets
  const handleSetDeadlinePreset = (preset: 'today' | 'tomorrow' | 'weekend') => {
    if (preset === 'today') {
      setDeadlineDate(getTodayString());
    } else if (preset === 'tomorrow') {
      setDeadlineDate(getTomorrowString());
    } else if (preset === 'weekend') {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 is Sun, 6 is Sat
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
      const saturday = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
      const year = saturday.getFullYear();
      const month = String(saturday.getMonth() + 1).padStart(2, '0');
      const day = String(saturday.getDate()).padStart(2, '0');
      setDeadlineDate(`${year}-${month}-${day}`);
    }
  };

  // Quick Reminder Presets
  const applyReminderPreset = (preset: '1h_before' | 'morning_of') => {
    if (!deadlineDate) return;
    setEnableReminder(true);

    if (preset === 'morning_of') {
      setReminderDate(deadlineDate);
      setReminderTime('09:00');
    } else if (preset === '1h_before') {
      setReminderDate(deadlineDate);
      if (deadlineTime) {
        const [h, m] = deadlineTime.split(':').map(Number);
        const remH = Math.max(0, h - 1);
        setReminderTime(`${String(remH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      } else {
        setReminderTime('17:00');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task title or resolve.');
      titleInputRef.current?.focus();
      return;
    }

    // Validate deadline date
    if (!deadlineDate) {
      setError('Please select a deadline date.');
      return;
    }

    // Validate reminder datetime vs deadline datetime
    if (enableReminder) {
      if (!reminderDate) {
        setError('Please choose a reminder date or disable the reminder.');
        return;
      }

      const reminderDt = parseDateTime(reminderDate, reminderTime);
      const deadlineDt = parseDateTime(deadlineDate, deadlineTime);

      if (reminderDt.getTime() > deadlineDt.getTime()) {
        setError('Reminder cannot be set after the deadline.');
        return;
      }
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      deadlineDate,
      deadlineTime: deadlineTime || undefined,
      reminderDate: enableReminder ? reminderDate || undefined : undefined,
      reminderTime: enableReminder ? reminderTime || undefined : undefined,
      priority,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-sankalp-dark-surface rounded-3xl shadow-2xl border border-sankalp-rose/50 dark:border-sankalp-dark-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sankalp-rose/30 dark:border-sankalp-dark-border bg-gradient-to-r from-sankalp-rose/20 to-transparent dark:from-sankalp-dark-surface2/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sankalp-burgundy/10 dark:bg-sankalp-burgundy/30 flex items-center justify-center text-sankalp-burgundy dark:text-sankalp-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2
              id="task-modal-title"
              className="text-lg font-bold text-sankalp-maroon dark:text-sankalp-ivory"
            >
              {editingTask ? 'Edit Resolve / Task' : 'Create New Resolve'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-burgundy dark:hover:text-sankalp-ivory hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-bold uppercase tracking-wider text-sankalp-maroon/70 dark:text-sankalp-rose/70 mb-1.5"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Submit quarterly tax filing or finish study notes"
              maxLength={200}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory placeholder-sankalp-maroon/40 dark:placeholder-sankalp-rose/40 text-sm focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-bold uppercase tracking-wider text-sankalp-maroon/70 dark:text-sankalp-rose/70 mb-1.5"
            >
              Description <span className="text-xs font-normal lowercase text-sankalp-maroon/50 dark:text-sankalp-rose/50">(optional)</span>
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, checklists, or steps to fulfill your commitment..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory placeholder-sankalp-maroon/40 dark:placeholder-sankalp-rose/40 text-sm focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50 resize-y"
            />
          </div>

          {/* Deadline Row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-deadline-date"
                className="block text-xs font-bold uppercase tracking-wider text-sankalp-maroon/70 dark:text-sankalp-rose/70"
              >
                Deadline Date & Time <span className="text-red-500">*</span>
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSetDeadlinePreset('today')}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-sankalp-rose/50"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleSetDeadlinePreset('tomorrow')}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-sankalp-rose/50"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleSetDeadlinePreset('weekend')}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-sankalp-rose/50"
                >
                  Weekend
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sankalp-maroon/50 dark:text-sankalp-rose/50">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  id="task-deadline-date"
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory text-sm focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50 cursor-pointer"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sankalp-maroon/50 dark:text-sankalp-rose/50">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  placeholder="Optional time"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory text-sm focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reminder Toggle & Settings */}
          <div className="p-3.5 rounded-2xl bg-sankalp-rose/20 dark:bg-sankalp-dark-surface2/60 border border-sankalp-rose/40 dark:border-sankalp-dark-border">
            <div className="flex items-center justify-between">
              <label htmlFor="enable-reminder-toggle" className="flex items-center gap-2 cursor-pointer select-none">
                <Bell className="w-4 h-4 text-sankalp-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-sankalp-maroon dark:text-sankalp-ivory">
                  Configure Reminder Alert
                </span>
              </label>
              <input
                id="enable-reminder-toggle"
                type="checkbox"
                checked={enableReminder}
                onChange={(e) => {
                  setEnableReminder(e.target.checked);
                  if (e.target.checked && !reminderDate) {
                    setReminderDate(deadlineDate || getTodayString());
                    setReminderTime('09:00');
                  }
                }}
                className="w-4 h-4 text-sankalp-burgundy rounded focus:ring-sankalp-gold cursor-pointer"
              />
            </div>

            {enableReminder && (
              <div className="mt-3 space-y-2 pt-2 border-t border-sankalp-rose/30 dark:border-sankalp-dark-border">
                {/* Reminder presets */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-sankalp-maroon/60 dark:text-sankalp-rose/60 text-[11px]">Quick:</span>
                  <button
                    type="button"
                    onClick={() => applyReminderPreset('morning_of')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-sankalp-dark border border-sankalp-rose/50 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-rose hover:bg-sankalp-rose/20"
                  >
                    9:00 AM due date
                  </button>
                  <button
                    type="button"
                    onClick={() => applyReminderPreset('1h_before')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-sankalp-dark border border-sankalp-rose/50 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-rose hover:bg-sankalp-rose/20"
                  >
                    1 hr before
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="relative">
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory text-xs focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50 cursor-pointer"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon dark:text-sankalp-ivory text-xs focus:outline-none focus:ring-2 focus:ring-sankalp-gold/50 cursor-pointer"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-sankalp-maroon/60 dark:text-sankalp-rose/60 pt-0.5">
                  Alerts chime in-app and send browser notifications when this tab is open.
                </p>
              </div>
            )}
          </div>

          {/* Priority Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sankalp-maroon/70 dark:text-sankalp-rose/70 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  low: isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-sankalp-dark border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
                  medium: isSelected
                    ? 'bg-sankalp-gold text-sankalp-maroon font-bold border-sankalp-gold'
                    : 'bg-white dark:bg-sankalp-dark border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-amber-50 dark:hover:bg-amber-950/30',
                  high: isSelected
                    ? 'bg-sankalp-burgundy text-white border-sankalp-burgundy'
                    : 'bg-white dark:bg-sankalp-dark border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-red-50 dark:hover:bg-red-950/30',
                }[p];

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${colors}`}
                  >
                    {p} Priority
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-sankalp-rose/30 dark:border-sankalp-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-sankalp-maroon/70 dark:text-sankalp-rose/70 hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sankalp-burgundy to-sankalp-maroon text-sankalp-ivory hover:brightness-110 shadow-md transition-all active:scale-95"
            >
              {editingTask ? 'Save Changes' : 'Confirm Resolve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
