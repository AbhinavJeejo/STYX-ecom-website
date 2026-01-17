import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../styles/userstyles/Cart.css";

function Cart() {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal > 4000 ? 0 : 199;
    const tax = 0;
    const finalTotal = subtotal + shipping + tax;

    const handleRemoveClick = (item) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleConfirmRemove = () => {
        removeFromCart(selectedItem.id);
        setOpenDialog(false);
        setOpenSnackbar(true);
        setSelectedItem(null);
    };

    if (cart.length === 0) {
        return (
            <>
                <IconButton 
                    className="back-button" 
                    onClick={() => navigate(-1)} 
                    aria-label="back"
                >
                    <ArrowBackIcon />
                </IconButton>
                <div className="cart-empty">
                    <h2>Your cart is empty 🛒</h2>
                    <p>Looks like you haven’t added anything yet</p>
                    <button onClick={() => navigate("/")}>Continue Shopping</button>
                </div>
            </>
        );
    }

    return (
        <>
            <IconButton 
                className="back-button" 
                onClick={() => navigate(-1)} 
                aria-label="back"
            >
                <ArrowBackIcon />
            </IconButton>

            <div className="cart-container">
                <h2>Your Cart</h2>

                {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                        <img src={item.image} alt={item.name} className="cart-image" />
                        <div className="cart-info">
                            <h4>{item.name}</h4>
                            <div className="item-details-tags">
                                {item.category && <span className="tag-category">{item.category}</span>}
                                {item.audience && <span className="tag-audience">{item.audience}</span>}
                            </div>
                            <p className="item-price">₹ {item.price}</p>
                        </div>
                        <div className="cart-quantity">
                            <button onClick={() => decreaseQuantity(item.id)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)}>+</button>
                        </div>
                        <button className="remove-btn" onClick={() => handleRemoveClick(item)}>
                            Remove
                        </button>
                    </div>
                ))}

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹ {subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `₹ ${shipping}`}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>₹ {tax}</span>
                    </div>
                    <hr />
                    <div className="summary-row total">
                        <strong>Total</strong>
                        <strong>₹ {finalTotal}</strong>
                    </div>
                    <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                        Proceed to Checkout • ₹ {finalTotal}
                    </button>
                </div>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    PaperProps={{ style: { borderRadius: "16px", padding: "10px" } }}
                >
                    <DialogTitle>Remove Item?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove <strong>{selectedItem?.name}</strong> from your cart?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ padding: "20px" }}>
                        <Button onClick={() => setOpenDialog(false)} sx={{ color: "#666" }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRemove}
                            variant="contained"
                            sx={{ bgcolor: "#d93025", "&:hover": { bgcolor: "#b71c1c" } }}
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert severity="info" variant="filled" onClose={() => setOpenSnackbar(false)}>
                        Item removed from cart
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}

export default Cart;