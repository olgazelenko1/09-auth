'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

import css from './Modal.module.css';

type Props = {
  children: React.ReactNode;
  onClose: () => void;  
};

export default function Modal({ children, onClose }: Props) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const root = document.getElementById('modal-root');
    if (!root) {
      console.error('Modal root element with id "modal-root" not found.');
    }
    setModalRoot(root);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

  
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]); 

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  if (!modalRoot) return null;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        {children}
        <button
          className={css.button}
          onClick={close}
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>,
    modalRoot
  );
}
