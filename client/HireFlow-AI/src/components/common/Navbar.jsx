import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "12px 0", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div style={{ width: 34, height: 34, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>H</div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#fff" }}>HireFlow <span style={{ color: "#60a5fa" }}>AI</span></span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link to="/" className="nav-link px-3" style={{ color: "#94a3b8", fontWeight: 500 }}>Home</Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link to={user.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard"}
                  className="nav-link px-3" style={{ color: "#94a3b8", fontWeight: 500 }}>
                  Dashboard
                </Link>
              </li>
            )}

            {user?.role === "candidate" && (
              <li className="nav-item">
                <Link to="/candidate/applications" className="nav-link px-3" style={{ color: "#94a3b8", fontWeight: 500 }}>
                  My Applications
                </Link>
              </li>
            )}

            {user?.role === "recruiter" && (
              <li className="nav-item">
                <Link to="/recruiter/jobs/create" className="nav-link px-3" style={{ color: "#94a3b8", fontWeight: 500 }}>
                  Post Job
                </Link>
              </li>
            )}

            {user ? (
              <li className="nav-item ms-2">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e3a5f", border: "1px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>
                    {user.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <button className="btn btn-sm" onClick={handleLogout}
                    style={{ background: "transparent", border: "1px solid #475569", color: "#94a3b8", fontWeight: 600, borderRadius: 8, padding: "5px 14px" }}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item ms-1">
                  <Link to="/login" className="btn btn-sm btn-outline-light" style={{ fontWeight: 600, borderRadius: 8, padding: "6px 16px" }}>Login</Link>
                </li>
                <li className="nav-item ms-1">
                  <Link to="/register" className="btn btn-sm btn-primary" style={{ fontWeight: 600, borderRadius: 8, padding: "6px 16px" }}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
