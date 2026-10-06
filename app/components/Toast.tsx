'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[400px]" role="alert" aria-live="assertive">
      <div className="flex items-center gap-3 bg-[var(--text)] text-white text-sm font-semibold px-5 py-3 rounded-[12px] shadow-lg">
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white/70 hover:text-white" aria-label="닫기">
          ✕
        </button>
      </div>
    </div>
  );
}
