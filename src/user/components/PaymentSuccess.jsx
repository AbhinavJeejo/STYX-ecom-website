import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/userstyles/PaymentSuccess.css";

// MUI Imports
import { Snackbar, Alert, AlertTitle, Slide } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

function PaymentSuccess({ formData }) {
    const [showScratchCard, setShowScratchCard] = useState(false);
    const [scratchCardRevealed, setScratchCardRevealed] = useState(false);
    const [scratchCardMessage, setScratchCardMessage] = useState("");
    const [isScratching, setIsScratching] = useState(false);
    const [scratchProgress, setScratchProgress] = useState(0);
    const [orderDetails, setOrderDetails] = useState(null);

    // MUI Snackbar State
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const latestOrder = allOrders[allOrders.length - 1];
        setOrderDetails(latestOrder);

        const timer = setTimeout(() => {
            setShowScratchCard(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const scratchCardMessages = [
        "🎉 Congratulations! You won 20% off on your next purchase!",
        "✨ You won FREE shipping on your next order!",
        "🎁 You won 500 bonus points!",
        "💝 Special gift: Early access to new collections!",
        "⭐ You won a surprise gift on your next visit!",
        "❌ Better luck next time!",
        "😔 Try again on your next purchase!",
        "🍀 No luck this time, but keep trying!",
    ];

    const getRandomMessage = () => {
        const messages = [...scratchCardMessages];
        for (let i = 0; i < 3; i++) {
            messages.push("❌ Better luck next time!");
        }
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#e9ecef";
        for (let i = 0; i < canvas.width; i += 30) {
            for (let j = 0; j < canvas.height; j += 30) {
                ctx.beginPath();
                ctx.arc(i + 15, j + 15, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.fillStyle = "#495057";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
        ctx.font = "12px Arial";
        ctx.fillText("Use mouse/finger to reveal gift", canvas.width / 2, canvas.height / 2 + 25);
    };

    const handleScratch = (e) => {
        if (scratchCardRevealed || !isScratching) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        let x, y;
        if (e.type.includes("mouse")) {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        } else {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        const progress = (transparentPixels / (pixels.length / 4)) * 100;
        setScratchProgress(Math.min(100, Math.round(progress)));

        if (progress > 40 && !scratchCardRevealed) {
            revealScratchCard();
        }
    };

    const revealScratchCard = () => {
        setIsScratching(false);
        setScratchCardRevealed(true);
        const message = getRandomMessage();
        setScratchCardMessage(message);

        // MUI Alert for scratch result
        const isWin = !message.includes("Better luck");
        setSnackbar({
            open: true,
            message: isWin ? "You won a prize! Copy your code now." : "No prize this time. Try again later!",
            severity: isWin ? "success" : "info",
        });
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbar({
            open: true,
            message: "Coupon code copied to clipboard!",
            severity: "success",
        });
    };

    const resetScratchCard = () => {
        setScratchCardRevealed(false);
        setScratchProgress(0);
        setScratchCardMessage("");
        initializeCanvas();
    };

    useEffect(() => {
        if (showScratchCard && canvasRef.current) {
            initializeCanvas();
        }
    }, [showScratchCard]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <div className="success-overlay">
            {/* Premium MUI Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <div className="success-card">
                <div className="success-animation">
                    <div className="checkmark">
                        <CheckCircleOutlineIcon sx={{ fontSize: 50, color: "white" }} />
                    </div>
                </div>

                <h2>Order Placed Successfully! 🎉</h2>

                <div className="order-details-box">
                    {orderDetails && (
                        <>
                            <div className="detail-item">
                                <span className="label">Order ID:</span>
                                <span className="value">#{orderDetails.id.toString().slice(-8)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Total Amount:</span>
                                <span className="value">{formatCurrency(orderDetails.total)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Date:</span>
                                <span className="value">{new Date(orderDetails.date).toLocaleDateString("en-IN")}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Payment Method:</span>
                                <span className="value">{orderDetails.paymentMethod || "Credit Card"}</span>
                            </div>
                        </>
                    )}
                    {formData?.email && (
                        <div className="detail-item">
                            <span className="label">Email:</span>
                            <span className="value">{formData.email}</span>
                        </div>
                    )}
                </div>

                {showScratchCard && (
                    <div className="scratch-card-section">
                        <h3>🎁 Reward Earned!</h3>
                        <p className="scratch-instruction">Scratch to reveal your coupon</p>

                        <div className="scratch-card-container">
                            <div className={`scratch-card ${scratchCardRevealed ? "revealed" : ""}`}>
                                <canvas
                                    ref={canvasRef}
                                    width={300}
                                    height={150}
                                    className="scratch-canvas"
                                    onMouseDown={() => setIsScratching(true)}
                                    onMouseUp={() => setIsScratching(false)}
                                    onMouseMove={handleScratch}
                                    onTouchStart={() => setIsScratching(true)}
                                    onTouchEnd={() => setIsScratching(false)}
                                    onTouchMove={handleScratch}
                                />

                                {scratchCardRevealed && (
                                    <div className="scratch-result">
                                        <div className="result-icon">
                                            {scratchCardMessage.includes("Better luck") ? "😔" : "🎉"}
                                        </div>
                                        <div className="result-message">{scratchCardMessage}</div>
                                        {!scratchCardMessage.includes("Better luck") && (
                                            <div className="coupon-code">
                                                Code: <strong>GIFT{Date.now().toString().slice(-6)}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!scratchCardRevealed && (
                                    <div className="scratch-progress">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${scratchProgress}%` }}></div>
                                        </div>
                                        <span className="progress-text">{scratchProgress}% revealed</span>
                                    </div>
                                )}
                            </div>

                            <div className="scratch-tools">
                                <button
                                    className="tool-btn"
                                    onClick={() => handleCopyCode("GIFT" + Date.now().toString().slice(-6))}
                                    disabled={!scratchCardRevealed || scratchCardMessage.includes("Better luck")}
                                >
                                    📋 Copy Code
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="success-actions">
                    <button className="primary-btn" onClick={() => navigate("/orders")}>
                        View Orders
                    </button>
                    <button className="secondary-btn" onClick={() => navigate("/")}>
                        Shop More
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;
