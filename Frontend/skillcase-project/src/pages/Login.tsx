import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginUser, clearAuthError } from "../redux/authSlice";
import { Film, AlertCircle } from "lucide-react";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // Clear auth slice error on mount/unmount
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

    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <div className="auth-logo">
          <Film size={32} fill="var(--accent-red)" color="var(--accent-red)" />
          <span>Skillcase</span>
        </div>

        <h2 className="auth-title">Sign in</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", textAlign: "center" }}>
          to continue to Skillcase Shorts
        </p>

        {/* Action Error Alerts */}
        {(error || formError) && (
          <div className="alert-error flex align-center gap-6" style={{ margin: 0 }}>
            <AlertCircle size={16} />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Next"}
          </button>
        </form>

        <p className="auth-redirect-text">
          New to Skillcase?{" "}
          <Link to="/register" style={{ color: "var(--accent-blue)" }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
