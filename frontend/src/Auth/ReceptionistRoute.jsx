import { Navigate, Outlet } from "react-router-dom";

export default function ReceptionistRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role !== "receptionist") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
