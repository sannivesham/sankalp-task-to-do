export type Priority = 'low' | 'medium' | 'high';

export type ViewFilter = 'all' | 'today' | 'upcoming' | 'completed';

export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export type SortOption = 'deadline' | 'priority' | 'created' | 'title';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadlineDate: string; // YYYY-MM-DD format
  deadlineTime?: string; // HH:mm format (24h)
  reminderDate?: string; // YYYY-MM-DD format
  reminderTime?: string; // HH:mm format (24h)
  reminderTriggered?: boolean;
  reminderDismissed?: boolean;
  priority: Priority;
  completed: boolean;
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TaskFormData {
  title: string;
  description?: string;
  deadlineDate: string;
  deadlineTime?: string;
  reminderDate?: string;
  reminderTime?: string;
  priority: Priority;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  dueToday: number;
  upcoming: number;
  overdue: number;
  completionRate: number;
}

export interface ExportData {
  appName: string;
  version: number;
  exportedAt: string;
  tasks: Task[];
}
