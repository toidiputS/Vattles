
import React, { useEffect, useRef } from 'react';
import { XIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus management: Run only when isOpen becomes true
  useEffect(() => {
    if (!isOpen) return;

    const modalNode = modalRef.current;
    if (!modalNode) return;

    // Delay focus slightly to allow for modal animation and DOM rendering
    const focusTimeout = setTimeout(() => {
        const focusableElements = modalNode.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        
        // Only autofocus if the active element is not already inside the modal
        // This prevents stealing focus if the user has already started typing or clicking
        if (firstElement && !modalNode.contains(document.activeElement)) {
            firstElement.focus();
        }
    }, 100);
    
    return () => clearTimeout(focusTimeout);
  }, [isOpen]);

  // Keydown management: Handle Tab and Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const modalNode = modalRef.current;
      if (!modalNode) return;

      if (event.key === 'Tab') {
        const focusableElements = modalNode.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-[#100D20] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/40 p-6 sm:p-8 w-full max-w-md m-4 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
        style={{
          animation: 'fade-in-scale 0.3s forwards'
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
          aria-label="Close dialog"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <h2 id="modal-title" className="font-orbitron text-2xl font-bold text-white mb-6 text-center">{title}</h2>
        {children}
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
