import React, { useState } from 'react';
import {
  getNotificationStatus,
  requestNotificationPermission,
  sendBrowserNotification,
} from '../utils/notifications';
import { playReminderChime } from '../utils/audio';
import {
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  Info,
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionChange: (perm: NotificationPermission) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onPermissionChange,
}) => {
  const [status, setStatus] = useState(getNotificationStatus());
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequest = async () => {
    const newPerm = await requestNotificationPermission();
    setStatus(getNotificationStatus());
    onPermissionChange(newPerm);
  };

  const handleTestAlert = () => {
    playReminderChime();
    sendBrowserNotification('Sankalp Test Reminder', {
      body: 'Your notification system is working! Keep your promises.',
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-sankalp-dark-surface rounded-3xl shadow-2xl border border-sankalp-rose/50 dark:border-sankalp-dark-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sankalp-rose/30 dark:border-sankalp-dark-border bg-gradient-to-r from-sankalp-rose/20 to-transparent dark:from-sankalp-dark-surface2/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sankalp-burgundy/10 dark:bg-sankalp-burgundy/30 flex items-center justify-center text-sankalp-burgundy dark:text-sankalp-gold">
              <Bell className="w-4 h-4" />
            </div>
            <h2
              id="notif-modal-title"
              className="text-lg font-bold text-sankalp-maroon dark:text-sankalp-ivory"
            >
              Reminders & Notification Delivery
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

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Status Box */}
          <div className="p-4 rounded-2xl bg-sankalp-rose/20 dark:bg-sankalp-dark-surface2/60 border border-sankalp-rose/40 dark:border-sankalp-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sankalp-maroon/70 dark:text-sankalp-rose/70">
                Browser Permission
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  status.permission === 'granted'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : status.permission === 'denied'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}
              >
                {status.permission === 'granted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {status.permission === 'denied' && <AlertCircle className="w-3.5 h-3.5" />}
                {status.permission === 'default' && <HelpCircle className="w-3.5 h-3.5" />}
                <span className="capitalize">{status.permission}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {status.permission !== 'granted' && status.supported && (
                <button
                  type="button"
                  onClick={handleRequest}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sankalp-burgundy text-sankalp-ivory text-xs font-bold hover:brightness-110 shadow-xs transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-sankalp-gold" />
                  <span>Enable Browser Notifications</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleTestAlert}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-sankalp-dark border border-sankalp-rose/60 dark:border-sankalp-dark-border text-xs font-semibold text-sankalp-maroon dark:text-sankalp-rose hover:bg-sankalp-rose/20 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-sankalp-gold" />
                <span>{testSent ? 'Chimed & Sent!' : 'Test Sound & Alert'}</span>
              </button>
            </div>
          </div>

          {/* Honest Technical Transparency Section */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 text-sankalp-gold shrink-0" />
              <span>How Sankalp Reminders Work (Honest Architecture)</span>
            </div>
            <p className="leading-relaxed text-[12px] opacity-90">
              Standard client-side web apps running statically without a 24/7 backend push server cannot wake up a completely closed browser or phone screen.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] opacity-90">
              <li>
                <strong>While this tab is open:</strong> Both visual in-app banner alerts with acoustic chimes and native desktop notifications trigger right on time.
              </li>
              <li>
                <strong>In the background:</strong> Desktop browsers will fire notifications if the tab remains open in any window.
              </li>
              <li>
                <strong>When closed:</strong> A backend push subscription server is required for closed-device delivery; this first version focuses on fast, local, zero-tracking browser storage.
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-sankalp-maroon text-sankalp-ivory text-xs font-bold hover:brightness-110 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
