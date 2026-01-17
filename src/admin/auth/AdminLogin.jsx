import "../../styles/adminstyles/AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import data from "../../data/data.json";

function AdminLogin() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");

  function adminLogedIn(e) {
    e.preventDefault();

    if (!mail || !pass) {
      alert("Fill all fields");
      return;
    }

    const admin = data.admins.find(
      (a) => a.email === mail && a.password === pass
    );

    if (!admin) {
      alert("Invalid admin credentials");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(admin));
    localStorage.setItem("role", "admin");

    navigate("/admindashboard");
    setMail("");
    setPass("");
  }

  return (
    <div className="admin-login-container">
  <div className="admin-login-card">
    <h2>Admin Login</h2>
    <form onSubmit={adminLogedIn}>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input 
          id="email"
          type="email" 
          placeholder="admin@company.com"
          value={mail} 
          onChange={(e) => setMail(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="••••••••"
          value={pass} 
          onChange={(e) => setPass(e.target.value)} 
          required 
        />
      </div>

      <button type="submit" className="login-button">
        Login to Dashboard
      </button>
    </form>
  </div>
</div>
  );
}

export default AdminLogin;
