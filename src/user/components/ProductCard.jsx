import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../../styles/userstyles/ProductCard.css";

function ProductCard({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    const getUserId = () => {
        const userId = localStorage.getItem("currentUserId");
        if (!userId) {
            const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("currentUserId", newUserId);
            return newUserId;
        }
        return userId;
    };

    useEffect(() => {
        const userId = getUserId();
        const allBookmarks = JSON.parse(localStorage.getItem("userBookmarks")) || {};
        const userBookmarks = allBookmarks[userId] || [];
        const isBookmarked = userBookmarks.some((item) => item.id === product.id);
        setIsFavorite(isBookmarked);
    }, [product.id]);

    const toggleFavorite = (e) => {
        e.stopPropagation();
        
        const userId = getUserId();
        const allBookmarks = JSON.parse(localStorage.getItem("userBookmarks")) || {};
        let userBookmarks = allBookmarks[userId] || [];
        
        if (!isFavorite) {
            userBookmarks.push(product);
            allBookmarks[userId] = userBookmarks;
            localStorage.setItem("userBookmarks", JSON.stringify(allBookmarks));
            setIsFavorite(true);
        } else {
            userBookmarks = userBookmarks.filter((item) => item.id !== product.id);
            allBookmarks[userId] = userBookmarks;
            localStorage.setItem("userBookmarks", JSON.stringify(allBookmarks));
            setIsFavorite(false);
        }
        
        window.dispatchEvent(new Event("bookmarks-updated"));
    };

    function toDetailedPage() {
        navigate(`/product/${product.id}`);
    }

    return (
        <div className="product-card" onClick={toDetailedPage}>
            <div className="image-container">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className={`wishlist-icons ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
                    {isFavorite ? <FavoriteIcon style={{ color: "#ff4d4d" }} /> : <FavoriteBorderIcon />}
                </span>
            </div>
            <div className="product-info">
                <div className="product-meta">
                    {product.category} • {product.audience}
                </div>
                <h3 className="products-name">{product.name}</h3>
                <p className="product-price">₹ {product.price}</p>
            </div>
        </div>
    );
}

export default ProductCard;