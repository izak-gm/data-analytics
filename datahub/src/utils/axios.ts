import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
});

// Endpoints that don't require Authorization header
const NO_AUTH_REQUIRED = [
  "/auth/login",
];

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Check if this endpoint requires authentication
  const requiresAuth = !NO_AUTH_REQUIRED.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (requiresAuth) {
    const token = localStorage.getItem("jwt");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Optional: Redirect to login if no token for protected routes
    // else {
    //   window.location.href = '/login';
    // }
  }

  return config;
});

export default api;
