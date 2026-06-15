import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { registerUser, clearAuthError } from "../redux/authSlice";
import { Film, AlertCircle } from "lucide-react";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset errors on mount
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Navigate if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        setSuccessMsg("Account registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(() => {
        // Handled by Redux error selector
      });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <div className="auth-logo">
          <Film size={32} fill="var(--accent-red)" color="var(--accent-red)" />
          <span>Skillcase</span>
        </div>

        <h2 className="auth-title">Create account</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", textAlign: "center" }}>
          Join the short-video learning network
        </p>

        {/* Success Alert */}
        {successMsg && (
          <div 
            style={{
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              border: "1px solid rgba(46, 204, 113, 0.3)",
              color: "#2ecc71",
              padding: "12px 16px",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Action Error Alerts */}
        {(error || formError) && (
          <div className="alert-error flex align-center gap-6" style={{ margin: 0 }}>
            <AlertCircle size={16} />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="auth-form-group">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading || !!successMsg}>
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>

        <p className="auth-redirect-text">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-blue)" }}>
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
