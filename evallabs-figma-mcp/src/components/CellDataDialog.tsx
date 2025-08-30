'use client';

import { useEffect } from 'react';

interface CellDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
}

export default function CellDataDialog({ isOpen, onClose, content, title }: CellDataDialogProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 truncate">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <textarea
            readOnly
            value={content}
            className="w-full h-64 p-2 border border-slate-300 rounded-md bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Cell content"
          />
        </div>
        <div className="flex justify-end p-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
