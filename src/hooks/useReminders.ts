import { useState, useEffect, useRef } from 'react';
import type { Task } from '../types/task';
import { parseDateTime } from '../utils/dateUtils';
import { playReminderChime } from '../utils/audio';
import { sendBrowserNotification } from '../utils/notifications';

interface UseRemindersProps {
  tasks: Task[];
  markReminderTriggered: (id: string) => void;
}

export interface ActiveReminderAlert {
  task: Task;
  triggeredAt: Date;
}

export function useReminders({ tasks, markReminderTriggered }: UseRemindersProps) {
  const [activeAlerts, setActiveAlerts] = useState<ActiveReminderAlert[]>([]);
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      tasks.forEach((task) => {
        // Skip completed or already triggered/dismissed
        if (task.completed || task.reminderTriggered || task.reminderDismissed) return;
        if (!task.reminderDate) return;

        // Parse reminder datetime
        const reminderTarget = parseDateTime(task.reminderDate, task.reminderTime);

        // If target time has arrived (within the last 2 hours to avoid ancient stale triggers)
        const timeDiff = now.getTime() - reminderTarget.getTime();
        const isDue = timeDiff >= 0 && timeDiff < 2 * 60 * 60 * 1000;

        if (isDue && !processedRef.current.has(task.id)) {
          processedRef.current.add(task.id);
          markReminderTriggered(task.id);

          // Audio chime
          playReminderChime();

          // Native browser notification
          sendBrowserNotification(`Reminder: ${task.title}`, {
            body: task.description || `Deadline: ${task.deadlineDate}${task.deadlineTime ? ` at ${task.deadlineTime}` : ''}`,
            tag: `reminder-${task.id}`,
            requireInteraction: true,
          });

          // Add to in-app alerts
          setActiveAlerts((prev) => {
            if (prev.some((a) => a.task.id === task.id)) return prev;
            return [{ task, triggeredAt: now }, ...prev];
          });
        }
      });
    };

    // Run immediately, then every 10 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, [tasks, markReminderTriggered]);

  const dismissAlert = (taskId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.task.id !== taskId));
  };

  return {
    activeAlerts,
    dismissAlert,
  };
}
