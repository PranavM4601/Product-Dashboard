"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import {
  getLocalAddedProducts,
  addLocalProduct,
  getLocalEdits,
  saveLocalEdit,
  getLocalDeleted,
  saveLocalDelete,
} from "@/utils/storage";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import FilterSort from "@/components/FilterSort";
import ProductFormModal from "@/components/ProductFormModal";
import useDebounce from "@/hooks/useDebounce";
import { Loader2, Search, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const USD_TO_INR = 84; // Conversion rate

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPage = parseInt(searchParams.get("page"));
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const rawLimit = parseInt(searchParams.get("limit"));
  const limit =
    isNaN(rawLimit) || ![10, 20, 50].includes(rawLimit) ? 10 : rawLimit;

  const searchUrlQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(searchUrlQuery);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    if (debouncedSearch !== searchUrlQuery) {
      updateParams({ q: debouncedSearch, page: 1, category: "" });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const localAdded = getLocalAddedProducts();
        const localEdits = getLocalEdits();
        const localDeleted = getLocalDeleted();

        const matchingAdded = localAdded.filter((item) => {
          if (localDeleted.includes(Number(item.id))) return false;
          if (
            category &&
            item.category.toLowerCase() !== category.toLowerCase()
          )
            return false;
          if (
            searchUrlQuery &&
            !item.title.toLowerCase().includes(searchUrlQuery.toLowerCase())
          )
            return false;
          return true;
        });

        const localCount = matchingAdded.length;
        const virtualSkip = (page - 1) * limit;

        let apiSkip = 0;
        let apiLimit = limit;
        let localItemsForThisPage = [];

        if (virtualSkip < localCount) {
          const localTake = Math.min(localCount - virtualSkip, limit);
          localItemsForThisPage = matchingAdded.slice(
            virtualSkip,
            virtualSkip + localTake
          );
          apiLimit = limit - localTake;
          apiSkip = 0;
        } else {
          apiSkip = virtualSkip - localCount;
          apiLimit = limit;
        }

        const fetchLimit = apiLimit > 0 ? apiLimit : 1;
        const data = await getProducts({
          limit: fetchLimit,
          skip: apiSkip,
          q: searchUrlQuery,
          category,
          sortBy,
          order,
        });

        if (!ignore) {
          let apiList = [];
          if (apiLimit > 0) {
            apiList = data.products
              .filter((p) => !localDeleted.includes(Number(p.id)))
              .map((p) => {
                const convertedPrice = Math.round(p.price * USD_TO_INR);
                const baseProduct = { ...p, price: convertedPrice };
                return localEdits[p.id]
                  ? { ...baseProduct, ...localEdits[p.id] }
                  : baseProduct;
              });
          }

          localItemsForThisPage = localItemsForThisPage.map((item) =>
            localEdits[item.id] ? { ...item, ...localEdits[item.id] } : item
          );

          // Combine local and API items, leaving local items pinned to the top
          let combinedList = [...localItemsForThisPage, ...apiList];

          const finalTotal = data.total + localCount;
          setProducts(combinedList);
          setTotal(finalTotal);

          // Auto-correct URL if manual page entry exceeds total available pages
          const maxAvailablePages = Math.ceil(finalTotal / limit) || 1;
          if (page > maxAvailablePages && finalTotal > 0) {
            updateParams({ page: maxAvailablePages });
          }
        }
      } catch (err) {
        if (!ignore) setError("Failed to load products. Please try again.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [page, limit, searchUrlQuery, category, sortBy, order]);

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        if (editingProduct.id < 1000000) {
          await updateProduct(editingProduct.id, productData);
        }

        const updatedData = {
          ...productData,
          thumbnail: productData.thumbnail || editingProduct.thumbnail,
          images: productData.thumbnail
            ? [productData.thumbnail]
            : editingProduct.images,
        };

        saveLocalEdit(editingProduct.id, updatedData);
        updateParams({});
        toast.success("Product updated successfully!");
      } else {
        const added = await addProduct(productData);
        const imageUrl =
          productData.thumbnail || "https://dummyjson.com/image/400";

        const newProduct = {
          ...added,
          id: Date.now(),
          thumbnail: imageUrl,
          images: [imageUrl],
          rating: 5.0,
          reviews: [],
        };
        addLocalProduct(newProduct);
        updateParams({ page: 1 });
        toast.success("Product added successfully!");
      }
    } catch (err) {
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        if (id < 1000000) {
          await deleteProduct(id);
        }
        saveLocalDelete(id);
        updateParams({});
        toast.success("Product deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete product.");
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[#18181b]/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex w-full lg:w-auto gap-4 flex-grow max-w-2xl">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all shrink-0 font-medium"
          >
            <Plus className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Add Product</span>
          </button>
        </div>
        <FilterSort
          category={category}
          sortBy={sortBy}
          order={order}
          searchQuery={searchUrlQuery}
          onFilterChange={(updates) => updateParams({ ...updates, page: 1 })}
        />
      </div>

      {error ? (
        <div className="text-center py-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl backdrop-blur-md">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-6">
          <ProductList
            products={products}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
            startIndex={(page - 1) * limit}
          />
          <Pagination
            total={total}
            page={page}
            limit={limit}
            onPageChange={(newPage) => updateParams({ page: newPage })}
            onLimitChange={(newLimit) =>
              updateParams({ limit: newLimit, page: 1 })
            }
          />
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
