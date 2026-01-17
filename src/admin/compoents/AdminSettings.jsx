import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/adminstyles/AdminSettings.css";

function AdminSettings() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate("/adminlogin", { replace: true });
    };

    return (
        <>
         <h2 className="h2">Admin Settings</h2>
        <div className="admin-settings-page">
            <div className="settings-card">
                <div className="setting-row">
                    <span>Theme Mode</span>
                    <button className="toggle-btn" onClick={handleToggleTheme}>
                        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
                    </button>
                </div>

                <div className="setting-row danger">
                    <span>Logout</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default AdminSettings;
