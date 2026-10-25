/**
 * Date and time utilities for Sankalp Task To Do
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns tomorrow's date formatted as YYYY-MM-DD in local time
 */
export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD and optional HH:mm into a JavaScript Date object in local time
 */
export function parseDateTime(dateStr: string, timeStr?: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  let hours = 23;
  let minutes = 59;
  let seconds = 59;

  if (timeStr && timeStr.trim().length > 0) {
    const [h, m] = timeStr.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      hours = h;
      minutes = m;
      seconds = 0;
    }
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Checks whether a task is overdue
 */
export function isTaskOverdue(deadlineDate: string, deadlineTime?: string, completed = false): boolean {
  if (completed) return false;
  if (!deadlineDate) return false;

  const now = new Date();
  const deadline = parseDateTime(deadlineDate, deadlineTime);

  // If time is not specified, it's overdue only after the day ends (23:59:59)
  return now.getTime() > deadline.getTime();
}

/**
 * Checks whether a task is due today
 */
export function isTaskDueToday(deadlineDate: string): boolean {
  if (!deadlineDate) return false;
  const todayStr = getTodayString();
  return deadlineDate === todayStr;
}

/**
 * Checks whether a task is upcoming (tomorrow onwards)
 */
export function isTaskUpcoming(deadlineDate: string): boolean {
  if (!deadlineDate) return false;
  const todayStr = getTodayString();
  return deadlineDate > todayStr;
}

/**
 * Checks whether a task is due soon (within the next 24 hours and not overdue)
 */
export function isTaskDueSoon(deadlineDate: string, deadlineTime?: string, completed = false): boolean {
  if (completed) return false;
  if (!deadlineDate) return false;

  const now = new Date();
  const deadline = parseDateTime(deadlineDate, deadlineTime);
  const diffMs = deadline.getTime() - now.getTime();

  // Due within next 24 hours (86,400,000 ms) and not overdue
  return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
}

/**
 * Formats a 24h time string (HH:mm) into human-readable 12h format (e.g. 5:00 PM)
 */
export function formatTime12h(timeStr?: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;

  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minutePadded = String(m).padStart(2, '0');
  return `${hour12}:${minutePadded} ${period}`;
}

/**
 * Formats deadline date and optional time into a friendly display string
 */
export function formatDeadlineDisplay(dateStr: string, timeStr?: string): {
  label: string;
  isToday: boolean;
  isTomorrow: boolean;
  isYesterday: boolean;
} {
  const todayStr = getTodayString();
  const tomorrowStr = getTomorrowString();

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yYear = yesterdayDate.getFullYear();
  const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

  const timePart = timeStr ? ` at ${formatTime12h(timeStr)}` : '';

  if (dateStr === todayStr) {
    return { label: `Today${timePart}`, isToday: true, isTomorrow: false, isYesterday: false };
  }
  if (dateStr === tomorrowStr) {
    return { label: `Tomorrow${timePart}`, isToday: false, isTomorrow: true, isYesterday: false };
  }
  if (dateStr === yesterdayStr) {
    return { label: `Yesterday${timePart}`, isToday: false, isTomorrow: false, isYesterday: true };
  }

  // Full date display
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  };
  const formattedDate = dateObj.toLocaleDateString(undefined, options);

  return {
    label: `${formattedDate}${timePart}`,
    isToday: false,
    isTomorrow: false,
    isYesterday: false,
  };
}

/**
 * Returns a human friendly difference from now (e.g., "in 2 hours", "3 hours ago", "in 2 days")
 */
export function getRelativeTimeStatus(dateStr: string, timeStr?: string): string {
  const now = new Date();
  const deadline = parseDateTime(dateStr, timeStr);
  const diffMs = deadline.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const diffMinutes = Math.floor(absDiff / (1000 * 60));
  const diffHours = Math.floor(absDiff / (1000 * 60 * 60));
  const diffDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    if (diffMinutes <= 1) return isPast ? 'Just now' : 'Due in 1 min';
    return isPast ? `${diffMinutes} mins ago` : `Due in ${diffMinutes} mins`;
  }
  if (diffHours < 24) {
    return isPast ? `${diffHours}h ago` : `Due in ${diffHours}h`;
  }
  if (diffDays === 1) {
    return isPast ? '1 day overdue' : 'Due tomorrow';
  }
  return isPast ? `${diffDays} days overdue` : `Due in ${diffDays} days`;
}
