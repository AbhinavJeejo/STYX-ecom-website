import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../../styles/userstyles/auth.css";

function Register() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({ msg: "", severity: "info" });
  const navigate = useNavigate();

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  function RegisterSubmit(e) {
    e.preventDefault();

    if (!name || !mail || !pass || !cpass) {
      setStatus({ msg: "Please fill all fields", severity: "warning" });
      setOpen(true);
      return;
    }

    if (!accepted) {
      setStatus({ msg: "Accept guidelines to continue", severity: "info" });
      setOpen(true);
      return;
    }

    if (pass !== cpass) {
      setStatus({ msg: "Passwords do not match", severity: "error" });
      setOpen(true);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email === mail);

    if (exists) {
      setStatus({ msg: "Email already registered", severity: "error" });
      setOpen(true);
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email: mail,
      password: pass,
      role: "user",
      isActive: true,
      isBlocked: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setStatus({ msg: "Registration successful", severity: "success" });
    setOpen(true);

    setTimeout(() => navigate("/login"), 1200);
  }

  return (
    <div className="page">
      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={RegisterSubmit}>
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>E-mail</label>
          <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} />

          <label>Password</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />

          <label>Confirm Password</label>
          <input type="password" value={cpass} onChange={(e) => setCpass(e.target.value)} />

          <div className="terms-container">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <label>
              I accept the <span className="guideline-link" onClick={() => setShowModal(true)}>Guidelines</span>
            </label>
          </div>

          <Button type="submit" variant="contained" fullWidth disabled={!accepted}>
            Register
          </Button>

          <p>
            Already have an account?
            <button type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          </p>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="guideline-modal">
              <h2>Community Guidelines</h2>
              <div className="guideline-content">
                <p>1. Provide accurate personal information for order fulfillment.</p>
                <p>2. Maintain the confidentiality of your account credentials.</p>
                <p>3. Use the platform for legitimate purchasing purposes only.</p>
                <p>4. Respect intellectual property and brand trademarks.</p>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)}>Got it</button>
            </div>
          </div>
        )}

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert severity={status.severity} variant="filled">
            {status.msg}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Register;