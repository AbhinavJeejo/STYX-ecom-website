import { useEffect, useState } from "react";
import { Snackbar, Alert, Switch, FormControlLabel } from "@mui/material";
import productsData from "../../data/data.json";
import "../../styles/adminstyles/AdminViewProducts.css";

const CATEGORIES = ["Sports", "Casual", "Formals"];
const AUDIENCE = ["Men", "Women", "Kids"];

function AdminViewProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({ open: false, msg: "", severity: "success" });

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Sports",
    audience: "Men",
    image: "",
    isActive: true
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products"));
    if (stored?.length) {
      setProducts(stored);
    } else {
      const seeded = productsData.products.map(p => ({ ...p, isActive: true }));
      setProducts(seeded);
      localStorage.setItem("products", JSON.stringify(seeded));
    }
  }, []);

  const triggerAlert = (msg, severity = "success") => {
    setAlert({ open: true, msg, severity });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  function openAddModal() {
    setEditingProduct(null);
    setFormData({ name: "", price: "", category: "Sports", audience: "Men", image: "", isActive: true });
    setShowModal(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  }

  const saveProduct = () => {
    if (!formData.name || !formData.price || !formData.image) {
      triggerAlert("All fields are required", "error");
      return;
    }

    let updated = editingProduct
      ? products.map(p => p.id === editingProduct.id ? { ...formData } : p)
      : [...products, { ...formData, id: Date.now() }];

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setShowModal(false);
    triggerAlert(editingProduct ? "Product details updated" : "New product registered");
  };

  const removeProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setShowModal(false);
    triggerAlert("Item deleted permanently", "info");
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Inventory Studio</h2>
        <button className="btn-add" onClick={openAddModal}>New Collection +</button>
      </div>

      <div className="filter-bar">
        {["All", ...CATEGORIES].map(cat => (
          <button
            key={cat}
            className={`filter-tab ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-card-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Target</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={product.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                  <strong>{product.name}</strong>
                </td>
                <td>{product.category}</td>
                <td>{product.audience}</td>
                <td>₹{Number(product.price).toLocaleString()}</td>
                <td>
                  <span className={`stock-toggle ${product.isActive ? "in-stock" : "out-stock"}`}>
                    {product.isActive ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td>
                  <button onClick={() => openEditModal(product)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '700' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            <h2 style={{ marginTop: 0 }}>{editingProduct ? "Edit Product Details" : "Add New Entry"}</h2>
            
            <div className="image-preview-box">
              {formData.image ? <img src={formData.image} alt="Preview" /> : <span style={{color: '#94a3b8'}}>Image Preview</span>}
            </div>

            <input className="form-input" style={{marginBottom: '15px'}} placeholder="Product Name" name="name" value={formData.name} onChange={handleChange} />
            <input className="form-input" style={{marginBottom: '15px'}} placeholder="Image URL" name="image" value={formData.image} onChange={handleChange} />

            <div className="modal-grid">
              <input className="form-input" placeholder="Price" name="price" type="number" value={formData.price} onChange={handleChange} />
              <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="modal-grid">
              <select className="form-select" name="audience" value={formData.audience} onChange={handleChange}>
                {AUDIENCE.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <div className="toggle-container">
                <span style={{fontSize: '14px', fontWeight: '600'}}>Available</span>
                <Switch checked={formData.isActive} onChange={handleToggle} color="primary" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-add" style={{ flex: 2 }} onClick={saveProduct}>Save Product</button>
              <button className="filter-tab" style={{ flex: 1, border: '1px solid #e5e7eb' }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>

            {editingProduct && (
              <button onClick={() => removeProduct(editingProduct.id)} style={{ marginTop: '15px', width: '100%', padding: '10px', background: 'none', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
                Delete Product
              </button>
            )}
          </div>
        </div>
      )}

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity} variant="filled">{alert.msg}</Alert>
      </Snackbar>
    </div>
  );
}

export default AdminViewProducts;