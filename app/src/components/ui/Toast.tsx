'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number; // in milliseconds
  onClose?: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false); // start hidden for slide-in

  useEffect(() => {
    // Slide in after mount
    const enter = setTimeout(() => setVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // wait for slide-out transition
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(enter);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}
        flex items-center justify-between gap-4 px-4 py-2 rounded shadow-lg text-white min-w-[250px] max-w-xs break-words
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <span>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
