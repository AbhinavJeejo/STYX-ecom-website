import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "../../styles/userstyles/Craftsmanship.css";

const Craftsmanship = () => {
    const { scrollYProgress } = useScroll();

    const shoeY = useTransform(scrollYProgress, [0.4, 0.7], [100, 0]);
    const shoeScale = useTransform(scrollYProgress, [0.4, 0.6], [0.5, 1.1]);
    const shoeRotate = useTransform(scrollYProgress, [0.4, 0.8], [-15, 10]);

    const textXLeft = useTransform(scrollYProgress, [0.3, 0.9], [-200, 100]);
    const textXRight = useTransform(scrollYProgress, [0.3, 0.9], [200, -100]);

    return (
        <section className="premium-craft-root">
            <div className="kinetic-bg">
                <motion.h2 style={{ x: textXLeft }} className="outline-text">
                    ENGINEERED
                </motion.h2>
                <motion.h2 style={{ x: textXRight }} className="filled-text">
                    PERFECTION
                </motion.h2>
            </div>

            <div className="craft-main-wrapper">
                <div className="side-specs left">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="spec-card"
                    >
                        <div className="spec-icon">01</div>
                        <div className="spec-content">
                            <h4>AERO-KNIT UPPER</h4>
                            <p>Breathable micro-fibers that adapt to your foot's natural movement.</p>
                        </div>
                    </motion.div>
                </div>

                <div className="center-stage">
                    <motion.div
                        className="shoe-visual-container"
                        style={{
                            y: shoeY,
                            scale: shoeScale,
                            rotate: shoeRotate,
                            zIndex: 10,
                        }}
                    >
                        <div className="scanner-line"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"
                            alt="Premium Shoe"
                            className="hero-shoe-image"
                        />

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="glass-panel p1"
                        >
                            <span>CARBON SOLE</span>
                        </motion.div>
                    </motion.div>

                    <div className="platform-base"></div>
                </div>

                <div className="side-specs right">
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="spec-card"
                    >
                        <div className="spec-icon">02</div>
                        <div className="spec-content">
                            <h4>GRAVITY-CORE</h4>
                            <p>Proprietary cushioning that returns 95% of impact energy.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="quality-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <div className="quality-line"></div>
                <h3 className="quality-headline">UNCOMPROMISED DURABILITY</h3>
                <p className="quality-subtext" onClick={()=>window.scrollTo({ top:0, behavior: "smooth" })}>
                    Each pair undergoes 48 hours of stress testing and 120 precision checks. Built with military-grade
                    resilience and luxury-class comfort.
                </p>
            </motion.div>
        </section>
    );
};

export default Craftsmanship;
