import React from "react";
import { Zap, Star, ShieldCheck, Globe, Truck, CreditCard, Award } from "lucide-react";
import "../../styles/userstyles/Upcoming.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Upcoming = () => {
    const sandals = [
        { id: 1, name: "STYX 'AETHER' SLIDE", price: "899", tag: "Limited Run", image: "https://images.unsplash.com/photo-1603487788393-23315548311f?q=80&w=1000&auto=format&fit=crop" },
        { id: 2, name: "STYX 'VOLT' GLADIATOR", price: "999", tag: "Pre-sale Exclusive", image: "https://images.unsplash.com/photo-1621213348651-70086377771f?q=80&w=1000&auto=format&fit=crop" },
        { id: 3, name: "STYX 'NOIR' SANDAL", price: "499", tag: "Early Bird", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop" },
        { id: 4, name: "STYX 'ZENITH' MULE", price: "749", tag: "Signature Series", image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=1000&auto=format&fit=crop" },
        { id: 5, name: "STYX 'CHRONOS' STRAP", price: "599", tag: "Few Units Left", image: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=1000&auto=format&fit=crop" },
        { id: 6, name: "STYX 'ORBIT' SLIDER", price: "699", tag: "Hot Seller", image: "https://images.unsplash.com/photo-1627315534882-9993355554f6?q=80&w=1000&auto=format&fit=crop" }
    ];

    return (
        <div>
            <Navbar />
            <div className="upcoming-root">
                <div className="upcoming-container">
                    <header className="hero-section">
                        <div className="glow-orb"></div>
                        <h2 className="brand-tagline">STYX SHOES PRESENTS</h2>
                        <h1 className="hero-title">SANDAL <span className="gradient-text">REVOLUTION</span></h1>
                        
                        <div className="countdown-timer">
                            <div className="timer-box"><span>12</span><label>Days</label></div>
                            <div className="timer-box"><span>14</span><label>Hours</label></div>
                            <div className="timer-box"><span>45</span><label>Mins</label></div>
                        </div>
                        
                        <button className="notify-btn">
                            GET EXCLUSIVE ACCESS <Zap size={16} fill="currentColor" />
                        </button>
                    </header>

                    <div className="upcoming-grid">
                        {sandals.map((item) => (
                            <div key={item.id} className="sandal-card">
                                <div className="card-badge">{item.tag}</div>
                                <div className="image-frame">
                                    <img src={item.image} alt={item.name} loading="lazy" />
                                    <div className="overlay-info">
                                        <button className="preorder-btn">PRE-ORDER NOW</button>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <div className="details-header">
                                        <h3>{item.name}</h3>
                                        <div className="rating-pill"><Star size={10} fill="currentColor"/> 5.0</div>
                                    </div>
                                    <div className="price-row">
                                        <span className="upcoming-price">₹{item.price}</span>
                                        <span className="launch-label">JAN 2026</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <section className="partners-section">
                        <h3 className="partners-title">OFFICIAL BRAND PARTNERS</h3>
                        <div className="partners-grid">
                            <div className="partner-item">
                                <Globe size={32} />
                                <span>Global Logistics</span>
                            </div>
                            <div className="partner-item">
                                <ShieldCheck size={32} />
                                <span>Verified Secure</span>
                            </div>
                            <div className="partner-item">
                                <Award size={32} />
                                <span>Quality Certified</span>
                            </div>
                            <div className="partner-item">
                                <Truck size={32} />
                                <span>Prime Delivery</span>
                            </div>
                            <div className="partner-item">
                                <CreditCard size={32} />
                                <span>Easy Finance</span>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
            </div>
    );
};

export default Upcoming;