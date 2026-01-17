import { useEffect, useState, useContext } from "react";
import SearchSection from "./SearchSection";
import ProductsGrid from "./ProductsGrid";
import { useLocation } from "react-router-dom";
import { FilterContext } from "../../context/FilterContext";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const { search, category, sort } = useContext(FilterContext);

    const location = useLocation();
    const audience =
        location.pathname === "/men"
            ? "Men"
            : location.pathname === "/women"
            ? "Women"
            : location.pathname === "/kids"
            ? "Kids"
            : "All";

    useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("products"));
  if (stored) {
    setProducts(stored.filter(p => p.isActive));
  }
}, []);

    const filteredProducts = products
        .filter((product) => {
            if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (audience !== "All" && product.audience !== audience) return false;
            if (category !== "All" && product.category.toLowerCase() !== category.toLowerCase()) return false;
            return true;
        })
        .sort((a, b) => {
            if (sort === "lowToHigh") return a.price - b.price;
            if (sort === "highToLow") return b.price - a.price;
            return 0;
        });

    return (
        <>
            <SearchSection filteredProducts={filteredProducts} />
            <ProductsGrid products={filteredProducts} />
        </>
    );
}

export default ProductsPage;
