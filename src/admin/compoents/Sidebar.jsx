import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Sidebar() {
    const navigate = useNavigate();
    function AdminProductsView() {
        navigate("/adminviewproducts");
    }
    function AdminUserView() {
        navigate("/adminuserview");
    }
    function AdminOrdersView(){
        navigate("/adminordersview");
    }
    function AdminSettings(){
        navigate("/adminsettings");
    }
    function logout() {
        localStorage.removeItem("loggedInUser");
        navigate("/adminlogin", { replace: true });
    }
    return (
        <>
            <div className="sidebar-logo">STYX Admin</div>
            <ul>
                <li>Dashboard</li>
                <li onClick={AdminUserView}>Users</li>
                <li onClick={AdminProductsView}>Products</li>
                <li onClick={AdminOrdersView}>Orders</li>
                <li onClick={AdminSettings}>Settings</li>
            </ul>
            <Button variant="contained" className="logout-btn" onClick={logout}>
                Logout
            </Button>
        </>
    );
}

export default Sidebar;
