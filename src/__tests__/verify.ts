import {
  parseDateTime,
  isTaskOverdue,
  isTaskDueToday,
  isTaskUpcoming,
  isTaskDueSoon,
  formatDeadlineDisplay,
  formatTime12h,
  getRelativeTimeStatus,
  getTodayString,
  getTomorrowString,
} from '../utils/dateUtils';

import {
  isValidTaskObject,
  sanitizeTask,
  generateExportData,
  validateImportData,
  getInitialSampleTasks,
} from '../utils/storage';

import type { Task } from '../types/task';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('--- RUNNING SANKALP TASK TO DO VERIFICATION SUITE ---');

// 1. DATE UTILITIES TESTS
console.log('\n[1] Date & Time Utilities Verification:');
const todayStr = getTodayString();
const tomorrowStr = getTomorrowString();

assert(isTaskDueToday(todayStr), 'getTodayString() returns a date that is recognized as today');
assert(!isTaskDueToday(tomorrowStr), 'Tomorrow is not recognized as today');
assert(isTaskUpcoming(tomorrowStr), 'Tomorrow is recognized as upcoming');
assert(!isTaskUpcoming(todayStr), 'Today is not recognized as upcoming');

// parseDateTime check
const parsedDt = parseDateTime('2026-10-25', '14:30');
assert(parsedDt.getHours() === 14 && parsedDt.getMinutes() === 30, 'parseDateTime parses date and time accurately');

// Overdue checks
assert(isTaskOverdue('2020-01-01', undefined, false), 'Past date is recognized as overdue');
assert(!isTaskOverdue('2020-01-01', undefined, true), 'Completed task is not marked overdue even if date is past');
assert(!isTaskOverdue(tomorrowStr, undefined, false), 'Tomorrow is not overdue');

// Time format tests
assert(formatTime12h('17:00') === '5:00 PM', '17:00 formats to 5:00 PM');
assert(formatTime12h('09:30') === '9:30 AM', '09:30 formats to 9:30 AM');
assert(formatTime12h('00:00') === '12:00 AM', '00:00 formats to 12:00 AM');
assert(formatTime12h('12:00') === '12:00 PM', '12:00 formats to 12:00 PM');

// Deadline display labels
const todayDisplay = formatDeadlineDisplay(todayStr, '18:00');
assert(todayDisplay.isToday, 'formatDeadlineDisplay marks today as isToday: true');
assert(todayDisplay.label === 'Today at 6:00 PM', `Label is "Today at 6:00 PM", got: "${todayDisplay.label}"`);

const tomorrowDisplay = formatDeadlineDisplay(tomorrowStr);
assert(tomorrowDisplay.isTomorrow, 'formatDeadlineDisplay marks tomorrow as isTomorrow: true');
assert(tomorrowDisplay.label === 'Tomorrow', `Label is "Tomorrow", got: "${tomorrowDisplay.label}"`);

// Relative time status
const relStatus = getRelativeTimeStatus('2020-01-01');
assert(relStatus.includes('overdue') || relStatus.includes('ago'), `Relative time status formatted correctly: "${relStatus}"`);

// Due soon checks
assert(isTaskDueSoon(todayStr, undefined, false), 'Active task for today is due soon');

// 2. STORAGE & SANITIZATION TESTS
console.log('\n[2] Storage & Sanitization Verification:');
const sampleTasks = getInitialSampleTasks();
assert(sampleTasks.length >= 3, `Initial sample tasks seeded (${sampleTasks.length} tasks)`);

// Valid task validation
const validTask: Task = {
  id: 'test-1',
  title: 'Meditate for 15 minutes',
  deadlineDate: todayStr,
  priority: 'high',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
assert(isValidTaskObject(validTask), 'Valid task object passes validation');

// Sanitize task test
const sanitized = sanitizeTask({
  ...validTask,
  title: '  Untrimmed Task Title  ',
  description: '  Untrimmed Description  ',
});
assert(sanitized.title === 'Untrimmed Task Title', 'sanitizeTask trims task title');
assert(sanitized.description === 'Untrimmed Description', 'sanitizeTask trims task description');

// Invalid task validation
assert(!isValidTaskObject({}), 'Empty object fails validation');
assert(!isValidTaskObject({ id: '1', title: '' }), 'Empty title fails validation');
assert(!isValidTaskObject({ id: '1', title: 'Test', priority: 'invalid_priority' }), 'Invalid priority fails validation');

// Export & Import testing
const exportData = generateExportData([validTask]);
assert(exportData.appName === 'Sankalp Task To Do', 'Export payload contains correct appName');
assert(exportData.version === 1, 'Export payload contains schema version 1');
assert(exportData.tasks.length === 1, 'Export payload contains 1 task');

const importResult = validateImportData(exportData);
assert(importResult.valid === true, 'Import validates exported data successfully');
assert(importResult.tasks.length === 1, 'Import extracted 1 task');
assert(importResult.tasks[0].title === 'Meditate for 15 minutes', 'Imported task matches title');

// Invalid import test
const invalidImport = validateImportData({ malicious: true });
assert(!invalidImport.valid, 'Malformed JSON correctly rejected by import validator');

// 3. TASK FILTERING & SORTING LOGIC TESTS
console.log('\n[3] Filtering & Sorting Logic Verification:');
const testTasks: Task[] = [
  {
    id: 't-1',
    title: 'Alpha task overdue',
    deadlineDate: '2023-01-01',
    priority: 'high',
    completed: false,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  {
    id: 't-2',
    title: 'Beta task today',
    deadlineDate: todayStr,
    priority: 'low',
    completed: false,
    createdAt: '2026-01-02T10:00:00Z',
    updatedAt: '2026-01-02T10:00:00Z',
  },
  {
    id: 't-3',
    title: 'Gamma task upcoming',
    deadlineDate: tomorrowStr,
    priority: 'medium',
    completed: false,
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-03T10:00:00Z',
  },
  {
    id: 't-4',
    title: 'Delta task completed',
    deadlineDate: todayStr,
    priority: 'high',
    completed: true,
    completedAt: '2026-01-04T12:00:00Z',
    createdAt: '2026-01-04T10:00:00Z',
    updatedAt: '2026-01-04T12:00:00Z',
  },
];

// View: 'all' -> active tasks (t-1, t-2, t-3)
const activeTasks = testTasks.filter((t) => !t.completed);
assert(activeTasks.length === 3, 'Active filter returns 3 uncompleted tasks');

// View: 'today' -> today or overdue (t-1, t-2)
const todayTasks = testTasks.filter(
  (t) => !t.completed && (isTaskDueToday(t.deadlineDate) || isTaskOverdue(t.deadlineDate, t.deadlineTime, t.completed))
);
assert(todayTasks.length === 2, 'Today view correctly includes overdue and today tasks');

// View: 'upcoming' -> tomorrow onwards (t-3)
const upcomingTasks = testTasks.filter((t) => !t.completed && isTaskUpcoming(t.deadlineDate));
assert(upcomingTasks.length === 1 && upcomingTasks[0].id === 't-3', 'Upcoming view correctly includes only tomorrow onwards');

// View: 'completed' -> (t-4)
const completedTasks = testTasks.filter((t) => t.completed);
assert(completedTasks.length === 1 && completedTasks[0].id === 't-4', 'Completed view returns only completed tasks');

// Priority Filter: 'high' on active tasks
const highPriorityActive = activeTasks.filter((t) => t.priority === 'high');
assert(highPriorityActive.length === 1 && highPriorityActive[0].id === 't-1', 'Priority filter returns high priority tasks');

// Search Filter: query "Beta"
const searchBeta = activeTasks.filter((t) => t.title.toLowerCase().includes('beta'));
assert(searchBeta.length === 1 && searchBeta[0].id === 't-2', 'Search query correctly locates matching tasks');

// Sorting by Priority (High > Med > Low)
const sortedByPriority = [...activeTasks].sort((a, b) => {
  const pScore = { high: 3, medium: 2, low: 1 };
  return pScore[b.priority] - pScore[a.priority];
});
assert(sortedByPriority[0].priority === 'high', 'First task in priority sort is high');
assert(sortedByPriority[2].priority === 'low', 'Last task in priority sort is low');

// Sorting by Title
const sortedByTitle = [...activeTasks].sort((a, b) => a.title.localeCompare(b.title));
assert(sortedByTitle[0].title === 'Alpha task overdue', 'Title sort orders alphabetically');

console.log('\n--- ALL VERIFICATION SUITE TESTS PASSED SUCCESSFULLY! ---');
