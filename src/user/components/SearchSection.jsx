import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sort from "./Sort";
import "../../styles/userstyles/searchSection.css";
import { FilterContext } from "../../context/FilterContext";
import video from "../../assets/styx-sandals.mp4";

function SearchSection({ filteredProducts }) {
    const navigate = useNavigate();
    const { search, setSearch, category, setCategory } = useContext(FilterContext);

    const categories = ["All", "Casual", "Sports", "Formals"];

    function toUpcoming(){
        navigate("/upcoming")
    }

    return (
        <>
        <div className="search-section-container">
            <div className="search-wrapper">
                <div className="search-content-main">
                    <div className="search-header">
                        <h2 className="search-title">Find Your Perfect Pair</h2>
                        <p className="search-subtitle">Explore our curated collection of premium footwear</p>

                        <div className="search-container">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="search"
                                placeholder="Search shoes, brands, styles…"
                                className="search-box"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                        <Sort />
                    </div>

                    <div className="category-wrapper">
                        <ul className="category-list">
                            {categories.map((cat) => (
                                <li
                                    key={cat}
                                    className={`category-item ${category === cat ? "active" : ""}`}
                                    onClick={() => setCategory(cat)}
                                >
                                    <span className="category-text">{cat}</span>
                                    {category === cat && <span className="category-indicator"></span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div onClick={toUpcoming} className="search-video-right">
                    <div className="video-badge">New Collection</div>
                    <video autoPlay muted loop playsInline className="shoe-promo-video">
                        <source src={video} type="video/mp4" />
                    </video>
                    <div className="video-overlay">
                        <span className="video-cta">Explore Now →</span>
                    </div>
                </div>
            </div>
            <hr className="divider" />
        </div>
        <div className="products-count-section">
            <div className="count-wrapper">
                <span className="count-number">{filteredProducts.length}</span>
                <span className="count-label">Products Available</span>
            </div>
        </div>
        </>
    );
}

export default SearchSection;