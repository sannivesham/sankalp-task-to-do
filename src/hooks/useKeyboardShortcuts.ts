import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewTask: () => void;
  onFocusSearch: () => void;
  onCloseModals: () => void;
  onToggleTheme: () => void;
}

export function useKeyboardShortcuts({
  onNewTask,
  onFocusSearch,
  onCloseModals,
  onToggleTheme,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea or select
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Escape always closes open modals
      if (e.key === 'Escape') {
        onCloseModals();
        return;
      }

      // Ctrl+K or Cmd+K focuses search
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      // If user is inside an input, don't trigger letter shortcuts
      if (isInput) return;

      // '/' focuses search
      if (e.key === '/') {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      // 'n' or 'N' opens new task modal
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNewTask();
        return;
      }

      // 't' toggles theme
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        onToggleTheme();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onFocusSearch, onCloseModals, onToggleTheme]);
}
