import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring, useMotionValueEvent } from "framer-motion";
import "../../styles/userstyles/ShoeScroll.css";

const FRAME_COUNT = 40;

export default function ShoeScroll() {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothScroll = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 35,
        restDelta: 0.001,
    });

    const frameIndex = useTransform(smoothScroll, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        const preloadImages = async () => {
            const loadedImages = [];
            let loadedCount = 0;
            const padNumber = (num) => num.toString().padStart(3, "0");

            const promises = Array.from({ length: FRAME_COUNT }).map(async (_, i) => {
                const frameNum = padNumber(i + 1);
                try {
                    const imageModule = await import(`../../assets/sequence/ezgif-frame-${frameNum}.jpg`);
                    const imageUrl = imageModule.default;

                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = () => {
                            loadedCount++;
                            setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
                            loadedImages[i] = img;
                            resolve(true);
                        };
                        img.onerror = () => resolve(false);
                    });
                } catch (error) {
                    return Promise.resolve(false);
                }
            });

            await Promise.all(promises);
            setImages(loadedImages);
        };

        preloadImages();
    }, []);

    const renderCanvas = (index) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || images.length === 0) return;

        const img = images[index] || images[0];
        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    useEffect(() => {
        if (images.length > 0) renderCanvas(0);
    }, [images]);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        renderCanvas(Math.round(latest));
    });

    useEffect(() => {
        const handleResize = () => renderCanvas(Math.round(frameIndex.get()));
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [images, frameIndex]);

    return (
        <div ref={containerRef} className="scroll-container">
            {loadingProgress < 100 && (
                <div className="loader-screen">
                    <div className="loader-bar-bg">
                        <motion.div className="loader-bar-fill" animate={{ width: `${loadingProgress}%` }} />
                    </div>
                    <span className="loader-text">Loading {loadingProgress}%</span>
                </div>
            )}

            <div className="sticky-wrapper">
                <canvas ref={canvasRef} />

                <ContentBlock progress={smoothScroll} range={[0, 0.2]} position="center">
                    <h1 className="main-title">AERO-STRIDE</h1>
                    <p className="sub-title">Zenith Dynamics G1</p>
                </ContentBlock>

                <ContentBlock progress={smoothScroll} range={[0.8, 1]} position="center">
                    <h2 className="feature-title">Transcend Motion</h2>
                    <button className="cta-button">Pre-Order Now</button>
                </ContentBlock>
            </div>
        </div>
    );
}

function ContentBlock({ children, progress, range, position }) {
    const opacity = useTransform(progress, [range[0], (range[0] + range[1]) / 2, range[1]], [0, 1, 0]);
    const y = useTransform(progress, [range[0], range[1]], [20, -20]);

    return (
        <>
        <motion.div style={{ opacity, y }} className={`content-block ${position}`}>
            {children}
        </motion.div>
        </>
    );
}


