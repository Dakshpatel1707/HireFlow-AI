import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import JobCard from "../../components/candidate/JobCard";
import AuthContext from "../../context/AuthContext";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState("");

  useEffect(() => {
    api.get("/jobs").then(r => setJobs(r.data.jobs)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const findMatchingJobs = async () => {
    try {
      setMatchingLoading(true); setMatchingError("");
      const r = await api.get("/applications/ai-job-matches");
      setMatchedJobs(r.data.jobs || []);
    } catch (e) { setMatchingError(e.response?.data?.message || "Failed to find matching jobs"); }
    finally { setMatchingLoading(false); }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) return (
    <div className="hf-page text-center py-5">
      <div className="spinner-border text-primary" style={{ width: 40, height: 40 }}></div>
      <p className="mt-3" style={{ color: "#64748b" }}>Loading jobs...</p>
    </div>
  );

  return (
    <div className="hf-page">
      {/* Greeting */}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: "#f1f5f9" }}>{greeting}, <span style={{ color: "#2563eb" }}>{user?.name?.split(" ")[0]}</span> 👋</h2>
        <p style={{ color: "#64748b", margin: 0 }}>Discover your next opportunity</p>
      </div>

      {/* Search + AI Button */}
      <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
        <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
          <i className="bi bi-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569" }}></i>
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Search jobs, companies, locations..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn hf-ai-card px-4" style={{ border: "1px solid #4338ca", color: "#c4b5fd", fontWeight: 600, borderRadius: 8 }}
          onClick={findMatchingJobs} disabled={matchingLoading}>
          {matchingLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Finding matches...</> : <><i className="bi bi-robot me-2"></i>AI Match Jobs</>}
        </button>
      </div>

      {matchingError && <div className="alert alert-danger">{matchingError}</div>}

      {/* AI Matched Jobs */}
      {matchedJobs.length > 0 && (
        <div className="mb-5">
          <div className="d-flex align-items-center gap-3 mb-3">
            <h4 className="fw-bold mb-0" style={{ color: "#f1f5f9" }}><i className="bi bi-robot me-2" style={{ color: "#8b5cf6" }}></i>AI Recommended Jobs</h4>
            <span style={{ background: "#2e1065", color: "#c4b5fd", border: "1px solid #5b21b6", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{matchedJobs.length} matches</span>
          </div>
          <div className="row g-3">
            {matchedJobs.map(item => (
              <div className="col-md-6" key={item.job._id}>
                <div className="card h-100 hf-ai-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>{item.job.title}</h5>
                        <p className="mb-0" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{item.job.company}</p>
                      </div>
                      <span style={{ background: "#052e16", color: "#4ade80", border: "1px solid #166534", borderRadius: 20, padding: "3px 10px", fontSize: 13, fontWeight: 700 }}>{item.match.matchScore}%</span>
                    </div>
                    <div className="d-flex gap-3 mb-3" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      <span><i className="bi bi-geo-alt me-1"></i>{item.job.location}</span>
                      <span><i className="bi bi-currency-rupee me-1"></i>{item.job.salary}</span>
                    </div>
                    <div className="progress mb-3"><div className="progress-bar" style={{ width: `${item.match.matchScore}%` }}></div></div>
                    <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: 12 }}><strong style={{ color: "#c4b5fd" }}>AI Analysis:</strong> {item.match.reason}</p>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {(item.match.matchedSkills || []).map((s, i) => <span key={i} style={{ background: "#052e16", color: "#4ade80", border: "1px solid #166534", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>✓ {s}</span>)}
                      {(item.match.missingSkills || []).map((s, i) => <span key={i} style={{ background: "#450a0a", color: "#fca5a5", border: "1px solid #7f1d1d", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>✕ {s}</span>)}
                    </div>
                    <button className="btn btn-primary btn-sm w-100" style={{ borderRadius: 8 }} onClick={() => navigate(`/jobs/${item.job._id}`)}>View & Apply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr style={{ borderColor: "#334155", margin: "2rem 0" }} />
        </div>
      )}

      {/* All Jobs */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-bold mb-0" style={{ color: "#f1f5f9" }}>Available Jobs</h4>
        <span style={{ color: "#64748b", fontSize: "0.875rem" }}>{filtered.length} jobs found</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-5">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <h5 style={{ color: "#f1f5f9" }}>No jobs found</h5>
          <p style={{ color: "#64748b" }}>Try a different search term</p>
        </div>
      ) : (
        filtered.map(job => <JobCard key={job._id} job={job} />)
      )}
    </div>
  );
};

export default CandidateDashboard;
