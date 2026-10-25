import React, { useState, useRef } from 'react';
import type { Task } from '../types/task';
import { generateExportData, validateImportData } from '../utils/storage';
import {
  X,
  HardDriveDownload,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  Trash2,
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImport: (importedTasks: Task[], mode: 'merge' | 'replace') => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImport,
  onClearAll,
}) => {
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importFeedback, setImportFeedback] = useState<{
    success?: string;
    error?: string;
    pendingTasks?: Task[];
  } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle Export
  const handleExport = () => {
    const data = generateExportData(tasks);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `sankalp-tasks-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = validateImportData(parsed);

        if (!result.valid) {
          setImportFeedback({ error: result.error || 'Failed to parse valid tasks from file.' });
        } else {
          setImportFeedback({
            pendingTasks: result.tasks,
            success: `Found ${result.tasks.length} valid ${result.tasks.length === 1 ? 'task' : 'tasks'} in backup file.`,
          });
        }
      } catch {
        setImportFeedback({ error: 'Invalid JSON file. Please ensure this is a valid JSON backup.' });
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (!importFeedback?.pendingTasks) return;
    onImport(importFeedback.pendingTasks, importMode);
    onClose();
  };

  // Handle Clear All Data
  const handleExecuteClear = () => {
    onClearAll();
    setConfirmClear(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-sankalp-dark-surface rounded-3xl shadow-2xl border border-sankalp-rose/50 dark:border-sankalp-dark-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sankalp-rose/30 dark:border-sankalp-dark-border bg-gradient-to-r from-sankalp-rose/20 to-transparent dark:from-sankalp-dark-surface2/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sankalp-burgundy/10 dark:bg-sankalp-burgundy/30 flex items-center justify-center text-sankalp-burgundy dark:text-sankalp-gold">
              <FileJson className="w-4 h-4" />
            </div>
            <h2
              id="backup-modal-title"
              className="text-lg font-bold text-sankalp-maroon dark:text-sankalp-ivory"
            >
              Backup & Restore Data
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-sankalp-maroon/60 dark:text-sankalp-rose/60 hover:text-sankalp-maroon dark:hover:text-sankalp-ivory hover:bg-sankalp-rose/30 dark:hover:bg-sankalp-dark-surface2 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Export Section */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-sankalp-maroon dark:text-sankalp-ivory">
              Export Backup (JSON)
            </h3>
            <p className="text-xs text-sankalp-maroon/70 dark:text-sankalp-rose/70">
              Download all your resolves, deadlines, and reminders as a clean JSON file to store safely on your computer.
            </p>
            <button
              onClick={handleExport}
              disabled={tasks.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sankalp-burgundy text-sankalp-ivory text-xs font-bold hover:brightness-110 shadow-xs transition-all disabled:opacity-50"
            >
              <HardDriveDownload className="w-4 h-4 text-sankalp-gold" />
              <span>Download Backup ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})</span>
            </button>
          </section>

          {/* Import Section */}
          <section className="space-y-3 pt-4 border-t border-sankalp-rose/30 dark:border-sankalp-dark-border">
            <h3 className="text-sm font-bold text-sankalp-maroon dark:text-sankalp-ivory">
              Restore / Import Backup
            </h3>
            <p className="text-xs text-sankalp-maroon/70 dark:text-sankalp-rose/70">
              Select a previously exported Sankalp JSON file to restore your tasks.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-sankalp-rose/60 dark:border-sankalp-dark-border bg-sankalp-rose/10 dark:bg-sankalp-dark-surface2/50 text-sankalp-maroon dark:text-sankalp-ivory text-xs font-semibold hover:border-sankalp-gold transition-colors w-full justify-center"
            >
              <Upload className="w-4 h-4 text-sankalp-gold" />
              <span>Choose JSON Backup File</span>
            </button>

            {/* Validation Feedback */}
            {importFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium space-y-2 ${
                  importFeedback.error
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {importFeedback.error ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  )}
                  <span>{importFeedback.error || importFeedback.success}</span>
                </div>

                {importFeedback.pendingTasks && (
                  <div className="space-y-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <p className="font-semibold text-sankalp-maroon dark:text-sankalp-ivory">
                      Choose restore mode:
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="merge"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="text-sankalp-burgundy focus:ring-sankalp-gold"
                        />
                        <span className="text-xs">Merge with current</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="text-sankalp-burgundy focus:ring-sankalp-gold"
                        />
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                          Replace all current
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="w-full mt-2 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Apply Import ({importFeedback.pendingTasks.length} tasks)
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Reset All Data Section */}
          <section className="pt-4 border-t border-sankalp-rose/30 dark:border-sankalp-dark-border space-y-2">
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              <span>Reset & Clear All Data</span>
            </h3>
            <p className="text-xs text-sankalp-maroon/60 dark:text-sankalp-rose/60">
              Permanently wipe all stored tasks from this browser. This cannot be undone once confirmed.
            </p>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 rounded-xl border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Clear All Data...
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 space-y-2">
                <p className="text-xs font-bold text-red-700 dark:text-red-300">
                  Are you absolutely sure you want to clear all {tasks.length} tasks?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExecuteClear}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1 rounded-lg border border-sankalp-rose/50 dark:border-sankalp-dark-border text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
