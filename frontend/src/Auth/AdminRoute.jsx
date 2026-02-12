import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
