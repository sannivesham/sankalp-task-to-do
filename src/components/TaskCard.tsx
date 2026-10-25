import React from 'react';
import type { Task } from '../types/task';
import {
  isTaskOverdue,
  isTaskDueToday,
  isTaskDueSoon,
  formatDeadlineDisplay,
  getRelativeTimeStatus,
  formatTime12h,
} from '../utils/dateUtils';
import {
  Check,
  Calendar,
  Clock,
  Bell,
  AlertCircle,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const overdue = isTaskOverdue(task.deadlineDate, task.deadlineTime, task.completed);
  const dueToday = isTaskDueToday(task.deadlineDate);
  const dueSoon = isTaskDueSoon(task.deadlineDate, task.deadlineTime, task.completed);
  const deadlineInfo = formatDeadlineDisplay(task.deadlineDate, task.deadlineTime);
  const relativeStatus = !task.completed ? getRelativeTimeStatus(task.deadlineDate, task.deadlineTime) : '';

  // Priority Styles
  const priorityBadgeConfig = {
    high: {
      label: 'High',
      bg: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800/60',
      dot: 'bg-red-600',
    },
    medium: {
      label: 'Med',
      bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      dot: 'bg-sankalp-gold',
    },
    low: {
      label: 'Low',
      bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
    },
  }[task.priority];

  return (
    <article
      className={`group relative rounded-2xl border transition-all duration-200 p-3.5 sm:p-4 ${
        task.completed
          ? 'bg-white/40 dark:bg-sankalp-dark-surface/40 border-sankalp-rose/30 dark:border-sankalp-dark-border opacity-70 hover:opacity-100'
          : overdue
          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 shadow-xs hover:shadow-md'
          : dueToday
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/50 shadow-xs hover:shadow-md'
          : 'bg-white/80 dark:bg-sankalp-dark-surface border-sankalp-rose/50 dark:border-sankalp-dark-border shadow-xs hover:shadow-md hover:border-sankalp-burgundy/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Trigger */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as completed`}
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold ${
            task.completed
              ? 'bg-gradient-to-br from-sankalp-burgundy to-sankalp-maroon border-sankalp-burgundy text-sankalp-gold shadow-xs'
              : 'border-sankalp-maroon/30 dark:border-sankalp-rose/40 hover:border-sankalp-burgundy dark:hover:border-sankalp-gold bg-transparent'
          }`}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Task Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${priorityBadgeConfig.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityBadgeConfig.dot}`} />
              {priorityBadgeConfig.label}
            </span>

            {/* Overdue Badge */}
            {overdue && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200 border border-red-300 dark:border-red-700">
                <AlertCircle className="w-3 h-3" />
                Overdue ({relativeStatus})
              </span>
            )}

            {/* Due Today Badge */}
            {!overdue && dueToday && !task.completed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                <Clock className="w-3 h-3" />
                Due Today
              </span>
            )}

            {/* Due Soon Badge */}
            {!overdue && !dueToday && dueSoon && !task.completed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                <Clock className="w-3 h-3" />
                {relativeStatus}
              </span>
            )}

            {/* Reminder Badge if active */}
            {task.reminderDate && !task.completed && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon/80 dark:text-sankalp-rose/80 border border-sankalp-rose/40 dark:border-sankalp-dark-border"
                title={`Reminder set for ${task.reminderDate}${task.reminderTime ? ` at ${formatTime12h(task.reminderTime)}` : ''}`}
              >
                <Bell className="w-3 h-3 text-sankalp-gold" />
                <span className="hidden sm:inline">Reminder</span>
                {task.reminderTime && <span>{formatTime12h(task.reminderTime)}</span>}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug break-words transition-all ${
              task.completed
                ? 'line-through text-sankalp-maroon/50 dark:text-sankalp-rose/50'
                : 'text-sankalp-maroon dark:text-sankalp-ivory'
            }`}
          >
            {task.title}
          </h3>

          {/* Description Preview or Expanded */}
          {task.description && (
            <div className="mt-1 text-sm text-sankalp-maroon/70 dark:text-sankalp-rose/70">
              <p className={expanded ? 'whitespace-pre-line' : 'line-clamp-1'}>
                {task.description}
              </p>
              {task.description.length > 70 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-0.5 text-xs font-semibold text-sankalp-burgundy dark:text-sankalp-gold mt-0.5 hover:underline"
                >
                  {expanded ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Show more</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Metadata Footer: Deadline & Time */}
          <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-sankalp-maroon/60 dark:text-sankalp-rose/60">
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                overdue
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : dueToday
                  ? 'text-amber-700 dark:text-amber-400 font-semibold'
                  : ''
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Deadline: {deadlineInfo.label}</span>
            </span>

            {task.completed && task.completedAt && (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Done on {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-burgundy dark:hover:text-sankalp-gold hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sankalp-gold"
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
            aria-label={`Delete task "${task.title}"`}
            title="Delete task (Undo available)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
