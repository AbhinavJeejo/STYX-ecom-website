import { useEffect, useRef } from "react";
import "../../styles/userstyles/InfiniteBrands.css";

const InfiniteBrands = () => {
  const scrollerRef = useRef(null);
  const intervalRef = useRef(null);

  const brands = [
    "NIKE",
    "ADIDAS",
    "PUMA",
    "NEW BALANCE",
    "CONVERSE",
    "VANS",
    "REEBOK",
    "ASICS",
    "SAUCONY",
    "ON",
  ];

  const startAnimation = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const first = scroller.querySelector(".brand-item");
      if (first) {
        scroller.appendChild(first.cloneNode(true));
        scroller.removeChild(first);
      }
    }, 420);
  };

  const stopAnimation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, []);

  return (
    <div className="infinite-brands-section">
      <div className="section-header">
        <h2 className="section-title">Trusted by the Elite</h2>
        <p className="section-subtitle">
          Crafting excellence for the world's leading footwear innovators
        </p>
      </div>

      <div
        className="brands-scroller-container"
        onMouseEnter={stopAnimation}
        onMouseLeave={startAnimation}
      >
        <div className="brands-mask">
          <div className="brands-scroller" ref={scrollerRef}>
            {[...brands, ...brands].map((brand, index) => (
              <div key={`${brand}-${index}`} className="brand-item">
                <span className="brand-text">{brand}</span>
                <div className="brand-divider" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteBrands;
