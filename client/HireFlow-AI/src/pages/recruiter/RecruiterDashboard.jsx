import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AuthContext from "../../context/AuthContext";

const statusColor = { Applied: "#2563eb", Pending: "#f59e0b", Shortlisted: "#8b5cf6", Rejected: "#ef4444", Accepted: "#10b981" };

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalShortlisted, setTotalShortlisted] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);

  useEffect(() => { fetchMyJobs(); }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true); setError("");
      const r = await api.get("/jobs/my/jobs");
      const recruiterJobs = r.data.jobs || [];
      setJobs(recruiterJobs);
      await fetchStats(recruiterJobs);
    } catch (e) { setError(e.response?.data?.message || "Failed to load jobs."); }
    finally { setLoading(false); }
  };

  const fetchStats = async (recruiterJobs) => {
    let apps = 0, shortlisted = 0, rejected = 0;
    for (const job of recruiterJobs) {
      try {
        const r = await api.get(`/applications/job/${job._id}`);
        const list = r.data.applications || [];
        apps += list.length;
        shortlisted += list.filter(a => a.status === "Shortlisted").length;
        rejected += list.filter(a => a.status === "Rejected").length;
      } catch (_) {}
    }
    setTotalApplications(apps); setTotalShortlisted(shortlisted); setTotalRejected(rejected);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      const remaining = jobs.filter(j => j._id !== jobId);
      setJobs(remaining);
      await fetchStats(remaining);
    } catch (e) { alert(e.response?.data?.message || "Failed to delete."); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return (
    <div className="hf-page text-center py-5">
      <div className="spinner-border text-primary" style={{ width: 40, height: 40 }}></div>
      <p className="mt-3" style={{ color: "#64748b" }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div className="hf-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold" style={{ color: "#f1f5f9" }}>{greeting}, <span style={{ color: "#2563eb" }}>{user?.name?.split(" ")[0]}</span> 👋</h2>
          <p style={{ color: "#64748b", margin: 0 }}>Manage your jobs and applications</p>
        </div>
        <Link to="/recruiter/jobs/create" className="btn btn-primary" style={{ borderRadius: 8, fontWeight: 700 }}>
          <i className="bi bi-plus-lg me-2"></i>Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Jobs", val: jobs.length, icon: "bi-briefcase", color: "#2563eb" },
          { label: "Total Applications", val: totalApplications, icon: "bi-file-text", color: "#10b981" },
          { label: "Shortlisted", val: totalShortlisted, icon: "bi-star", color: "#8b5cf6" },
          { label: "Rejected", val: totalRejected, icon: "bi-x-circle", color: "#ef4444" },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className="col-6 col-md-3">
            <div className="hf-stat-card">
              <div className="hf-stat-icon" style={{ background: color + "22", color }}>
                <i className={`bi ${icon}`} style={{ fontSize: 20 }}></i>
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                <div style={{ color: "#f1f5f9", fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.2 }}>{val}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {!error && jobs.length === 0 && (
        <div className="card text-center py-5">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h5 style={{ color: "#f1f5f9" }}>No jobs posted yet</h5>
          <p style={{ color: "#64748b" }}>Post your first job to start receiving applications</p>
          <Link to="/recruiter/jobs/create" className="btn btn-primary mx-auto" style={{ width: "fit-content", borderRadius: 8 }}>Post a Job</Link>
        </div>
      )}

      {/* Job Cards */}
      <div className="row g-3">
        {jobs.map(job => (
          <div key={job._id} className="col-lg-6">
            <div className="card hf-job-card h-100">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>{job.title}</h5>
                    <span style={{ background: "#052e16", color: "#4ade80", border: "1px solid #166534", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Active</span>
                  </div>
                  <p className="mb-1" style={{ color: "#94a3b8", fontSize: "0.875rem" }}><i className="bi bi-building me-1"></i>{job.company}</p>
                  <div className="d-flex gap-3" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
                    <span style={{ color: "#10b981", fontWeight: 600 }}><i className="bi bi-currency-rupee me-1"></i>{job.salary}</span>
                  </div>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.description}</p>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {job.skills?.slice(0, 4).map((s, i) => <span key={i} style={{ background: "#172554", color: "#93c5fd", border: "1px solid #1e40af", borderRadius: 20, padding: "2px 8px", fontSize: 11 }}>{s}</span>)}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Link to={`/recruiter/jobs/${job._id}/applications`} className="btn btn-primary btn-sm" style={{ borderRadius: 8, flex: 1 }}>
                    <i className="bi bi-people me-1"></i>Applications
                  </Link>
                  <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn btn-sm" style={{ borderRadius: 8, background: "#334155", color: "#94a3b8", border: "none" }}>
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <button className="btn btn-sm" style={{ borderRadius: 8, background: "#450a0a", color: "#f87171", border: "1px solid #7f1d1d" }} onClick={() => handleDelete(job._id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
