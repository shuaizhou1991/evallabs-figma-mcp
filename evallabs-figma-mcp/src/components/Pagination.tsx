'use client';

import { useState, useCallback, useMemo } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ 
  totalItems, 
  itemsPerPage = 20, 
  currentPage: externalCurrentPage,
  onPageChange 
}: PaginationProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  
  // Use external state if provided, otherwise use internal state
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const setCurrentPage = onPageChange || setInternalCurrentPage;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Memoize page numbers to display
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  const handlePrevious = useCallback(() => {
    setCurrentPage(Math.max(1, currentPage - 1));
  }, [currentPage, setCurrentPage]);

  const handleNext = useCallback(() => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  }, [currentPage, totalPages, setCurrentPage]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-neutral-900 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && handlePageClick(page)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            typeof page === 'number'
              ? currentPage === page
                ? 'bg-white border border-neutral-200 text-neutral-900 shadow-sm'
                : 'text-neutral-900 hover:bg-slate-50'
              : 'text-neutral-900'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-neutral-900 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
