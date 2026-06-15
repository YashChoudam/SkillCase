import axios from "axios";

// Base API URL pointing to the local Node/Express backend
const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject JWT token dynamically before requests are dispatched
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to catch 401 Unauthorized errors globally and clean up expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid, clean up local storage
      localStorage.removeItem("token");
      // Optional: Redirect to login or dispatch a logout action
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
