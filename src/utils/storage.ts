import type { Task, ExportData } from '../types/task';
import { getTodayString, getTomorrowString } from './dateUtils';

const STORAGE_KEY = 'sankalp_tasks_v1';
const THEME_KEY = 'sankalp_theme';
const INITIALIZED_KEY = 'sankalp_initialized';

/**
 * Default sample tasks for a first-time visitor
 */
export function getInitialSampleTasks(): Task[] {
  const now = new Date();
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  return [
    {
      id: 'sample-1',
      title: 'Review today’s key priorities and set your resolve (Sankalp)',
      description: 'Choose 2-3 essential commitments for the day and honor them with focused discipline.',
      deadlineDate: today,
      deadlineTime: '18:00',
      reminderDate: today,
      reminderTime: '17:00',
      reminderTriggered: false,
      reminderDismissed: false,
      priority: 'high',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'sample-2',
      title: 'Submit the weekly project deliverables & summary',
      description: 'Organize completed milestones, review pending action items, and share with the team.',
      deadlineDate: today,
      deadlineTime: '17:00',
      reminderDate: today,
      reminderTime: '16:00',
      reminderTriggered: false,
      reminderDismissed: false,
      priority: 'medium',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'sample-3',
      title: 'Prepare discussion agenda for tomorrow’s morning briefing',
      description: 'Note down questions, blockers, and timelines before signing off.',
      deadlineDate: tomorrow,
      deadlineTime: '10:00',
      priority: 'low',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'sample-4',
      title: 'Welcome to Sankalp: click the checkmark to test task completion',
      description: 'Notice the completion feedback, satisfying chime, and progress update.',
      deadlineDate: today,
      priority: 'low',
      completed: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Loads tasks safely from localStorage
 */
export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];

  try {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (!isInitialized && !rawData) {
      // First visit: seed initial tasks and mark initialized
      const sampleTasks = getInitialSampleTasks();
      saveTasksToStorage(sampleTasks);
      localStorage.setItem(INITIALIZED_KEY, 'true');
      return sampleTasks;
    }

    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('Malformed tasks array in storage. Resetting to empty.');
      return [];
    }

    // Validate and sanitize each task
    return parsed.filter(isValidTaskObject).map(sanitizeTask);
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    return [];
  }
}

/**
 * Saves tasks to localStorage
 */
export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

/**
 * Type guard to validate a stored task object
 */
export function isValidTaskObject(obj: unknown): obj is Task {
  if (!obj || typeof obj !== 'object') return false;
  const t = obj as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    t.title.trim().length > 0 &&
    typeof t.deadlineDate === 'string' &&
    ['low', 'medium', 'high'].includes(String(t.priority)) &&
    typeof t.completed === 'boolean'
  );
}

/**
 * Ensures all fields of a task are well-formed
 */
export function sanitizeTask(t: Task): Task {
  return {
    id: String(t.id),
    title: String(t.title).trim(),
    description: t.description ? String(t.description).trim() : undefined,
    deadlineDate: String(t.deadlineDate),
    deadlineTime: t.deadlineTime ? String(t.deadlineTime) : undefined,
    reminderDate: t.reminderDate ? String(t.reminderDate) : undefined,
    reminderTime: t.reminderTime ? String(t.reminderTime) : undefined,
    reminderTriggered: Boolean(t.reminderTriggered),
    reminderDismissed: Boolean(t.reminderDismissed),
    priority: ['low', 'medium', 'high'].includes(t.priority) ? t.priority : 'medium',
    completed: Boolean(t.completed),
    completedAt: t.completedAt ? String(t.completedAt) : undefined,
    createdAt: t.createdAt ? String(t.createdAt) : new Date().toISOString(),
    updatedAt: t.updatedAt ? String(t.updatedAt) : new Date().toISOString(),
  };
}

/**
 * Generates an export payload for downloading as JSON
 */
export function generateExportData(tasks: Task[]): ExportData {
  return {
    appName: 'Sankalp Task To Do',
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
  };
}

/**
 * Validates imported JSON data
 */
export function validateImportData(jsonData: unknown): { valid: boolean; tasks: Task[]; error?: string } {
  if (!jsonData || typeof jsonData !== 'object') {
    return { valid: false, tasks: [], error: 'Invalid JSON format: root is not an object.' };
  }

  const data = jsonData as Record<string, unknown>;

  if (!Array.isArray(data.tasks)) {
    // If the user uploaded a raw array of tasks directly
    if (Array.isArray(jsonData)) {
      const validTasks = (jsonData as unknown[]).filter(isValidTaskObject).map(sanitizeTask);
      if (validTasks.length === 0) {
        return { valid: false, tasks: [], error: 'No valid tasks found in the uploaded file.' };
      }
      return { valid: true, tasks: validTasks };
    }
    return { valid: false, tasks: [], error: 'Missing "tasks" array in the backup file.' };
  }

  const validTasks = data.tasks.filter(isValidTaskObject).map(sanitizeTask);

  if (validTasks.length === 0 && data.tasks.length > 0) {
    return { valid: false, tasks: [], error: 'Uploaded tasks did not match the expected task format.' };
  }

  return { valid: true, tasks: validTasks };
}

/**
 * Clears all task data from storage
 */
export function clearAllStorageData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}

/**
 * Saves theme preference
 */
export function saveThemePreference(theme: 'light' | 'dark' | 'system'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}

/**
 * Loads theme preference
 */
export function loadThemePreference(): 'light' | 'dark' | 'system' {
  if (typeof window === 'undefined') return 'system';
  try {
    const val = localStorage.getItem(THEME_KEY);
    if (val === 'light' || val === 'dark' || val === 'system') return val;
    return 'system';
  } catch {
    return 'system';
  }
}
