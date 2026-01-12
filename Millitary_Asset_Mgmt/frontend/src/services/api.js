import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: (params) => api.get("/dashboard", { params }),
  getMovements: (params) => api.get("/dashboard/movements", { params }),
};

// Purchases API
export const purchaseAPI = {
  getAll: (params) => api.get("/purchases", { params }),
  getOne: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post("/purchases", data),
};

// Transfers API
export const transferAPI = {
  getAll: (params) => api.get("/transfers", { params }),
  getOne: (id) => api.get(`/transfers/${id}`),
  create: (data) => api.post("/transfers", data),
};

// Assignments API
export const assignmentAPI = {
  getAll: (params) => api.get("/assignments", { params }),
  create: (data) => api.post("/assignments", data),
  return: (id) => api.put(`/assignments/${id}/return`),
};

// Expenditures API
export const expenditureAPI = {
  getAll: (params) => api.get("/assignments/expenditures", { params }),
  create: (data) => api.post("/assignments/expenditures", data),
};

export default api;
