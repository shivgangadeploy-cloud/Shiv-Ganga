import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://shiv-ganga-2.onrender.com/api",
  withCredentials: true, // 🔐 default: protected routes
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  /* 🔓 PUBLIC ROUTES (NO AUTH, NO COOKIES) */
  const publicRoutes = [
    "/online-booking",
    "/otp",
    "/room/search",
    "/membership",
    "/contact"
  ];

  const isPublic = publicRoutes.some(route =>
    config.url?.includes(route)
  );

  /* ❌ PUBLIC ROUTE: cookie + token dono hata do */
  if (isPublic) {
    config.withCredentials = false; // 🔥 MOST IMPORTANT
    delete config.headers.Authorization;
    return config;
  }

  /* 🔐 PROTECTED ROUTES */
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE INTERCEPTOR (OPTIONAL) ================= */
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized request:", err.config?.url);
    }
    return Promise.reject(err);
  }
);

export default api;
