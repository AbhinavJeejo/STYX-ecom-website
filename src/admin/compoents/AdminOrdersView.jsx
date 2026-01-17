import { useEffect, useState } from "react";
import "../../styles/adminstyles/AdminOrder.css"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";

function AdminOrdersView() {
  const [orders, setOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
    setSnackbar({ open: true, msg: "Order status updated", severity: "success" });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }).format(amount);

  return (
    <div className="admin-orders-page">
      <h2>Orders Management</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>#{order.id.toString().slice(-6)}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={order.status || "processing"}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={order.status === "cancelled"}
                >
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                {new Date(order.date).toLocaleDateString("en-IN")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminOrdersView;
