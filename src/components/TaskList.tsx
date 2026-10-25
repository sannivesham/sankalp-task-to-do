import React from 'react';
import type { Task, ViewFilter } from '../types/task';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { isTaskOverdue } from '../utils/dateUtils';
import { AlertTriangle, CheckCheck, Sparkles } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  currentView: ViewFilter;
  searchQuery: string;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenNewTask: () => void;
  onClearSearch: () => void;
  onClearCompleted: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentView,
  searchQuery,
  onToggle,
  onEdit,
  onDelete,
  onOpenNewTask,
  onClearSearch,
  onClearCompleted,
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        currentView={currentView}
        hasSearchQuery={Boolean(searchQuery.trim())}
        onOpenNewTask={onOpenNewTask}
        onClearSearch={onClearSearch}
      />
    );
  }

  // When viewing "Today", group into Overdue and Today
  if (currentView === 'today') {
    const overdueTasks = tasks.filter((t) => !t.completed && isTaskOverdue(t.deadlineDate, t.deadlineTime, t.completed));
    const todayTasks = tasks.filter((t) => !overdueTasks.includes(t));

    return (
      <div className="space-y-6 my-4">
        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 bg-red-100/70 dark:bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 w-fit">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Overdue Resolves ({overdueTasks.length}) — Needs Attention</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* Due Today Section */}
        <section className="space-y-3">
          {overdueTasks.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 px-1">
              <Sparkles className="w-3.5 h-3.5 text-sankalp-gold" />
              <span>Due Today ({todayTasks.length})</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2.5">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Completed View: show clear button at top
  if (currentView === 'completed') {
    return (
      <div className="space-y-4 my-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-sankalp-maroon/60 dark:text-sankalp-rose/60">
            Completed promises are preserved here for your review and satisfaction.
          </p>
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-sankalp-rose/60 dark:border-sankalp-dark-border text-sankalp-maroon/80 dark:text-sankalp-rose/80 hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-sankalp-burgundy dark:text-sankalp-gold" />
            <span>Clear Completed</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  // All or Upcoming View
  return (
    <div className="grid grid-cols-1 gap-2.5 my-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
