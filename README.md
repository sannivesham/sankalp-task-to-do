# Sankalp Task To Do (संकल्प)

> *"Make a plan. Keep your promise. Get it done."*

**Sankalp Task To Do** is a simple, elegant, fast, and responsive to-do list and deadline management website. Built with a subtle Indian-inspired identity, it is designed for clarity, focus, and resolute task fulfillment without unnecessary productivity bloat.

---

## 🎨 Branding & Visual Identity

The design balances contemporary minimalism with warm Indian aesthetics:

- **Primary Burgundy** (`#84234F`): Royal resolve, primary action buttons, active focus states.
- **Deep Maroon** (`#321724`): Grounded text, card depth, and sophisticated headers.
- **Antique Gold** (`#D2A33A`): Badges, highlights, completion checkmarks, and bindu accents.
- **Warm Ivory** (`#FAF6EF`): Calm, eye-friendly light mode background.
- **Soft Rose** (`#E8D5DA`): Subtle borders, chips, and muted accents.
- **Dark Surface** (`#1F1921` / `#2A212D`): Distraction-free, deeply contrasted dark mode.

---

## 🚀 Key Features

### 1. Task Management & Resolves
- **Title & Description**: Required title with character validation and optional rich description.
- **Deadlines & Times**: Specify deadline dates (with quick presets for Today, Tomorrow, Weekend) and optional times.
- **Priorities**: High, Medium, and Low priorities with clear visual ribbons and color coding.
- **Quick Add Bar**: One-line rapid creation directly above the task list (type + press Enter).
- **Completion Feedback**: Satisfying completion checkmark animation, gentle synthesized acoustic harmonic chime (via Web Audio API), and celebratory confetti (with automatic `prefers-reduced-motion` compliance).
- **Instant Undo**: Safe 6-second floating toast on task completion and deletion to restore changes immediately.

### 2. Honest Deadlines & Reminders
- **Overdue Recognition**: Automatically computes and highlights overdue tasks in bold red alerts with relative time (e.g., *"Overdue by 2 hours"*).
- **Due Today & Due Soon**: Clearly differentiates tasks due today from upcoming milestones.
- **Dual Alert System**:
  - **In-App Alerts**: Floating reminder banners with acoustic chimes while the tab is active.
  - **Native Browser Notifications**: Web Notification API alerts with permission management.
  - **Snooze & Dismiss**: Quick snooze options (+10 minutes, +1 hour) and direct task completion right from the reminder banner.
  - **Technical Transparency**: Clear in-app explanations that static, client-side web apps cannot wake up closed browser tabs without a persistent push server.

### 3. Smart Views & Instant Search
- **All Tasks**: Overview of all active resolves.
- **Today**: Focus view highlighting overdue tasks at the top, followed by tasks due today.
- **Upcoming**: Future commitments scheduled for tomorrow and beyond.
- **Completed**: Archive of fulfilled promises with an option to reopen or clear.
- **Priority Filtering**: Filter by All, High, Medium, or Low priority.
- **Sorting Options**: Sort by Deadline (earliest first), Priority (High to Low), Creation Date, or Title (A–Z).
- **Instant Search**: Real-time filtering across titles and descriptions with single-click clear.

### 4. Local Storage & JSON Backup
- **Client-Side Persistence**: Saves tasks and theme preferences in `localStorage` without external tracking.
- **Schema Validation**: Robust data sanitization and error boundaries for corrupted storage entries.
- **JSON Export**: Download all tasks and metadata as `sankalp-tasks-YYYY-MM-DD.json`.
- **JSON Import**: Restore tasks with schema verification and option to **Merge** or **Replace**.
- **Safe Reset**: Secure clear-all option protected behind explicit confirmation.

### 5. Keyboard Navigation & Accessibility
- `N`: Open new task modal.
- `/` or `Ctrl + K`: Focus search bar.
- `T`: Toggle light / dark theme.
- `Esc`: Close any open dialog or modal.
- `Enter`: Submit task forms or quick add.
- High-contrast text, clear focus rings, semantic HTML, and ARIA roles for screen readers.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **Audio Feedback**: Web Audio API (zero external audio file dependencies)
- **Celebration**: Canvas Confetti (reduced-motion sensitive)
- **Testing**: Built-in automated TypeScript test suite (`tsx`)

---

## 📂 Project Structure

```
sankalp-task-todo/
├── public/
│   └── favicon.svg               # Stylized Sankalp emblem (Burgundy, Gold, Ivory)
├── src/
│   ├── __tests__/
│   │   └── verify.ts             # Comprehensive unit & integration verification suite
│   ├── components/
│   │   ├── BackupModal.tsx       # JSON Export & Import with schema validation
│   │   ├── BottomNav.tsx         # Mobile bottom navigation bar
│   │   ├── EmptyState.tsx        # Tailored empty states for each smart view
│   │   ├── Header.tsx            # Mobile top header with quick actions
│   │   ├── Logo.tsx              # Brand logo & typography component
│   │   ├── NotificationModal.tsx # Transparent browser notification permissions guide
│   │   ├── QuickAddTask.tsx      # One-line fast input with Enter key submission
│   │   ├── ReminderBanner.tsx    # In-app alert popup with snooze / complete controls
│   │   ├── SearchAndFilterBar.tsx# Instant search, priority chips, sort dropdown
│   │   ├── ShortcutsModal.tsx    # Keyboard shortcuts reference dialog
│   │   ├── Sidebar.tsx           # Desktop sidebar with navigation, progress & controls
│   │   ├── TaskCard.tsx          # Interactive card with badges, relative time & actions
│   │   ├── TaskCompletionSummary.tsx # Progress bar, completion rate & resolve status
│   │   ├── TaskList.tsx          # Grouped task list (Overdue, Today, Upcoming, Done)
│   │   ├── TaskModal.tsx         # Add / Edit task modal with presets & validation
│   │   └── UndoToast.tsx         # Floating undo banner for completions and deletes
│   ├── context/
│   │   └── ThemeContext.tsx      # Light, Dark, and System theme provider
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts# Global hotkey listener
│   │   ├── useReminders.ts       # Reminder interval engine & trigger coordinator
│   │   └── useTasks.ts           # Core CRUD state, storage sync, and undo stack
│   ├── types/
│   │   └── task.ts               # Task, Priority, Filter, and Export interfaces
│   ├── utils/
│   │   ├── audio.ts              # Synthesized Web Audio chimes
│   │   ├── dateUtils.ts          # Overdue, Due Today, 12h time & relative date formatters
│   │   ├── notifications.ts      # Native Notification API wrapper
│   │   └── storage.ts            # LocalStorage persistence & JSON import/export
│   ├── App.tsx                   # Main layout and view orchestrator
│   ├── index.css                 # Custom color theme tokens & scrollbar styles
│   └── main.tsx                  # Application entrypoint
├── index.html                    # SEO meta, Google Fonts (Plus Jakarta Sans & Cinzel)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd sankalp-task-todo

# Install dependencies
npm install
```

### Running in Development
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Running Verification Tests
```bash
npm test
```
Executes the comprehensive verification test suite covering date utilities, validation, serialization, import/export, and task filters.

### Production Build
```bash
npm run build
```
Generates production-ready, minified static assets in the `dist/` directory.

### Previewing the Production Build
```bash
npm run preview
```

---

## 🌐 Static Deployment

The compiled output in `dist/` is completely static and can be deployed directly to any static host:

- **Netlify**: Set publish directory to `dist` with build command `npm run build`.
- **Vercel**: Deploy directory `dist`.
- **GitHub Pages**: Build with Vite `base: './'` and deploy `dist/` to the `gh-pages` branch.

---

## ⚠️ Technical Limitations (v1)

1. **Closed-Tab Notifications**: Static client-side websites cannot deliver push notifications while the browser/tab is closed. Background delivery when completely closed requires a dedicated web push server (e.g., Web Push protocol with VAPID keys).
2. **Device Synchronization**: Data is stored securely in the browser's `localStorage` and does not automatically sync across separate browsers or devices. Use the built-in **Backup & Restore (JSON)** feature to migrate tasks between devices.
