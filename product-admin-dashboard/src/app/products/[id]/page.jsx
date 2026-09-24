"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getProductById } from "@/api/products";
import {
  getLocalAddedProducts,
  getLocalEdits,
  getLocalDeleted,
} from "@/utils/storage";
import { Loader2, ArrowLeft, Star, AlertCircle, User } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const deleted = getLocalDeleted();
      if (deleted.includes(Number(id))) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      const localAdded = getLocalAddedProducts();
      const localMatch = localAdded.find((p) => String(p.id) === String(id));

      if (localMatch) {
        const edits = getLocalEdits();
        const mergedLocal = edits[id]
          ? { ...localMatch, ...edits[id] }
          : localMatch;

        setProduct(mergedLocal);
        setActiveImage(mergedLocal.images?.[0] || mergedLocal.thumbnail);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProductById(id);
        const edits = getLocalEdits();
        const mergedData = edits[id] ? { ...data, ...edits[id] } : data;

        setProduct(mergedData);
        setActiveImage(mergedData.images?.[0] || mergedData.thumbnail);
      } catch (err) {
        if (err.response?.status === 404) {
          setIsNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover bg-gray-100 dark:bg-gray-700"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price}
              </span>
              <div className="flex items-center text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                <Star className="w-5 h-5 fill-current mr-1" />
                <span className="font-medium text-yellow-700 dark:text-yellow-400">
                  {product.rating || "5.0"}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 flex-grow">
              {product.description ||
                "No description provided for this locally added item."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Brand
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.brand || "Custom Brand"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stock Status
                </p>
                <p
                  className={`font-medium ${
                    product.stock > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} Available`
                    : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {review.reviewerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? "fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
