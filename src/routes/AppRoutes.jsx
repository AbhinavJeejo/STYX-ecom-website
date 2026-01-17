import { Route, Routes, useLocation } from "react-router-dom";

import Login from "../user/auth/Login";
import Register from "../user/auth/Register";
import Home from "../user/pages/Home";
import Navbar from "../user/components/Navbar";
import AdminLogin from "../admin/auth/AdminLogin";
import Dashboard from "../admin/pages/admin-dashboard/Dashboard";
import AdminUserView from "../admin/compoents/AdminUserView";
import AdminViewProducts from "../admin/compoents/AdminViewProducts";
import AdminOrdersView from "../admin/compoents/AdminOrdersView";
import AdminSettings from "../admin/compoents/AdminSettings";
import ProductsPage from "../user/components/ProductsPage";
import ProductDetail from "../user/pages/ProductDetail";
import Cart from "../user/pages/Cart";
import WishList from "../../src/user/pages/WishList";
import Upcoming from "../user/pages/Upcoming";
import Checkout from "../user/pages/Checkout";
import Orders from "../user/pages/Orders";

import UserProtectedRoute from "./UserProtected";
import AdminProtectedRoute from "./AdminProtected";

import "../../src/index.css";

function AppRoutes() {
    const location = useLocation();

    const hideNavbarRoutes = [
        "/login",
        "/register",
        "/adminlogin",
        "/admindashboard",
        "/adminviewproducts",
        "/adminuserview",
        "/adminordersview",
        "/adminsettings"
    ];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    const noPaddingNeeded = ["/cart", "/checkout", "/upcoming", "/orders"];
    const noPadding = noPaddingNeeded.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && <Navbar />}

            <div className={shouldHideNavbar || noPadding ? "" : "page-wrapper"}>
                <Routes>
                    {/* ===== PUBLIC ROUTES ===== */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/men" element={<ProductsPage />} />
                    <Route path="/women" element={<ProductsPage />} />
                    <Route path="/kids" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/upcoming" element={<Upcoming />} />

                    {/* ===== USER PROTECTED ROUTES ===== */}
                    <Route element={<UserProtectedRoute />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/wishlist" element={<WishList />} />
                    </Route>

                    {/* ===== ADMIN ROUTES ===== */}
                    <Route path="/adminlogin" element={<AdminLogin />} />
                    <Route element={<AdminProtectedRoute />}>
                        <Route path="/admindashboard" element={<Dashboard />} />
                        <Route path="/adminuserview" element={<AdminUserView />} />
                        <Route path="/adminordersview" element={<AdminOrdersView />} />
                        <Route path="/adminviewproducts" element={<AdminViewProducts />} />
                        <Route path="/adminsettings" element={<AdminSettings />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default AppRoutes;
