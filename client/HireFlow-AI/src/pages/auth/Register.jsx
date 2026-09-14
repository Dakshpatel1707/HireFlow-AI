import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError("");
      const response = await api.post("/auth/login", { email, password });
      loginUser(response.data.user, response.data.token);
      if (response.data.user.role === "candidate") navigate("/candidate/dashboard");
      else if (response.data.user.role === "recruiter") navigate("/recruiter/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div style={{ width: 52, height: 52, background: "#2563eb", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: "#fff", margin: "0 auto 12px" }}>H</div>
          <h5 style={{ color: "#f1f5f9", fontWeight: 800, margin: 0 }}>HireFlow <span style={{ color: "#60a5fa" }}>AI</span></h5>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>AI-Powered Recruitment Platform</p>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: "2rem !important" }}>
            <h4 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>Welcome back</h4>
            <p className="mb-4" style={{ color: "#64748b", fontSize: "0.875rem" }}>Sign in to your account</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ padding: "11px", borderRadius: 8, fontWeight: 700 }} disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : "Sign In"}
              </button>
            </form>

            <p className="text-center mt-4 mb-0" style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Don't have an account? <Link to="/register" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
