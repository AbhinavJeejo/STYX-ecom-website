import { Navigate, Outlet } from "react-router-dom";

function UserProtectedRoute() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  //if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //if logged in but role mismatch
  if (user.role !== "user") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default UserProtectedRoute;
