import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const statusClass = { Applied: "status-applied", Pending: "status-pending", Shortlisted: "status-shortlisted", Rejected: "status-rejected", Accepted: "status-accepted" };

const getAISuggestion = (score) => {
  if (score >= 80) return { text: "Suggest Shortlist", color: "#10b981" };
  if (score >= 60) return { text: "Review Candidate", color: "#f59e0b" };
  return { text: "Suggest Reject", color: "#ef4444" };
};

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchApplications(); }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true); setError("");
      const r = await api.get(`/applications/job/${jobId}`);
      setApplications(r.data.applications || []);
    } catch (e) { setError(e.response?.data?.message || "Failed to load applications."); }
    finally { setLoading(false); }
  };

  const downloadResume = async (applicationId) => {
    try {
      const r = await api.get(`/applications/download/${applicationId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url; link.download = "candidate-resume.pdf";
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) { alert(e.response?.data?.message || "Failed to download resume."); }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      await api.put(`/applications/status/${applicationId}`, { status });
      setApplications(prev => prev.map(a => a._id === applicationId ? { ...a, status } : a));
    } catch (e) { alert(e.response?.data?.message || "Failed to update status."); }
    finally { setUpdatingId(null); }
  };

  const getAIRanking = async () => {
    try {
      setRankingLoading(true); setRankingError("");
      const r = await api.get(`/applications/ai-ranking/${jobId}`);
      setRankedCandidates(r.data.candidates || []);
    } catch (e) { setRankingError(e.response?.data?.message || "Failed to generate AI ranking"); }
    finally { setRankingLoading(false); }
  };

  if (loading) return (
    <div className="hf-page text-center py-5">
      <div className="spinner-border text-primary" style={{ width: 40, height: 40 }}></div>
      <p className="mt-3" style={{ color: "#64748b" }}>Loading applications...</p>
    </div>
  );

  return (
    <div className="hf-page">
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <Link to="/recruiter/dashboard" className="btn btn-sm" style={{ background: "#334155", color: "#94a3b8", borderRadius: 8, fontWeight: 600 }}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </Link>
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#f1f5f9" }}>Job Applications</h2>
          <p style={{ color: "#64748b", margin: 0 }}>{applications.length} total applicants</p>
        </div>
      </div>

      {/* AI Ranking Card */}
      <div className="card hf-ai-card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-start gap-3 mb-3">
            <div style={{ width: 44, height: 44, borderRadius: 11, background: "#2e1065", border: "1px solid #5b21b6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
            <div>
              <h5 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>AI Candidate Ranking</h5>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>Rank all candidates by AI resume analysis and ATS score</p>
            </div>
          </div>
          <button className="btn px-4" style={{ background: "#4338ca", color: "#fff", borderRadius: 8, fontWeight: 700 }} onClick={getAIRanking} disabled={rankingLoading}>
            {rankingLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Ranking candidates...</> : <><i className="bi bi-bar-chart me-2"></i>Generate AI Ranking</>}
          </button>
          {rankingError && <div className="alert alert-danger mt-3 py-2">{rankingError}</div>}
        </div>
      </div>

      {/* AI Ranked Table */}
      {rankedCandidates.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3" style={{ color: "#f1f5f9" }}>🏆 AI Ranked Candidates</h5>
            <div className="table-responsive">
              <table className="table">
                <thead><tr>
                  <th>Rank</th><th>Candidate</th><th>Email</th><th>AI Score</th><th>Recommendation</th><th>AI Suggestion</th><th>Action</th>
                </tr></thead>
                <tbody>
                  {rankedCandidates.map((app, i) => {
                    const suggestion = getAISuggestion(app.aiAnalysis?.score);
                    return (
                      <tr key={app._id}>
                        <td><strong style={{ color: "#f1f5f9" }}>#{i + 1}</strong></td>
                        <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{app.candidate?.name || "Candidate"}</td>
                        <td style={{ color: "#94a3b8" }}>{app.candidate?.email || "N/A"}</td>
                        <td><strong style={{ color: "#4ade80" }}>{app.aiAnalysis?.score}%</strong></td>
                        <td style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{app.aiAnalysis?.recommendation || "N/A"}</td>
                        <td><strong style={{ color: suggestion.color }}>{suggestion.text}</strong></td>
                        <td><Link to={`/recruiter/applications/${app._id}`} className="btn btn-sm btn-outline-primary" style={{ borderRadius: 8 }}>View</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {!error && applications.length === 0 && <div className="alert alert-info">No applications received yet for this job.</div>}

      {/* Application Cards */}
      {applications.map(app => (
        <div key={app._id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1e3a5f", border: "1px solid #2d4a7a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>
                  {app.candidate?.name?.slice(0, 2).toUpperCase() || "CA"}
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#f1f5f9" }}>{app.candidate?.name || "Candidate"}</h5>
                  <p className="mb-0" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{app.candidate?.email}</p>
                </div>
              </div>
              <span className={statusClass[app.status] || "status-applied"}>{app.status}</span>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3" style={{ fontSize: "0.8rem", color: "#64748b" }}>
              <span><i className="bi bi-calendar me-1"></i>Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              {app.resume && <span style={{ color: "#10b981" }}><i className="bi bi-file-earmark-pdf me-1"></i>Resume uploaded</span>}
            </div>

            {app.aiAnalysis?.score != null && (
              <div className="mb-3 p-3" style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #334155" }}>
                <div className="d-flex gap-4 flex-wrap">
                  <span style={{ fontSize: "0.875rem" }}><strong style={{ color: "#c4b5fd" }}>🤖 AI Score:</strong> <strong style={{ color: "#4ade80" }}>{app.aiAnalysis.score}%</strong></span>
                  <span style={{ fontSize: "0.875rem" }}><strong style={{ color: "#c4b5fd" }}>Recommendation:</strong> <span style={{ color: "#f1f5f9" }}>{app.aiAnalysis.recommendation}</span></span>
                </div>
                <div className="progress mt-2" style={{ height: 6 }}><div className="progress-bar" style={{ width: `${app.aiAnalysis.score}%` }}></div></div>
              </div>
            )}

            <div className="d-flex flex-wrap gap-2">
              <Link to={`/recruiter/applications/${app._id}`} className="btn btn-sm btn-outline-primary" style={{ borderRadius: 8 }}>View Details</Link>
              {app.resume && (
                <button className="btn btn-sm" style={{ background: "#334155", color: "#94a3b8", borderRadius: 8, border: "none" }} onClick={() => downloadResume(app._id)}>
                  <i className="bi bi-download me-1"></i>Resume
                </button>
              )}
              {["Pending", "Shortlisted", "Rejected"].map(status => (
                <button key={status} className={`btn btn-sm ${status === "Shortlisted" ? "btn-primary" : status === "Rejected" ? "btn-danger" : ""}`}
                  style={{ borderRadius: 8, ...(status === "Pending" ? { background: "#334155", color: "#fcd34d", border: "1px solid #92400e" } : {}) }}
                  disabled={updatingId === app._id} onClick={() => updateStatus(app._id, status)}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobApplications;
