import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/userstyles/auth.css";

function Login() {
  const [mail, setMail] = useState("");
  const [pword, setPword] = useState("");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({ msg: "", severity: "info" });
  const navigate = useNavigate();

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  function handleGuestLogin() {
    const guest = {
      id: "guest",
      name: "Guest User",
      email: "guest@example.com",
      role: "guest"
    };

    localStorage.setItem("loggedInUser", JSON.stringify(guest));
    setStatus({ msg: "Continuing as Guest", severity: "info" });
    setOpen(true);

    setTimeout(() => {
      window.dispatchEvent(new Event("user-changed"));
      navigate("/");
    }, 1000);
  }

  function LoginSubmit(e) {
    e.preventDefault();

    if (!mail.trim() || !pword.trim()) {
      setStatus({ msg: "Please fill all fields", severity: "warning" });
      setOpen(true);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === mail.trim() && u.password === pword.trim()
    );

    if (!user) {
      setStatus({ msg: "Invalid email or password", severity: "error" });
      setOpen(true);
      return;
    }

    if (user.isActive === false) {
      setStatus({ msg: "Account deactivated. Contact admin.", severity: "error" });
      setOpen(true);
      return;
    }

    if (user.isBlocked === true) {
      setStatus({ msg: "Account blocked by admin.", severity: "error" });
      setOpen(true);
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setStatus({ msg: "Login successful", severity: "success" });
    setOpen(true);
    window.dispatchEvent(new Event("user-changed"));

    setTimeout(() => {
      navigate("/");
    }, 1200);
  }

  return (
    <div className="userlogin-container">
      <form className="userlogin" onSubmit={LoginSubmit}>
        <h2>Login</h2>

        <label>E-mail</label>
        <input 
          type="email" 
          required 
          value={mail} 
          onChange={(e) => setMail(e.target.value)} 
        />

        <label>Password</label>
        <input 
          type="password" 
          required 
          value={pword} 
          onChange={(e) => setPword(e.target.value)} 
        />

        <Button 
          type="submit" 
          variant="contained" 
          className="login-btn"
          fullWidth
        >
          Login
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button 
          variant="outlined" 
          className="guest-btn"
          fullWidth 
          onClick={handleGuestLogin}
        >
          Continue as Guest
        </Button>

        <p>
          Don't have an account?
          <button 
            type="button" 
            onClick={() => navigate("/register")} 
            className="register-link-btn"
          >
            Register
          </button>
        </p>
      </form>

      <Snackbar 
        open={open} 
        autoHideDuration={4000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: "80px !important",
          "& .MuiAlert-root": {
            borderRadius: "8px !important",
            fontSize: "0.9rem",
            fontWeight: 500,
            padding: "8px 16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            "& .MuiAlert-icon": {
              fontSize: "1.2rem"
            }
          },
          "& .MuiAlert-filledSuccess": {
            backgroundColor: "#0a0a0a !important",
            color: "#ffffff !important"
          },
          "& .MuiAlert-filledError": {
            backgroundColor: "#d32f2f !important",
            color: "#ffffff !important"
          },
          "& .MuiAlert-filledWarning": {
            backgroundColor: "#ed6c02 !important",
            color: "#ffffff !important"
          },
          "& .MuiAlert-filledInfo": {
            backgroundColor: "#0288d1 !important",
            color: "#ffffff !important"
          }
        }}
      >
        <Alert 
          severity={status.severity} 
          variant="filled" 
          onClose={handleClose}
          sx={{ 
            width: "100%",
            maxWidth: "400px",
            "& .MuiAlert-message": {
              padding: "4px 0"
            }
          }}
        >
          {status.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;