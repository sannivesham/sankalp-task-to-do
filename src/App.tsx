import { useState, useMemo, useRef } from 'react';
import type { ViewFilter, PriorityFilter, SortOption, Task, TaskFormData } from './types/task';
import { useTasks } from './hooks/useTasks';
import { useReminders } from './hooks/useReminders';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './context/ThemeContext';
import { getNotificationStatus } from './utils/notifications';
import { parseDateTime, isTaskOverdue, isTaskDueToday, isTaskUpcoming } from './utils/dateUtils';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickAddTask } from './components/QuickAddTask';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { ReminderBanner } from './components/ReminderBanner';
import { UndoToast } from './components/UndoToast';
import { BackupModal } from './components/BackupModal';
import { NotificationModal } from './components/NotificationModal';
import { ShortcutsModal } from './components/ShortcutsModal';

// Icons
import {
  ListTodo,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export function App() {
  // Navigation & Filtering States
  const [currentView, setCurrentView] = useState<ViewFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadline');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & UI States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalInitialTitle, setModalInitialTitle] = useState('');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Notification Permission State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return getNotificationStatus().permission;
  });

  // Reference for focusing search input
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Theme Context
  const { toggleTheme } = useTheme();

  // Tasks CRUD Hook
  const {
    tasks,
    stats,
    undoItem,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    dismissUndo,
    clearCompleted,
    clearAllTasks,
    importTasks,
    markReminderTriggered,
    snoozeReminder,
  } = useTasks();

  // Reminders Watcher Hook
  const { activeAlerts, dismissAlert } = useReminders({
    tasks,
    markReminderTriggered,
  });

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onNewTask: () => {
      setEditingTask(null);
      setModalInitialTitle('');
      setIsTaskModalOpen(true);
    },
    onFocusSearch: () => {
      searchInputRef.current?.focus();
    },
    onCloseModals: () => {
      setIsTaskModalOpen(false);
      setIsBackupModalOpen(false);
      setIsNotificationModalOpen(false);
      setIsShortcutsModalOpen(false);
    },
    onToggleTheme: () => {
      toggleTheme();
    },
  });

  // Filter and Sort Tasks
  const displayedTasks = useMemo(() => {
    let filtered = [...tasks];

    // 1. View Filter
    if (currentView === 'all') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (currentView === 'today') {
      filtered = filtered.filter(
        (t) => !t.completed && (isTaskDueToday(t.deadlineDate) || isTaskOverdue(t.deadlineDate, t.deadlineTime, t.completed))
      );
    } else if (currentView === 'upcoming') {
      filtered = filtered.filter((t) => !t.completed && isTaskUpcoming(t.deadlineDate));
    } else if (currentView === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    // 2. Priority Filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    // 3. Search Query Filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // 4. Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'deadline') {
        const dtA = parseDateTime(a.deadlineDate, a.deadlineTime).getTime();
        const dtB = parseDateTime(b.deadlineDate, b.deadlineTime).getTime();
        return dtA - dtB;
      }
      if (sortBy === 'priority') {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }, [tasks, currentView, priorityFilter, searchQuery, sortBy]);

  // View Metadata for Main Header
  const viewMeta = {
    all: {
      title: 'All Active Resolves',
      subtitle: 'Every commitment and task requiring your focus.',
      icon: ListTodo,
    },
    today: {
      title: 'Today’s Resolve',
      subtitle: 'Promises scheduled for today, plus any overdue items.',
      icon: CalendarCheck2,
    },
    upcoming: {
      title: 'Upcoming Milestones',
      subtitle: 'Future tasks to stay ahead and prepared.',
      icon: CalendarDays,
    },
    completed: {
      title: 'Completed Resolves',
      subtitle: 'Promises kept and fulfilled. Honor your progress.',
      icon: CheckCircle2,
    },
  }[currentView];

  const ViewIcon = viewMeta.icon;

  // Handlers
  const handleOpenDetailedModal = (initialTitle = '') => {
    setEditingTask(null);
    setModalInitialTitle(initialTitle);
    setIsTaskModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setModalInitialTitle('');
    setIsTaskModalOpen(true);
  };

  const handleModalSubmit = (data: TaskFormData) => {
    if (editingTask) {
      editTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-sankalp-ivory dark:bg-sankalp-dark text-sankalp-maroon dark:text-sankalp-ivory transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        priorityFilter={priorityFilter}
        onSelectPriority={setPriorityFilter}
        stats={stats}
        notificationPermission={notificationPermission}
        onOpenNotificationsModal={() => setIsNotificationModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      {/* Mobile Top Header */}
      <Header
        currentView={currentView}
        stats={stats}
        notificationPermission={notificationPermission}
        onOpenNewTask={() => handleOpenDetailedModal()}
        onOpenNotificationsModal={() => setIsNotificationModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 min-w-0">
        {/* Main View Banner / Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-sankalp-burgundy/10 dark:bg-sankalp-burgundy/30 text-sankalp-burgundy dark:text-sankalp-gold">
                <ViewIcon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-sankalp-maroon dark:text-sankalp-ivory">
                {viewMeta.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-sankalp-maroon/70 dark:text-sankalp-rose/70 mt-1">
              {viewMeta.subtitle}
            </p>
          </div>

          {/* Desktop Prominent Add Task Button */}
          <button
            onClick={() => handleOpenDetailedModal()}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sankalp-burgundy to-sankalp-maroon text-sankalp-ivory font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sankalp-gold shrink-0"
          >
            <Plus className="w-4 h-4 text-sankalp-gold stroke-[3]" />
            <span>New Task (N)</span>
          </button>
        </div>

        {/* Quick Add Bar (only on active views) */}
        {currentView !== 'completed' && (
          <div className="my-3">
            <QuickAddTask
              onQuickAdd={(title, deadlineDate, priority) =>
                addTask({ title, deadlineDate, priority })
              }
              onOpenDetailedModal={handleOpenDetailedModal}
            />
          </div>
        )}

        {/* Search & Filter Bar */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchInputRef={searchInputRef}
        />

        {/* Active Task Count & Tagline Reminder */}
        <div className="flex items-center justify-between text-xs text-sankalp-maroon/60 dark:text-sankalp-rose/60 px-1 py-1">
          <span>
            Showing {displayedTasks.length} {displayedTasks.length === 1 ? 'task' : 'tasks'}
            {priorityFilter !== 'all' && ` • Filtered by ${priorityFilter} priority`}
            {searchQuery && ` • Matching "${searchQuery}"`}
          </span>

          <span className="hidden sm:inline font-medium text-sankalp-maroon/40 dark:text-sankalp-rose/40 italic">
            "Make a plan. Keep your promise. Get it done."
          </span>
        </div>

        {/* Task List */}
        <TaskList
          tasks={displayedTasks}
          currentView={currentView}
          searchQuery={searchQuery}
          onToggle={toggleTask}
          onEdit={handleEditClick}
          onDelete={deleteTask}
          onOpenNewTask={() => handleOpenDetailedModal()}
          onClearSearch={() => {
            setSearchQuery('');
            setPriorityFilter('all');
          }}
          onClearCompleted={clearCompleted}
        />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenNewTask={() => handleOpenDetailedModal()}
        stats={stats}
      />

      {/* Modals & Overlays */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingTask={editingTask}
        initialTitle={modalInitialTitle}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        tasks={tasks}
        onImport={importTasks}
        onClearAll={clearAllTasks}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onPermissionChange={setNotificationPermission}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* In-App Reminder Alerts Popup */}
      <ReminderBanner
        alerts={activeAlerts}
        onDismiss={dismissAlert}
        onSnooze={snoozeReminder}
        onComplete={toggleTask}
      />

      {/* Undo Toast */}
      <UndoToast
        undoItem={undoItem}
        onUndo={() => {
          undoItem?.action();
          dismissUndo();
        }}
        onDismiss={dismissUndo}
      />
    </div>
  );
}

export default App;
