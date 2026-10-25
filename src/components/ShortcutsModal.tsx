import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Create new task' },
    { key: '/', desc: 'Focus search bar' },
    { key: 'Ctrl + K', desc: 'Focus search bar' },
    { key: 'T', desc: 'Toggle light / dark mode' },
    { key: 'Esc', desc: 'Close dialogs and popups' },
    { key: 'Enter', desc: 'Submit quick task or modal form' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-sankalp-dark-surface rounded-3xl shadow-2xl border border-sankalp-rose/50 dark:border-sankalp-dark-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sankalp-rose/30 dark:border-sankalp-dark-border">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-sankalp-gold" />
            <h2
              id="shortcuts-modal-title"
              className="text-base font-bold text-sankalp-maroon dark:text-sankalp-ivory"
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-maroon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-sankalp-rose/20 dark:border-sankalp-dark-border/40 text-xs"
            >
              <span className="text-sankalp-maroon/80 dark:text-sankalp-rose/80 font-medium">
                {s.desc}
              </span>
              <kbd className="px-2 py-1 rounded-md bg-sankalp-rose/30 dark:bg-sankalp-dark-surface2 text-sankalp-maroon dark:text-sankalp-ivory font-mono font-semibold border border-sankalp-rose/50 dark:border-sankalp-dark-border shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
