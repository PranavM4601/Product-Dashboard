import apiClient from "./axios";

export const getProducts = async ({
  limit = 10,
  skip = 0,
  q = "",
  category = "",
  sortBy = "",
  order = "",
}) => {
  let url = "/products";

  if (q) {
    url = `/products/search`;
  } else if (category) {
    url = `/products/category/${category}`;
  }

  const response = await apiClient.get(url, {
    params: {
      limit,
      skip,
      q: q || undefined,
      sortBy: sortBy || undefined,
      order: order || undefined,
    },
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get("/products/categories");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await apiClient.post("/products/add", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};
