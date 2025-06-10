import React from "react";

export interface PagerProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // How many page numbers to show beside current
  className?: string;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const Pager: React.FC<PagerProps> = ({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  className = "",
}) => {
  if (pageCount <= 1) return null;
  const DOTS = "…";

  // Calculate page numbers to display
  const totalNumbers = siblingCount * 2 + 5; // prev, next, current, siblings, first, last, dots
  let pages: (number | string)[] = [];

  if (pageCount <= totalNumbers) {
    pages = range(1, pageCount);
  } else {
    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, pageCount);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < pageCount - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      pages = [
        ...range(1, leftItemCount),
        DOTS,
        pageCount,
      ];
    } else if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      pages = [
        1,
        DOTS,
        ...range(pageCount - rightItemCount + 1, pageCount),
      ];
    } else if (showLeftDots && showRightDots) {
      pages = [
        1,
        DOTS,
        ...range(leftSibling, rightSibling),
        DOTS,
        pageCount,
      ];
    }
  }

  return (
    <nav
      className={`flex items-center justify-center gap-1 select-none ${className}`}
      aria-label="Pagination"
    >
      <button
        className="px-2 py-1 rounded disabled:opacity-40"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        &lt;
      </button>
      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={p}
            className={`px-2 py-1 rounded ${
              p === page ? "bg-purple-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={p === page ? `Page ${p}, current page` : `Go to page ${p}`}
          >
            {p}
          </button>
        ) : (
          <span key={`dots-${idx}`} className="px-2 text-lg text-gray-400">
            {DOTS}
          </span>
        )
      )}
      <button
        className="px-2 py-1 rounded disabled:opacity-40"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  );
};
