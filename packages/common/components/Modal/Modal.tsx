import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

const MODAL_ROOT_ELEMENT = document.getElementById('modal-root');
export default function Modal({ isOpen, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [isOpen]);

  if (!isOpen || !MODAL_ROOT_ELEMENT) {
    return null;
  }

  return ReactDOM.createPortal(
    isOpen && <div className={`${className} fixed w-full h-full top-0 z-50`}>{children}</div>,
    MODAL_ROOT_ELEMENT,
  );
}
