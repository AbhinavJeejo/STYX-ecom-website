import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../styles/userstyles/Orders.css";
import { Check, Package, Truck, ChevronRight, XCircle, Clock, AlertTriangle, Shield, ShieldAlert } from "lucide-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    Snackbar,
    Alert,
    AlertTitle,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const navigate = useNavigate();

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    useEffect(() => {
        fetchOrders();
    }, [loggedInUser?.id]);

    const fetchOrders = () => {
        setLoading(true);

        setTimeout(() => {
            const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

            const userOrders = loggedInUser
                ? allOrders.filter((order) => order.userId === loggedInUser.id)
                : allOrders.filter((order) => order.userId === "guest");

            // Sort by timestamp if available, otherwise by ID
            const sortedOrders = [...userOrders].sort((a, b) => {
                if (a.timestamp && b.timestamp) {
                    return b.timestamp - a.timestamp;
                }
                if (a.createdAt && b.createdAt) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return b.id - a.id;
            });

            setOrders(sortedOrders);
            setLoading(false);
        }, 500);
    };

    const getOrderStatus = (order) => {
        // If order has status, use it
        if (order.status) return order.status;
        
        // If order needs admin approval and not approved yet
        if (order.adminApproved === false) return "pending";
        
        // Default fallback status based on hash
        const statuses = ["processing", "shipped", "delivered"];
        const hash = order.id
            .toString()
            .split("")
            .reduce((a, b) => a + b.charCodeAt(0), 0);
        return statuses[hash % 3];
    };

    const handleOpenCancel = (id) => {
        setSelectedOrderId(id);
        setOpenConfirm(true);
    };

    const handleConfirmCancel = () => {
        const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

        const updatedOrders = allOrders.map((order) =>
            order.id === selectedOrderId ? { 
                ...order, 
                status: "cancelled",
                updatedAt: new Date().toISOString()
            } : order
        );

        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        const userOrders = loggedInUser
            ? updatedOrders.filter((o) => o.userId === loggedInUser.id)
            : updatedOrders.filter((o) => o.userId === "guest");

        setOrders(userOrders);

        setOpenConfirm(false);
        setSnackbar({
            open: true,
            message: "Order has been cancelled successfully.",
            severity: "error",
        });
    };

    const totalSpentValue = useMemo(() => {
        return orders
            .filter((order) => getOrderStatus(order) === "delivered" && order.adminApproved !== false)
            .reduce((sum, order) => sum + order.total, 0);
    }, [orders]);

    const getStatusColor = (status, order) => {
        if (order.adminApproved === false) return "#f59e0b"; // Amber for pending approval
        
        const colors = {
            delivered: "#10b981",
            processing: "#3b82f6",
            shipped: "#8b5cf6",
            cancelled: "#ef4444",
            pending: "#f59e0b"
        };
        return colors[status] || "#6b7280";
    };

    const getStatusIcon = (status, order) => {
        if (order.adminApproved === false) return <ShieldAlert size={16} />;
        
        switch (status) {
            case "delivered":
                return <Check size={16} />;
            case "processing":
                return <Clock size={16} />;
            case "shipped":
                return <Truck size={16} />;
            case "cancelled":
                return <XCircle size={16} />;
            case "pending":
                return <ShieldAlert size={16} />;
            default:
                return <Package size={16} />;
        }
    };

    const getStatusText = (status, order) => {
        if (order.adminApproved === false) return "Pending Admin Approval";
        
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        return getOrderStatus(order) === filter;
    });

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);

    const formatOrderDate = (order) => {
        // Try multiple date formats to avoid "Invalid Date"
        try {
            // If order has timestamp, use it
            if (order.timestamp) {
                const date = new Date(order.timestamp);
                return date.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }
            
            // If order has createdAt, use it
            if (order.createdAt) {
                const date = new Date(order.createdAt);
                return date.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }
            
            // If order.date is a string, try to parse it
            if (typeof order.date === 'string') {
                // Try to parse various date formats
                const date = new Date(order.date);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                }
                
                // If it's already in a readable format, return as is
                if (order.date.includes(',')) {
                    return order.date.split(',')[0];
                }
            }
            
            // Fallback: Use the order ID to generate a fake date
            const fakeDate = new Date(order.id);
            return fakeDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
        } catch (error) {
            // Ultimate fallback
            return "Recent order";
        }
    };

    const handleTrackOrder = (order) => {
        const status = getOrderStatus(order);
        
        if (order.adminApproved === false) {
            setSnackbar({
                open: true,
                message: "Order is pending admin approval. You can track after approval.",
                severity: "warning",
            });
            return;
        }
        
        let msg = "";
        switch(status) {
            case "processing":
                msg = "Order is being packed and prepared for shipping.";
                break;
            case "shipped":
                msg = `Order #${order.id.toString().slice(-6)} is currently in transit. Estimated delivery: 3-5 business days.`;
                break;
            case "delivered":
                msg = `Order #${order.id.toString().slice(-6)} was delivered successfully.`;
                break;
            default:
                msg = `Order #${order.id.toString().slice(-6)} status: ${status}`;
        }

        setSnackbar({
            open: true,
            message: msg,
            severity: "success",
        });
    };

    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p>Loading your order history...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <IconButton className="back-button" onClick={() => navigate(-1)} aria-label="back">
                <ArrowBackIcon />
            </IconButton>

            <div className="orders-page">
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        <AlertTitle>
                            {snackbar.severity === "success" ? "Tracking Update" : 
                             snackbar.severity === "warning" ? "Notice" : "Update"}
                        </AlertTitle>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirm(false)}>No</Button>
                        <Button onClick={handleConfirmCancel} color="error" autoFocus>
                            Yes, Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="orders-header">
                    <div className="header-content">
                        <h1>My Orders</h1>
                        <p>View and track your previous purchases</p>
                    </div>

                    <div className="orders-stats">
                        <div className="stat-card">
                            <span className="stat-number">{orders.length}</span>
                            <span className="stat-label">Total Orders</span>
                        </div>
                        <div className="stat-card highlight">
                            <span className="stat-number">{formatCurrency(totalSpentValue)}</span>
                            <span className="stat-label">Successful Spending</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">
                                {orders.filter(o => o.adminApproved === false).length}
                            </span>
                            <span className="stat-label">Pending Approval</span>
                        </div>
                    </div>
                </div>

                <div className="orders-filter">
                    {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                            key={status}
                            className={`filter-btn ${filter === status ? "active" : ""}`}
                            onClick={() => setFilter(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status === "pending" && " ⚠️"}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-icon">
                            <Package size={48} />
                        </div>
                        <h2>No orders found</h2>
                        <p>Try changing your filter or start shopping!</p>
                        <button className="primary-btn" onClick={() => navigate("/")}>
                            Go to Store
                        </button>
                    </div>
                ) : (
                    <div className="orders-grid">
                        <AnimatePresence>
                            {filteredOrders.map((order, index) => {
                                const status = getOrderStatus(order);
                                const statusColor = getStatusColor(status, order);
                                const needsApproval = order.adminApproved === false;

                                return (
                                    <motion.div
                                        key={order.id}
                                        className={`order-card ${status === "cancelled" ? "cancelled-dim" : ""} ${needsApproval ? "pending-approval" : ""}`}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="order-card-header">
                                            <div className="order-info">
                                                <div className="order-id">
                                                    <h3>Order #{order.id.toString().slice(-8)}</h3>
                                                    {needsApproval && (
                                                        <div className="pending-badge">
                                                            <ShieldAlert size={12} />
                                                            <span>Awaiting Admin Approval</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="order-status"
                                                    style={{
                                                        backgroundColor: `${statusColor}15`,
                                                        color: statusColor,
                                                        border: `1px solid ${statusColor}30`,
                                                    }}
                                                >
                                                    {getStatusIcon(status, order)}
                                                    <span>{getStatusText(status, order)}</span>
                                                </div>
                                            </div>
                                            <div className="order-date">
                                                {formatOrderDate(order)}
                                            </div>
                                        </div>

                                        <div className="order-items-preview">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="item-preview">
                                                    <img src={item.image} alt={item.name} title={item.name} />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Items Count</span>
                                                <span className="detail-value">{order.items.length} Units</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Payment Method</span>
                                                <span className="detail-value">
                                                    {order.paymentMethod?.toUpperCase() || "Online"}
                                                </span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Final Amount</span>
                                                <span className="detail-value total-amount">
                                                    {formatCurrency(order.total)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="order-actions">
                                            {!needsApproval && (status === "processing" || status === "shipped") && (
                                                <button
                                                    className="action-btn outline"
                                                    onClick={() => handleTrackOrder(order)}
                                                >
                                                    <Truck size={16} /> Track
                                                </button>
                                            )}
                                            {needsApproval && (
                                                <button
                                                    className="action-btn outline"
                                                    disabled
                                                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                                                >
                                                    <ShieldAlert size={16} /> Awaiting Approval
                                                </button>
                                            )}
                                            {!needsApproval && status === "processing" && (
                                                <button
                                                    className="action-btn cancel-btn"
                                                    onClick={() => handleOpenCancel(order.id)}
                                                >
                                                    <AlertTriangle size={16} /> Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </>
    );
}

export default Orders;