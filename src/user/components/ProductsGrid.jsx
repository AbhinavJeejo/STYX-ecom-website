import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import ShoeScroll from "./ShoeScroll";
import InfiniteBrands from "./InfiniteBrands";
import '../../styles/userstyles/productsGrid.css';

function ProductsGrid({ products }) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                } else {
                    entry.target.classList.remove('reveal-visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px" 
        });

        const cards = document.querySelectorAll('.scroll-reveal-card');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [products]);

    return (
        <div className="products-grid">
            {products.map((product, index) => (
                <React.Fragment key={product.id}>
                    <div className="scroll-reveal-card">
                        <ProductCard product={product} />
                    </div>

                    {index === 7 && (
                        <div className="brand-banner-container">
                            <InfiniteBrands />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default ProductsGrid;