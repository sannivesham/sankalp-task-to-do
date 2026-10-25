import React from 'react';
import type { UndoItem } from '../hooks/useTasks';
import { RotateCcw, X, Sparkles } from 'lucide-react';

interface UndoToastProps {
  undoItem: UndoItem | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({ undoItem, onUndo, onDismiss }) => {
  if (!undoItem) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-11/12 sm:w-auto bg-sankalp-maroon text-sankalp-ivory px-4 py-3 rounded-2xl shadow-xl border border-sankalp-gold/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
        <Sparkles className="w-4 h-4 text-sankalp-gold shrink-0" />
        <span className="truncate max-w-[200px] sm:max-w-xs">{undoItem.message}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            onUndo();
            onDismiss();
          }}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-sankalp-gold text-sankalp-maroon hover:bg-sankalp-gold-hover transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-sankalp-ivory/60 hover:text-sankalp-ivory transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
