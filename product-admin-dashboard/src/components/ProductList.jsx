import { Star, Package, Edit, Trash2, Box } from "lucide-react";
import Link from "next/link";

export default function ProductList({
  products,
  onEdit,
  onDelete,
  startIndex = 0,
}) {
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#18181b]/40 backdrop-blur-xl rounded-3xl border border-white/5">
        <Box className="w-16 h-16 text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">
          No products match your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-[#18181b]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col relative group"
          >
            <div className="absolute top-5 right-5 text-xs font-bold text-gray-500">
              #{startIndex + index + 1}
            </div>
            <Link href={`/products/${product.id}`} className="block flex-grow">
              <div className="flex items-center gap-4 mb-4 pr-8">
                <img
                  src={product.thumbnail || "https://dummyjson.com/image/150"}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-2xl bg-black/20 ring-1 ring-white/10"
                />
                <div>
                  <h3 className="font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>
                  <span className="inline-block mt-1 text-[10px] px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm mb-2">
                <div className="flex items-center text-amber-400/90 bg-amber-400/10 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Package className="w-4 h-4 mr-1.5 opacity-70" />
                  {product.stock} in stock
                </div>
              </div>
            </Link>

            <div className="flex justify-between items-center mt-5 pt-5 border-t border-white/5">
              <div className="font-bold text-xl text-white">
                ₹{product.price.toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-[#18181b]/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10">
                <th className="px-6 py-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-16">
                  Sr. No.
                </th>
                <th className="px-6 py-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {(startIndex + index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center gap-4"
                    >
                      <img
                        className="h-12 w-12 rounded-xl object-cover bg-black/20 ring-1 ring-white/10 shadow-sm"
                        src={
                          product.thumbnail || "https://dummyjson.com/image/150"
                        }
                        alt=""
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-current mr-1" />
                          {product.rating}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-[11px] leading-5 font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-200 font-medium">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Package className="w-4 h-4 mr-2 opacity-50" />
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
