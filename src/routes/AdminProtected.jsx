import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const admin = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!admin) {
    return <Navigate to="/adminlogin" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
