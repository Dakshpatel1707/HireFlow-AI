import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError(""); setMessage("");
      await api.post("/auth/register", formData);
      setMessage("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="text-center mb-4">
          <div style={{ width: 52, height: 52, background: "#2563eb", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: "#fff", margin: "0 auto 12px" }}>H</div>
          <h5 style={{ color: "#f1f5f9", fontWeight: 800, margin: 0 }}>HireFlow <span style={{ color: "#60a5fa" }}>AI</span></h5>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>AI-Powered Recruitment Platform</p>
        </div>

        <div className="card">
          <div className="card-body">
            <h4 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>Create Account</h4>
            <p className="mb-4" style={{ color: "#64748b", fontSize: "0.875rem" }}>Join HireFlow AI today — it's free</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && <div className="alert alert-success py-2">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" placeholder="Daksh Patel" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label">I am a</label>
                <div className="d-flex gap-3">
                  {["candidate", "recruiter"].map(role => (
                    <div key={role} onClick={() => setFormData({ ...formData, role })}
                      style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1.5px solid ${formData.role === role ? "#2563eb" : "#334155"}`, background: formData.role === role ? "#172554" : "#0f172a", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{role === "candidate" ? "👨‍💼" : "🏢"}</div>
                      <div style={{ color: formData.role === role ? "#93c5fd" : "#64748b", fontWeight: 600, fontSize: "0.875rem", textTransform: "capitalize" }}>{role}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ padding: "11px", borderRadius: 8, fontWeight: 700 }} disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</> : "Create Account"}
              </button>
            </form>

            <p className="text-center mt-4 mb-0" style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Already have an account? <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
