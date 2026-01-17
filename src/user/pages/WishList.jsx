import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "../../styles/userstyles/WishList.css";

function WishList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getUserId = () => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("currentUserId", newUserId);
      return newUserId;
    }
    return userId;
  };

  const loadBookmarks = () => {
    const userId = getUserId();
    const allBookmarks = JSON.parse(localStorage.getItem("userBookmarks")) || {};
    const userBookmarks = allBookmarks[userId] || [];
    setBookmarks(userBookmarks);
  };

  useEffect(() => {
    loadBookmarks();
    
    const handleBookmarksUpdate = () => {
      loadBookmarks();
    };
    
    window.addEventListener("bookmarks-updated", handleBookmarksUpdate);
    
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark-theme");
      setIsDarkMode(isDark);
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });
    
    return () => {
      window.removeEventListener("bookmarks-updated", handleBookmarksUpdate);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`wishlist-page ${isDarkMode ? 'dark-theme' : ''}`}>
      <h2>My Wishlist</h2>
      {bookmarks.length === 0 ? (
        <p className="empty-message">Your wishlist is empty.</p>
      ) : (
        <div className="products-grid">
          {bookmarks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;