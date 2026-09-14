import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statusClass = { Applied: "status-applied", Pending: "status-pending", Shortlisted: "status-shortlisted", Rejected: "status-rejected", Accepted: "status-accepted", Hired: "status-hired" };

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/applications/my")
      .then(r => setApplications(r.data.applications || []))
      .catch(e => setError(e.response?.data?.message || "Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="hf-page text-center py-5">
      <div className="spinner-border text-primary" style={{ width: 40, height: 40 }}></div>
      <p className="mt-3" style={{ color: "#64748b" }}>Loading applications...</p>
    </div>
  );

  return (
    <div className="hf-page">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold" style={{ color: "#f1f5f9" }}>My Applications</h2>
          <p style={{ color: "#64748b", margin: 0 }}>{applications.length} total applications</p>
        </div>
        <Link to="/candidate/dashboard" className="btn" style={{ background: "#334155", color: "#94a3b8", borderRadius: 8, fontWeight: 600 }}>
          <i className="bi bi-search me-2"></i>Browse Jobs
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {applications.length === 0 ? (
        <div className="card text-center py-5">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
          <h5 style={{ color: "#f1f5f9" }}>No applications yet</h5>
          <p style={{ color: "#64748b" }}>Start applying to jobs to see them here</p>
          <Link to="/candidate/dashboard" className="btn btn-primary mx-auto" style={{ width: "fit-content", borderRadius: 8 }}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="row g-3">
          {applications.map(app => (
            <div key={app._id} className="col-md-6">
              <div className="card hf-job-card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>{app.job?.title}</h5>
                    <span className={statusClass[app.status] || "status-applied"}>{app.status}</span>
                  </div>
                  <p className="mb-1" style={{ color: "#94a3b8", fontSize: "0.875rem" }}><i className="bi bi-building me-1"></i>{app.job?.company}</p>
                  <div className="d-flex gap-3 mb-3" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    <span><i className="bi bi-geo-alt me-1"></i>{app.job?.location}</span>
                    <span><i className="bi bi-currency-rupee me-1"></i>{app.job?.salary}</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 12 }}>
                    <i className="bi bi-calendar me-1"></i>Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <Link to={`/candidate/applications/${app._id}`} className="btn btn-primary btn-sm mt-auto" style={{ borderRadius: 8 }}>
                    View Details <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
