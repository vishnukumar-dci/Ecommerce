/**
 * Pagination Component
 * Pagination controls for lists
 */

import React from "react";
import type { PaginationProps } from "../../types/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate start and end of middle pages
    let start = Math.max(2, page - 1);
    let end = Math.min(totalPages - 1, page + 1);

    if (page <= 2) {
      end = Math.min(totalPages - 1, maxPagesToShow - 1);
    } else if (page >= totalPages - 1) {
      start = Math.max(2, totalPages - (maxPagesToShow - 2));
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
      >
        <ChevronLeft size={20} />
      </button>

      {pages.map((p, idx) => (
        <button
          key={idx}
          onClick={() => typeof p === "number" && onPageChange(p)}
          disabled={p === "..."}
          className={`px-3 py-2 rounded ${
            p === page
              ? "bg-blue-500 text-white"
              : p === "..."
                ? "cursor-default"
                : "hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
