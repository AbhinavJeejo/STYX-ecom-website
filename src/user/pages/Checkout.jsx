import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../../styles/userstyles/Checkout.css";
import PaymentSuccess from "../components/PaymentSuccess";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [selectedBank, setSelectedBank] = useState("");
    const [activeStep, setActiveStep] = useState(1);
    const [cardErrors, setCardErrors] = useState({});
    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanComplete, setScanComplete] = useState(false);
    const scanIntervalRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        upiId: "",
    });

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCharge = subtotal < 4000 ? 199 : 0;
    const tax = 0;
    const totalAmount = subtotal + shippingCharge + tax;

    useEffect(() => {
        if (paymentMethod === "netbanking" && !selectedBank) {
            setSelectedBank("SBI");
        }
        
        return () => {
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
            }
        };
    }, [paymentMethod]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "cardNumber") {
            const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
            setFormData((prev) => ({ ...prev, [name]: formatted }));
            
            if (value.replace(/\s/g, "").length === 16) {
                setCardErrors(prev => ({ ...prev, cardNumber: "" }));
            }
            return;
        }
        
        if (name === "expiry") {
            let formatted = value.replace(/\D/g, "");
            if (formatted.length >= 2) {
                formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
            }
            setFormData((prev) => ({ ...prev, [name]: formatted }));
            
            if (formatted.length === 5) {
                setCardErrors(prev => ({ ...prev, expiry: "" }));
            }
            return;
        }
        
        if (name === "cvv") {
            const formatted = value.replace(/\D/g, "").slice(0, 3);
            setFormData((prev) => ({ ...prev, [name]: formatted }));
            
            if (formatted.length === 3) {
                setCardErrors(prev => ({ ...prev, cvv: "" }));
            }
            return;
        }
        
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateShipping = () => {
        const required = ["name", "email", "address", "city", "pincode"];
        return required.every(field => formData[field].trim() !== "");
    };

    const validateCard = () => {
        const errors = {};
        const cleanCard = formData.cardNumber.replace(/\s/g, "");
        
        if (cleanCard.length !== 16) errors.cardNumber = "Card number must be 16 digits";
        if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = "Use MM/YY format";
        if (formData.cvv.length !== 3) errors.cvv = "CVV must be 3 digits";
        
        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateUpi = () => {
        return formData.upiId.includes("@") && formData.upiId.length > 5;
    };

    const startScanner = () => {
        setScanning(true);
        setScanComplete(false);
        setScanProgress(0);
        
        scanIntervalRef.current = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(scanIntervalRef.current);
                    setScanComplete(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const stopScanner = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
        }
        setScanning(false);
        setScanProgress(0);
        setScanComplete(false);
    };

    const nextStep = () => {
        if (activeStep === 1 && validateShipping()) {
            setActiveStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevStep = () => {
        setActiveStep(1);
    };

    const handlePayment = (e) => {
        e.preventDefault();
        
        if (cart.length === 0) return;
        
        if (paymentMethod === "card" && !validateCard()) return;
        if (paymentMethod === "upi" && !validateUpi()) return;
        if (paymentMethod === "netbanking" && !selectedBank) return;

        setProcessing(true);

        setTimeout(() => {
            const orders = JSON.parse(localStorage.getItem("orders")) || [];
            const user = JSON.parse(localStorage.getItem("loggedInUser"));

            const newOrder = {
                id: Date.now(),
                userId: user?.id || "guest",
                items: cart,
                subtotal,
                shipping: shippingCharge,
                total: totalAmount,
                date: new Date().toLocaleString("en-IN"),
                paymentMethod,
                bankName: selectedBank,
                shippingAddress: { ...formData },
            };

            orders.push(newOrder);
            localStorage.setItem("orders", JSON.stringify(orders));

            clearCart();

            setProcessing(false);
            setPaymentSuccess(true);
        }, 2000);
    };

    if (paymentSuccess) {
        return <PaymentSuccess formData={formData} />;
    }

    if (cart.length === 0) {
        return (
            <div className="empty-state">
                <div style={{ fontSize: "50px" }}>🛒</div>
                <h2>Your cart is empty</h2>
                <button className="primary-btn" onClick={() => navigate("/")}>
                    Back to Store
                </button>
            </div>
        );
    }

    return (
        <>
            <IconButton className="back-button" onClick={() => navigate(-1)} aria-label="back">
                <ArrowBackIcon />
            </IconButton>

            <div className="checkout-page">
                <div className="checkout-layout">
                    <div className="main-content">
                        <div className="checkout-steps">
                            <div className={`step ${activeStep === 1 ? "active" : "completed"}`} onClick={() => setActiveStep(1)}>
                                Shipping
                            </div>
                            <div className={`step ${activeStep === 2 ? "active" : ""}`}>
                                Payment
                            </div>
                        </div>

                        {activeStep === 1 ? (
                            <div className="shipping-form">
                                <h3>Shipping Information</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className={formData.name ? "filled" : ""}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className={formData.email ? "filled" : ""}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className={formData.phone ? "filled" : ""}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            required
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="400001"
                                            className={formData.pincode ? "filled" : ""}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Street, Area"
                                        className={formData.address ? "filled" : ""}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Mumbai"
                                            className={formData.city ? "filled" : ""}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Maharashtra"
                                            className={formData.state ? "filled" : ""}
                                        />
                                    </div>
                                </div>
                                <button className="continue-btn" onClick={nextStep} disabled={!validateShipping()}>
                                    Continue to Payment
                                </button>
                            </div>
                        ) : (
                            <div className="payment-methods">
                                <div className="step-header">
                                    <button className="back-step-btn" onClick={prevStep}>← Back</button>
                                    <h3>Payment Method</h3>
                                </div>
                                
                                <div className="method-options">
                                    <div
                                        className={`method-option ${paymentMethod === "card" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("card")}
                                    >
                                        <span className="method-icon">💳</span>
                                        <span>Card</span>
                                    </div>
                                    <div
                                        className={`method-option ${paymentMethod === "upi" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("upi")}
                                    >
                                        <span className="method-icon">📱</span>
                                        <span>UPI</span>
                                    </div>
                                    <div
                                        className={`method-option ${paymentMethod === "cod" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("cod")}
                                    >
                                        <span className="method-icon">📦</span>
                                        <span>COD</span>
                                    </div>
                                    <div
                                        className={`method-option ${paymentMethod === "netbanking" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("netbanking")}
                                    >
                                        <span className="method-icon">🏦</span>
                                        <span>Bank</span>
                                    </div>
                                </div>

                                <form onSubmit={handlePayment}>
                                    {paymentMethod === "card" && (
                                        <div className="card-form">
                                            <div className="form-group">
                                                <label>Card Number</label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                    className={cardErrors.cardNumber ? "error" : formData.cardNumber ? "filled" : ""}
                                                />
                                                {cardErrors.cardNumber && <span className="error-message">{cardErrors.cardNumber}</span>}
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        value={formData.expiry}
                                                        onChange={handleInputChange}
                                                        placeholder="MM/YY"
                                                        maxLength="5"
                                                        className={cardErrors.expiry ? "error" : formData.expiry ? "filled" : ""}
                                                    />
                                                    {cardErrors.expiry && <span className="error-message">{cardErrors.expiry}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label>CVV</label>
                                                    <input
                                                        type="password"
                                                        name="cvv"
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                        placeholder="123"
                                                        maxLength="3"
                                                        className={cardErrors.cvv ? "error" : formData.cvv ? "filled" : ""}
                                                    />
                                                    {cardErrors.cvv && <span className="error-message">{cardErrors.cvv}</span>}
                                                </div>
                                            </div>
                                            <div className="card-logos">
                                                <span className="card-logo">💳</span>
                                                <span className="card-logo">VISA</span>
                                                <span className="card-logo">MC</span>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "upi" && (
                                        <div className="upi-form">
                                            <div className="form-group">
                                                <label>UPI ID</label>
                                                <input
                                                    type="text"
                                                    name="upiId"
                                                    value={formData.upiId}
                                                    onChange={handleInputChange}
                                                    placeholder="username@upi"
                                                    required
                                                    className={formData.upiId ? "filled" : ""}
                                                />
                                            </div>
                                            <div className="upi-scanner-section">
                                                <h4>Scan QR Code</h4>
                                                <div className="scanner-container">
                                                    <div className="scanner-viewfinder">
                                                        <div className="scanner-screen">
                                                            {scanning ? (
                                                                <>
                                                                    <div className="scanner-overlay">
                                                                        <div className="scanner-line" style={{ top: `${scanProgress}%` }}></div>
                                                                        <div className="scanner-progress">
                                                                            <div className="progress-fill" style={{ width: `${scanProgress}%` }}></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="scanner-qr">
                                                                        <div className="qr-pattern qr-top-left"></div>
                                                                        <div className="qr-pattern qr-top-right"></div>
                                                                        <div className="qr-pattern qr-bottom-left"></div>
                                                                        <div className="qr-data"></div>
                                                                    </div>
                                                                </>
                                                            ) : scanComplete ? (
                                                                <div className="scan-success">
                                                                    <div className="success-icon">✓</div>
                                                                    <p>Payment Request Sent!</p>
                                                                    <p className="success-amount">₹{totalAmount.toLocaleString()}</p>
                                                                </div>
                                                            ) : (
                                                                <div className="qr-placeholder-static">
                                                                    <div className="qr-static">
                                                                        <div className="qr-static-inner">
                                                                            <div className="qr-static-pattern"></div>
                                                                            <div className="qr-static-pattern"></div>
                                                                            <div className="qr-static-pattern"></div>
                                                                            <div className="qr-static-center"></div>
                                                                        </div>
                                                                    </div>
                                                                    <p className="scanner-info">Scan with any UPI app</p>
                                                                    <p className="scanner-amount">₹{totalAmount.toLocaleString()}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="scanner-controls">
                                                            {scanning ? (
                                                                <button type="button" className="scanner-btn stop-btn" onClick={stopScanner}>
                                                                    Stop Scan
                                                                </button>
                                                            ) : (
                                                                <button type="button" className="scanner-btn start-btn" onClick={startScanner}>
                                                                    {scanComplete ? "Scan Again" : "Start Scanner"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="upi-apps">
                                                    <span className="upi-app">GPay</span>
                                                    <span className="upi-app">PhonePe</span>
                                                    <span className="upi-app">Paytm</span>
                                                    <span className="upi-app">BHIM</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "cod" && (
                                        <div className="cod-notice">
                                            <div className="cod-icon">💰</div>
                                            <p>Pay ₹{totalAmount.toLocaleString()} when your order arrives</p>
                                            <p className="cod-info">Cash or UPI accepted at delivery</p>
                                        </div>
                                    )}

                                    {paymentMethod === "netbanking" && (
                                        <div className="netbanking-form">
                                            <div className="form-group">
                                                <label>Select Your Bank</label>
                                                <select
                                                    className="bank-select"
                                                    required
                                                    value={selectedBank}
                                                    onChange={(e) => setSelectedBank(e.target.value)}
                                                >
                                                    <option value="SBI">State Bank of India</option>
                                                    <option value="HDFC">HDFC Bank</option>
                                                    <option value="ICICI">ICICI Bank</option>
                                                    <option value="Axis">Axis Bank</option>
                                                    <option value="Kotak">Kotak Mahindra</option>
                                                </select>
                                            </div>
                                            <div className="bank-details-fields">
                                                <div className="form-group">
                                                    <label>Account Number</label>
                                                    <input type="text" placeholder="Enter Account Number" required />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>IFSC Code</label>
                                                        <input type="text" placeholder="BANK0001234" required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Account Holder Name</label>
                                                        <input type="text" placeholder="Name on bank records" required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="terms-agreement">
                                        <input type="checkbox" id="terms" required />
                                        <label htmlFor="terms">I agree to the Terms and Conditions</label>
                                    </div>

                                    <button type="submit" className="pay-now-btn" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <span className="spinner"></span> Processing...
                                            </>
                                        ) : (
                                            `Pay ₹${totalAmount.toLocaleString()}`
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="summary-section">
                        <h3>Order Summary</h3>
                        <div className="summary-list">
                            {cart.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-img-wrapper">
                                        <img src={item.image} alt={item.name} />
                                        <span className="item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="item-info">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-price">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="item-total">₹{(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>

                        <div className="price-details">
                            <div className="detail-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Shipping {subtotal < 4000 && "(Orders under ₹4,000)"}</span>
                                <span className={shippingCharge === 0 ? "free" : ""}>
                                    {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span>Tax (GST 0%)</span>
                                <span>₹0</span>
                            </div>
                            {subtotal < 4000 && (
                                <div className="free-shipping-bar">
                                    <div className="bar-bg">
                                        <div 
                                            className="bar-fill" 
                                            style={{ width: `${Math.min((subtotal / 4000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="info-note">Add ₹{(4000 - subtotal).toLocaleString()} more for FREE shipping!</p>
                                </div>
                            )}
                            <div className="detail-row total">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="secure-payment">
                            <span className="secure-icon">🔒</span>
                            <div>
                                <p>Secure Checkout</p>
                                <p className="secure-sub">100% Encrypted transactions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;