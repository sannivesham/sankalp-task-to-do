import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Task, TaskFormData, TaskStats } from '../types/task';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';
import { isTaskOverdue, isTaskDueToday, isTaskUpcoming } from '../utils/dateUtils';
import { playCompletionSound } from '../utils/audio';
import confetti from 'canvas-confetti';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

export interface UndoItem {
  id: string;
  message: string;
  action: () => void;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [undoItem, setUndoItem] = useState<UndoItem | null>(null);

  // Sync to localStorage whenever tasks change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Auto-dismiss undo item after 6 seconds
  useEffect(() => {
    if (!undoItem) return;
    const timer = setTimeout(() => {
      setUndoItem(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [undoItem]);

  // Add Task
  const addTask = useCallback((data: TaskFormData): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      deadlineDate: data.deadlineDate,
      deadlineTime: data.deadlineTime || undefined,
      reminderDate: data.reminderDate || undefined,
      reminderTime: data.reminderTime || undefined,
      reminderTriggered: false,
      reminderDismissed: false,
      priority: data.priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // Quick Add (just title, defaults to today, medium priority)
  const quickAddTask = useCallback((title: string, deadlineDate: string): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      deadlineDate,
      priority: 'medium',
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // Edit Task
  const editTask = useCallback((id: string, data: Partial<TaskFormData>): void => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          title: data.title !== undefined ? data.title.trim() : t.title,
          description: data.description !== undefined ? data.description.trim() || undefined : t.description,
          deadlineDate: data.deadlineDate !== undefined ? data.deadlineDate : t.deadlineDate,
          deadlineTime: data.deadlineTime !== undefined ? data.deadlineTime || undefined : t.deadlineTime,
          reminderDate: data.reminderDate !== undefined ? data.reminderDate || undefined : t.reminderDate,
          reminderTime: data.reminderTime !== undefined ? data.reminderTime || undefined : t.reminderTime,
          // Reset reminder status if reminder datetime was changed
          reminderTriggered:
            data.reminderDate !== t.reminderDate || data.reminderTime !== t.reminderTime
              ? false
              : t.reminderTriggered,
          reminderDismissed:
            data.reminderDate !== t.reminderDate || data.reminderTime !== t.reminderTime
              ? false
              : t.reminderDismissed,
          priority: data.priority !== undefined ? data.priority : t.priority,
          updatedAt: now,
        };
      })
    );
  }, []);

  // Toggle Task Completion
  const toggleTask = useCallback((id: string): void => {
    let justCompleted = false;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const willBeCompleted = !t.completed;
        justCompleted = willBeCompleted;
        return {
          ...t,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (justCompleted) {
      // Audio chime
      playCompletionSound();

      // Gentle celebratory confetti if not reduced motion
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReducedMotion) {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#D2A33A', '#84234F', '#FAF6EF'],
          disableForReducedMotion: true,
        });
      }

      setUndoItem({
        id: generateId(),
        message: 'Task completed! Keep your promise.',
        action: () => {
          setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: false, completedAt: undefined } : t))
          );
        },
      });
    }
  }, []);

  // Delete Task with Undo
  const deleteTask = useCallback((id: string): void => {
    let deletedTask: Task | undefined;

    setTasks((prev) => {
      deletedTask = prev.find((t) => t.id === id);
      return prev.filter((t) => t.id !== id);
    });

    if (deletedTask) {
      const taskToRestore = deletedTask;
      setUndoItem({
        id: generateId(),
        message: `Deleted "${taskToRestore.title.slice(0, 24)}${taskToRestore.title.length > 24 ? '...' : ''}"`,
        action: () => {
          setTasks((prev) => [taskToRestore, ...prev]);
        },
      });
    }
  }, []);

  // Dismiss Undo manually
  const dismissUndo = useCallback(() => {
    setUndoItem(null);
  }, []);

  // Clear Completed Tasks
  const clearCompleted = useCallback(() => {
    const completedTasks: Task[] = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setTasks((prev) => prev.filter((t) => !t.completed));

    setUndoItem({
      id: generateId(),
      message: `Cleared ${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}`,
      action: () => {
        setTasks((prev) => [...prev, ...completedTasks]);
      },
    });
  }, [tasks]);

  // Clear All Tasks (hard reset)
  const clearAllTasks = useCallback(() => {
    const previous = [...tasks];
    setTasks([]);
    setUndoItem({
      id: generateId(),
      message: 'All tasks cleared',
      action: () => {
        setTasks(previous);
      },
    });
  }, [tasks]);

  // Import Tasks
  const importTasks = useCallback((importedTasks: Task[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setTasks(importedTasks);
    } else {
      // Merge: avoid duplicates by ID, or assign new ID if collision
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const merged = [...prev];
        importedTasks.forEach((t) => {
          if (existingIds.has(t.id)) {
            // Give a fresh ID
            merged.push({ ...t, id: generateId() });
          } else {
            merged.push(t);
          }
        });
        return merged;
      });
    }
  }, []);

  // Reminder status updates
  const markReminderTriggered = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, reminderTriggered: true } : t))
    );
  }, []);

  const dismissReminder = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, reminderDismissed: true } : t))
    );
  }, []);

  const snoozeReminder = useCallback((id: string, minutes: number) => {
    const now = new Date();
    const snoozedTime = new Date(now.getTime() + minutes * 60 * 1000);
    const sYear = snoozedTime.getFullYear();
    const sMonth = String(snoozedTime.getMonth() + 1).padStart(2, '0');
    const sDay = String(snoozedTime.getDate()).padStart(2, '0');
    const sHours = String(snoozedTime.getHours()).padStart(2, '0');
    const sMinutes = String(snoozedTime.getMinutes()).padStart(2, '0');

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              reminderDate: `${sYear}-${sMonth}-${sDay}`,
              reminderTime: `${sHours}:${sMinutes}`,
              reminderTriggered: false,
              reminderDismissed: false,
            }
          : t
      )
    );
  }, []);

  // Computed statistics
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;

    let dueToday = 0;
    let upcoming = 0;
    let overdue = 0;

    tasks.forEach((t) => {
      if (!t.completed) {
        if (isTaskOverdue(t.deadlineDate, t.deadlineTime, t.completed)) {
          overdue++;
        } else if (isTaskDueToday(t.deadlineDate)) {
          dueToday++;
        } else if (isTaskUpcoming(t.deadlineDate)) {
          upcoming++;
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      dueToday,
      upcoming,
      overdue,
      completionRate,
    };
  }, [tasks]);

  return {
    tasks,
    stats,
    undoItem,
    addTask,
    quickAddTask,
    editTask,
    toggleTask,
    deleteTask,
    dismissUndo,
    clearCompleted,
    clearAllTasks,
    importTasks,
    markReminderTriggered,
    dismissReminder,
    snoozeReminder,
  };
}
