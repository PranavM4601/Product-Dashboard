import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle responses and errors centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress console.error for expected API failures (404 Not Found, 400 Bad Request)
    // so they don't trigger the Next.js dev overlay and can be handled by the UI
    if (error.response?.status !== 404 && error.response?.status !== 400) {
      console.error("API Error:", error.response?.data || error.message);
    }

    // Auto-logout on unauthorized
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
