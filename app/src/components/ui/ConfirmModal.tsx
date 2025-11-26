'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string; // optional to customize button color
}

export function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'bg-red-600 hover:bg-red-700',
}: ConfirmModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} className={`${confirmColor}`}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
