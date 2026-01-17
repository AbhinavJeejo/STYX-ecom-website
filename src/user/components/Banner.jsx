import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import banner1 from '../../assets/newarrshoes.jpg';
import banner2 from '../../assets/since1999.jpg'; 
import banner3 from '../../assets/70offer.jpg';
import '../../styles/userstyles/Banner.css';

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const banners = [banner1, banner2, banner3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="banner-container">
      {banners.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`banner-${index}`}
          className="banner-image"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.05
          }}
          transition={{
            opacity: { duration: 0.8, ease: "easeInOut" },
            scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: index === currentIndex ? 1 : 0
          }}
        />
      ))}

      <div className="overlay-glow"></div>
      
      <div className="slider-dots">
        {banners.map((_, index) => (
          <div 
            key={index} 
            className={`dot ${index === currentIndex ? 'active-dot' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;