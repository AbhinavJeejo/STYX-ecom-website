import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Snackbar, Alert, IconButton, Rating } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "../../styles/userstyles/ProductDetail.css";
import Footer from "../components/Footer";
import { CartContext } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [qtyError, setQtyError] = useState(false);
  const [loginAlert, setLoginAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [dummyReviews, setDummyReviews] = useState([]);

  const dummyUserNames = [
    "Alex Morgan",
    "Jordan Lee", 
    "Taylor Chen",
    "Marcus Rivera",
    "Sam Wilson",
    "Casey Kim",
    "Riley Patel",
    "Morgan Zhang"
  ];

  const getLoggedInUsersReviews = () => {
    const allReviews = JSON.parse(localStorage.getItem("productReviews")) || {};
    const productReviews = allReviews[id] || [];
    return productReviews.filter(review => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      return review.userId && review.userId !== "guest";
    });
  };

  const generateDummyReviews = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const loggedInUsersReviews = getLoggedInUsersReviews();
    
    const baseDummyReviews = [
      {
        id: 1,
        name: "Alex Morgan",
        rating: 5,
        date: "2024-03-15",
        text: "Absolutely stunning craftsmanship. The comfort level is unmatched - feels like walking on clouds. Perfect for my daily runs.",
        verified: true
      },
      {
        id: 2,
        name: "Jordan Lee",
        rating: 4,
        date: "2024-03-10",
        text: "Great quality materials and excellent fit. The design is sleek and modern. Only wish there were more color options.",
        verified: true
      },
      {
        id: 3,
        name: "Taylor Chen",
        rating: 5,
        date: "2024-03-05",
        text: "These exceeded my expectations. The attention to detail is remarkable. Already planning to buy another pair.",
        verified: false
      },
      {
        id: 4,
        name: "Marcus Rivera",
        rating: 3,
        date: "2024-02-28",
        text: "Good overall but runs slightly narrow. Took a few wears to break in completely. Comfortable once broken in though.",
        verified: true
      }
    ];

    const filteredDummyReviews = baseDummyReviews.filter(review => {
      if (!loggedInUser) return true;
      
      const isCurrentUser = review.name.toLowerCase() === loggedInUser.name.toLowerCase();
      const isLoggedInUserReview = loggedInUsersReviews.some(r => 
        r.name.toLowerCase() === review.name.toLowerCase()
      );
      
      return !isCurrentUser && !isLoggedInUserReview;
    });

    const allUserReviews = loggedInUsersReviews.map(review => ({
      id: Date.now() + Math.random(),
      name: review.name,
      rating: review.rating,
      date: review.date || new Date().toISOString().split('T')[0],
      text: review.text,
      verified: true
    }));

    const combinedReviews = [...allUserReviews, ...filteredDummyReviews];
    return combinedReviews.slice(0, 8);
  };

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const found = products.find(p => p.id === Number(id));
    if (!found) navigate("/products");
    else {
      setProduct(found);
      const reviews = generateDummyReviews();
      setDummyReviews(reviews);
    }
  }, [id, navigate]);

  const handleReviewSubmit = () => {
    if (!userRating) return;
    
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      setLoginAlert(true);
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    const allReviews = JSON.parse(localStorage.getItem("productReviews")) || {};
    const productReviews = allReviews[id] || [];
    
    const userAlreadyReviewed = productReviews.some(review => review.userId === user.id);
    if (userAlreadyReviewed) {
      const updatedReviews = productReviews.map(review => 
        review.userId === user.id 
          ? { ...review, rating: userRating, text: userReview, date: new Date().toISOString().split('T')[0] }
          : review
      );
      allReviews[id] = updatedReviews;
    } else {
      const newReview = {
        id: Date.now(),
        userId: user.id,
        name: user.name,
        rating: userRating,
        date: new Date().toISOString().split('T')[0],
        text: userReview || "No comment provided.",
        verified: true
      };
      allReviews[id] = [...productReviews, newReview];
    }
    
    localStorage.setItem("productReviews", JSON.stringify(allReviews));
    
    const updatedDummyReviews = generateDummyReviews();
    setDummyReviews(updatedDummyReviews);
    setReviewSubmitSuccess(true);
    setUserRating(0);
    setUserReview("");
    
    setTimeout(() => setReviewSubmitSuccess(false), 3000);
  };

  const averageRating = dummyReviews.length > 0 
    ? dummyReviews.reduce((acc, review) => acc + review.rating, 0) / dummyReviews.length 
    : 0;

  if (!product) {
    return (
      <div className="loading-container">
        <h2 className="loading-text">Loading...</h2>
      </div>
    );
  }

  const toBag = () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user || user.role === "guest") {
      setLoginAlert(true);
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    if (!product.isActive) return;

    if (qty <= 0) {
      setQtyError(true);
      return;
    }

    addToCart(product, qty);
    setSuccessAlert(true);

    setTimeout(() => navigate("/cart"), 1200);
  };

  return (
    <>
      <div className="product-page">
        <IconButton className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <div className="product-main-layout">
          <div className="product-visuals">
            <div className="image-wrapper">
              <img src={product.image} alt={product.name} />
              {!product.isActive && (
                <div className="stock-overlay">OUT OF STOCK</div>
              )}
            </div>
          </div>

          <div className="product-actions">
            <nav className="breadcrumb">
              {product.category} — {product.audience}
            </nav>

            <h1 className="product-name">{product.name}</h1>

            <div className="price-container">
              <span className="currency">₹</span>
              <span className="price-amount">
                {product.price.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="product-description-section">
              <h3 className="description-label">Product Details</h3>
              <p className="description-text">
                {product.description || `The ${product.name} is engineered for performance and style. 
                Featuring premium materials and signature ${product.category} technology, 
                this pair offers unparalleled comfort for ${product.audience}.`}
              </p>
              </div>

            <div className="purchase-controls">
              <div className="qty-wrapper">
                <span className="label-small">Quantity</span>
                <div className="quantity-selector">
                  <button
                    disabled={!product.isActive}
                    onClick={() => setQty(qty > 0 ? qty - 1 : 0)}
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    disabled={!product.isActive}
                    onClick={() => setQty(qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="add-to-bag-btn"
                disabled={!product.isActive}
                onClick={toBag}
              >
                {product.isActive ? "Add to Bag" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <div className="reviews-summary">
              <div className="rating-overview">
                <div className="average-rating-display">
                  <span className="rating-number">{averageRating.toFixed(1)}</span>
                  <Rating 
                    value={averageRating} 
                    readOnly 
                    precision={0.1}
                    icon={<StarIcon className="rating-star-filled" />}
                    emptyIcon={<StarBorderIcon className="rating-star-empty" />}
                  />
                </div>
                <span className="rating-count">{dummyReviews.length} reviews</span>
              </div>
            </div>
            
            <div className="write-review-container">
              <h3 className="review-form-title">Share Your Experience</h3>
              <div className="rating-input-container">
                <div className="star-selector">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      className={`star-button ${userRating >= star ? 'active' : ''}`}
                      onClick={() => setUserRating(star)}
                    >
                      <StarIcon />
                    </button>
                  ))}
                </div>
                <span className="rating-label">{userRating ? `${userRating}.0 stars` : 'Select rating'}</span>
              </div>
              <div className="review-textarea-wrapper">
                <textarea
                  className="review-textarea"
                  placeholder="Share your thoughts about this product..."
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows={4}
                />
              </div>
              <button 
                className={`submit-review-btn ${!userRating ? 'disabled' : ''}`}
                onClick={handleReviewSubmit}
                disabled={!userRating}
              >
                Submit Review
              </button>
            </div>
          </div>

          <div className="reviews-list">
            {dummyReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-name">{review.name}</div>
                    <div className="review-meta">
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        size="small"
                        icon={<StarIcon className="review-star-filled" />}
                        emptyIcon={<StarBorderIcon className="review-star-empty" />}
                      />
                      <span className="review-date">{review.date}</span>
                      {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
                    </div>
                  </div>
                </div>
                <div className="review-body">
                  <p className="review-text">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Snackbar
        open={qtyError}
        autoHideDuration={2500}
        onClose={() => setQtyError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" variant="filled">
          Please select a quantity
        </Alert>
      </Snackbar>

      <Snackbar
        open={loginAlert}
        autoHideDuration={2000}
        onClose={() => setLoginAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info" variant="filled">
          You need to login first
        </Alert>
      </Snackbar>

      <Snackbar
        open={successAlert}
        autoHideDuration={2000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {qty} {product.name} added to your bag
        </Alert>
      </Snackbar>

      <Snackbar
        open={reviewSubmitSuccess}
        autoHideDuration={3000}
        onClose={() => setReviewSubmitSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Thank you for your review!
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
}

export default ProductDetail;