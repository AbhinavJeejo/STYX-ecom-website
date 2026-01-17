import { useEffect, useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, PeopleAlt, Shield, Person, Cancel } from "@mui/icons-material";
import "../../styles/adminstyles/AdminUserView.css";

function AdminUserView() {
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const updateUsers = (updated) => {
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const toggleBlockUser = (id) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, isBlocked: !u.isBlocked } : u
    );
    updateUsers(updated);
  };

  const softDeleteUser = (id) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, isActive: false } : u
    );
    updateUsers(updated);
  };

  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskPassword = (password, isVisible) => {
    if (!password) return "••••••••";
    return isVisible ? password : "••••••••";
  };

  const activeUsers = users.filter(u => u.isActive !== false);

  const stats = {
    total: activeUsers.length,
    admins: activeUsers.filter(u => u.role?.toLowerCase() === "admin").length,
    customers: activeUsers.filter(u => u.role?.toLowerCase() !== "admin").length
  };

  if (activeUsers.length === 0) {
    return (
      <div className="admin-users-container">
        <div className="empty-state">
          <PeopleAlt sx={{ fontSize: 50, mb: 2, color: "#cbd5e1" }} />
          <h3>No registered users found</h3>
          <p>Users will appear here once they sign up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-header">
        <h2 className="admin-title">User Management</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Administrators</span>
          <span className="stat-value">{stats.admins}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Regular Users</span>
          <span className="stat-value">{stats.customers}</span>
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact Info</th>
              <th>Security</th>
              <th>Permissions</th>
              <th>Account ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map(user => (
              <tr key={user.id}>
                <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: "700" }}>{user.name}</span>
                </td>

                <td>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    {user.email}
                  </span>
                </td>

                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                      {maskPassword(user.password, visiblePasswords[user.id])}
                    </code>
                    <IconButton size="small" onClick={() => togglePassword(user.id)}>
                      {visiblePasswords[user.id] ? <VisibilityOff fontSize="inherit" /> : <Visibility fontSize="inherit" />}
                    </IconButton>
                  </div>
                </td>

                <td>
                  <span className={`role-badge ${user.role?.toLowerCase() === "admin" ? "role-admin" : "role-user"}`}>
                    {user.role?.toLowerCase() === "admin" ? <Shield sx={{ fontSize: 12, mr: 0.5 }} /> : <Person sx={{ fontSize: 12, mr: 0.5 }} />}
                    {user.role || "User"}
                  </span>
                </td>

                <td>
                  <span style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "0.8rem" }}>
                    #{user.id?.toString().slice(-6)}
                  </span>
                </td>

                <td>
                  <Tooltip title={user.isBlocked ? "Unblock User" : "Block User"}>
                    <IconButton onClick={() => toggleBlockUser(user.id)}>
                      {user.isBlocked ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Deactivate User">
                    <IconButton onClick={() => softDeleteUser(user.id)}>
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserView;
