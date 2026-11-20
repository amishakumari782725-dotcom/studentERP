import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 bg-white">
      <div className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> records
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
          className="px-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-2.5 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-xs text-slate-400">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              p === currentPage
                ? 'bg-[#7A1528] text-white border border-[#7A1528]'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-xs text-slate-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-2.5 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
          className="px-2"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
