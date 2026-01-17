import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "../../styles/userstyles/Navbar.css";
import { 
    Button, 
    Badge, 
    Popover, 
    Avatar, 
    Snackbar,
    Alert
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LoginIcon from "@mui/icons-material/Login";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import logoimg from "../../assets/ChatGPT Image Jan 5, 2026, 05_25_50 PM.png";
import { CartContext } from "../../context/CartContext";
import { useThemeContext } from "../../context/ThemeContextProvider";

function Navbar() {
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);
    const { isDarkMode, toggleTheme } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openLoginAlert, setOpenLoginAlert] = useState(false);
    const [userData, setUserData] = useState({ name: "Guest", email: "", isGuest: true });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user) {
            const isGuest = user.email === "guest@example.com";
            setUserData({ 
                name: user.name, 
                email: isGuest ? "" : user.email,
                isGuest
            });
        }
    }, []);

    const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
    const handleProfileClose = () => setAnchorEl(null);
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const open = Boolean(anchorEl);

    const toHome = () => { navigate("/"); closeMobileMenu(); };
    const toMenSession = () => { navigate("/men"); closeMobileMenu(); };
    const toWomenSession = () => { navigate("/women"); closeMobileMenu(); };
    const toKidsSession = () => { navigate("/kids"); closeMobileMenu(); };
    const toOrders = () => { navigate("/orders"); handleProfileClose(); };

    const toCart = () => {
        if (userData.isGuest) {
            setOpenLoginAlert(true);
            return;
        }
        navigate("/cart");
    };

    const toWishList = () => {
        if (userData.isGuest) {
            setOpenLoginAlert(true);
            return;
        }
        navigate("/wishlist");
    };

    function handleAuthAction() {
        localStorage.removeItem("loggedInUser");
        window.dispatchEvent(new Event("user-changed"));
        navigate("/login");
        handleProfileClose();
    }

    return (
        <>
            <nav className="navbar">
                <div className="left-section">
                    <button className="menu-toggle" onClick={toggleMobileMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div className="logo" onClick={toHome}>
                        <img src={logoimg} alt="STYX Logo" /> STYX
                    </div>
                </div>

                <ul className="nav-links">
                    <li onClick={toHome}>Home</li>
                    <li onClick={toMenSession}>Men</li>
                    <li onClick={toWomenSession}>Women</li>
                    <li onClick={toKidsSession}>Kids</li>
                </ul>

                <div className="icons-section">
                    <div className="theme-icon" onClick={toggleTheme}>
                        {isDarkMode ? 
                            <LightModeIcon style={{ fontSize: 26 }} /> : 
                            <DarkModeIcon style={{ fontSize: 26 }} />
                        }
                    </div>

                    <div className="wishlist-icon" onClick={toWishList}>
                        <Badge badgeContent={0} color="secondary">
                            <BookmarkIcon style={{ fontSize: 26 }} />
                        </Badge>
                    </div>

                    <div className="cart-icon" onClick={toCart}>
                        <Badge badgeContent={userData.isGuest ? 0 : cart.length} color="secondary">
                            <ShoppingCartIcon style={{ fontSize: 26 }} />
                        </Badge>
                    </div>

                    <div className="profile-icon-wrapper" onClick={handleProfileClick}>
                        <AccountCircleIcon style={{ fontSize: 30 }} />
                    </div>
                </div>
            </nav>

            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
            
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="mobile-nav-links">
                    <li onClick={toHome}>Home</li>
                    <li onClick={toMenSession}>Men</li>
                    <li onClick={toWomenSession}>Women</li>
                    <li onClick={toKidsSession}>Kids</li>
                </ul>
                <div className="mobile-menu-icons">
                    <div className="mobile-icon" onClick={toggleTheme}>
                        {isDarkMode ? 
                            <LightModeIcon style={{ fontSize: 24 }} /> : 
                            <DarkModeIcon style={{ fontSize: 24 }} />
                        }
                        <span>Theme</span>
                    </div>
                    <div className="mobile-icon" onClick={toWishList}>
                        <FavoriteBorderIcon style={{ fontSize: 24 }} />
                        <span>Wishlist</span>
                    </div>
                    <div className="mobile-icon" onClick={toCart}>
                        <ShoppingCartIcon style={{ fontSize: 24 }} />
                        <span>Cart</span>
                    </div>
                    <div className="mobile-icon" onClick={handleProfileClick}>
                        <AccountCircleIcon style={{ fontSize: 24 }} />
                        <span>Profile</span>
                    </div>
                </div>
            </div>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <div style={{ padding: "20px", textAlign: "center", width: "240px" }}>
                    <Avatar sx={{ bgcolor: "#d6a76c", mx: "auto", mb: 1, width: 56, height: 56 }}>
                        {userData.name.charAt(0)}
                    </Avatar>

                    <h4 style={{ margin: "10px 0 2px 0", fontWeight: 600, color: "#000000" }}>{userData.name}</h4>

                    {!userData.isGuest && <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 15 }}>{userData.email}</p>}

                    {!userData.isGuest && (
                        <button 
                            onClick={toOrders} 
                            style={{ 
                                width: "100%", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: "8px",
                                padding: "10px 15px",
                                marginBottom: "10px",
                                background: "none",
                                border: "1px solid #000000",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: 14
                            }}
                        >
                            <LocalMallIcon fontSize="small" /> Your Orders
                        </button>
                    )}

                    <Button
                        onClick={handleAuthAction}
                        fullWidth
                        variant="contained"
                        color={userData.isGuest ? "primary" : "error"}
                        startIcon={userData.isGuest ? <LoginIcon /> : null}
                        sx={{ 
                            backgroundColor: userData.isGuest ? "#000000" : "#ff0000",
                            "&:hover": {
                                backgroundColor: userData.isGuest ? "#333333" : "#cc0000"
                            }
                        }}
                    >
                        {userData.isGuest ? "Login" : "Logout"}
                    </Button>
                </div>
            </Popover>

            <Snackbar
                open={openLoginAlert}
                autoHideDuration={2000}
                onClose={() => setOpenLoginAlert(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="info" variant="filled">
                    You need to login first
                </Alert>
            </Snackbar>
        </>
    );
}

export default Navbar;