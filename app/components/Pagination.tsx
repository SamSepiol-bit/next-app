"use client";


interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {




  const pages: (number | "...")[] = [];

  pages.push(1);

  if (current > 3) pages.push("...");

  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 1 && i < total) pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  if (total > 1) pages.push(total);

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="px-3 py-1 rounded-md border disabled:text-gray-400 disabled:border-gray-200"
      >
        ‹
      </button>

      {pages.map((p, index) =>
        p === "..." ? (
          <span key={index} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onChange(p)}
            className={`px-3 py-1 rounded-md border 
            ${p === current ? "bg-[var(--color-dark-primary)] text-white border-[var(--color-dark-primary)]" : "bg-white"}`}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="px-3 py-1 rounded-md border disabled:text-gray-400 disabled:border-gray-200"
      >
        ›
      </button>
    </div>
  );
}
