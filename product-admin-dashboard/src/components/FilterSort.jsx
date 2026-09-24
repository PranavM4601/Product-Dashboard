import { useState, useEffect } from "react";
import { Filter, ArrowUpDown, X } from "lucide-react";
import { getCategories } from "@/api/products";

export default function FilterSort({
  category,
  sortBy,
  order,
  searchQuery,
  onFilterChange,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Check if any dropdown filter is currently active
  const hasActiveFilters = category !== "" || sortBy !== "" || order !== "";

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
      {/* Category Dropdown */}
      <div className="flex items-center border border-white/10 rounded-2xl px-4 bg-black/20 hover:bg-black/40 transition-colors h-12 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
        <select
          value={category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="bg-transparent outline-none text-sm text-gray-200 w-full cursor-pointer appearance-none pr-4"
        >
          <option value="" className="bg-gray-900 text-white">
            All Categories
          </option>
          {categories.map((cat) => {
            const catValue = typeof cat === "string" ? cat : cat.slug;
            const catLabel = typeof cat === "string" ? cat : cat.name;
            return (
              <option
                key={catValue}
                value={catValue}
                className="bg-gray-900 text-white capitalize"
              >
                {catLabel}
              </option>
            );
          })}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center border border-white/10 rounded-2xl px-4 bg-black/20 hover:bg-black/40 transition-colors h-12 w-full sm:w-auto">
        <ArrowUpDown className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
        <select
          value={sortBy && order ? `${sortBy}-${order}` : "-"}
          onChange={(e) => {
            const [newSort, newOrder] = e.target.value.split("-");
            onFilterChange({ sortBy: newSort || "", order: newOrder || "" });
          }}
          className="bg-transparent outline-none text-sm text-gray-200 w-full cursor-pointer appearance-none pr-4"
        >
          <option value="-" className="bg-gray-900 text-white">
            Default Sorting
          </option>
          <option value="title-asc" className="bg-gray-900 text-white">
            Title: A to Z
          </option>
          <option value="title-desc" className="bg-gray-900 text-white">
            Title: Z to A
          </option>
          <option value="price-asc" className="bg-gray-900 text-white">
            Price: Low to High
          </option>
          <option value="price-desc" className="bg-gray-900 text-white">
            Price: High to Low
          </option>
          <option value="rating-desc" className="bg-gray-900 text-white">
            Rating: High to Low
          </option>
          <option value="rating-asc" className="bg-gray-900 text-white">
            Rating: Low to High
          </option>
        </select>
      </div>

      {/* Reset Button (Only visible when filters are applied) */}
      {hasActiveFilters && (
        <button
          onClick={() =>
            onFilterChange({ category: "", sortBy: "", order: "" })
          }
          className="flex items-center justify-center h-12 px-4 text-sm font-medium text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all border border-white/5 hover:border-red-500/20 shrink-0 w-full sm:w-auto"
          title="Reset Filters"
        >
          <X className="w-4 h-4 mr-1.5" />
          Reset
        </button>
      )}
    </div>
  );
}
