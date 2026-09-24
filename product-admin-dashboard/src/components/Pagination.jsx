import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.ceil(total / limit) || 1;

  // Prevent mathematical inversion by clamping the active page to the max available pages
  const safePage = Math.min(page, totalPages);

  // Calculate the indicator values using the safePage
  const startItem = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endItem = Math.min(safePage * limit, total);

  // Generate page numbers to display dynamically
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, safePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (total === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 px-6 bg-[#18181b]/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
        {/* Items Per Page Dropdown */}
        <div className="flex items-center">
          <span className="mr-2">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-200 cursor-pointer transition-all"
          >
            <option value={10} className="bg-gray-900 text-white">
              10
            </option>
            <option value={20} className="bg-gray-900 text-white">
              20
            </option>
            <option value={50} className="bg-gray-900 text-white">
              50
            </option>
          </select>
        </div>

        <div className="hidden sm:block w-px h-4 bg-white/10"></div>

        {/* Indicator Text */}
        <div>
          Showing{" "}
          <span className="font-medium text-gray-200">
            {startItem}-{endItem}
          </span>{" "}
          of <span className="font-medium text-gray-200">{total}</span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="p-2 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                safePage === num
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="p-2 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
