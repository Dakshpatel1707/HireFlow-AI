import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Hero */}
      <section className="hf-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-primary mb-3" style={{ fontSize: "0.75rem", padding: "6px 14px" }}>
                <i className="bi bi-stars me-1"></i>AI-Powered Recruitment Platform
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ color: "#f1f5f9", lineHeight: 1.15 }}>
                Find the Right Job.<br />
                <span style={{ color: "#2563eb" }}>Hire</span> the Right Talent.
              </h1>
              <p className="mb-5" style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7 }}>
                HireFlow AI connects candidates with top opportunities and helps recruiters discover the best talent using AI-powered resume analysis, ATS scoring, and smart job matching.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to={user?.role === "candidate" ? "/candidate/dashboard" : "/register"} className="btn btn-primary btn-lg px-4" style={{ borderRadius: 10, fontWeight: 700 }}>
                  <i className="bi bi-search me-2"></i>Find Jobs
                </Link>
                <Link to={user?.role === "recruiter" ? "/recruiter/jobs/create" : "/register"} className="btn btn-lg px-4"
                  style={{ background: "transparent", border: "1px solid #475569", color: "#94a3b8", borderRadius: 10, fontWeight: 700 }}>
                  <i className="bi bi-briefcase me-2"></i>Post a Job
                </Link>
              </div>
              {/* Stats */}
              <div className="d-flex flex-wrap gap-4 mt-5">
                {[["500+", "Jobs Posted"], ["200+", "Companies"], ["1000+", "Candidates"], ["AI", "Powered"]].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563eb" }}>{val}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="fw-bold mb-4" style={{ color: "#f1f5f9" }}>Why HireFlow AI?</h5>
                  {[
                    { icon: "bi-robot", color: "#2563eb", title: "AI Resume Analysis", desc: "Analyze strengths, weaknesses and skill matches instantly." },
                    { icon: "bi-bullseye", color: "#10b981", title: "Smart Job Matching", desc: "Match your resume with the best-fit opportunities." },
                    { icon: "bi-graph-up", color: "#8b5cf6", title: "ATS Scoring", desc: "Know your ATS score before applying anywhere." },
                    { icon: "bi-people", color: "#f59e0b", title: "AI Candidate Ranking", desc: "Recruiters get AI-ranked candidates automatically." },
                  ].map(({ icon, color, title, desc }) => (
                    <div key={title} className="d-flex gap-3 mb-3">
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
                        <i className={`bi ${icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f1f5f9" }}>{title}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 0", background: "#0f172a" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: "#f1f5f9" }}>Everything You Need</h2>
            <p style={{ color: "#64748b" }}>One platform for candidates, recruiters, and AI.</p>
          </div>
          <div className="row g-4">
            {[
              { icon: "bi-person-badge", color: "#2563eb", title: "For Candidates", items: ["Search & browse all jobs", "Apply with resume upload", "Get AI ATS analysis", "Track application status", "AI-powered job matching"] },
              { icon: "bi-building", color: "#10b981", title: "For Recruiters", items: ["Post job openings", "Manage all applications", "AI candidate ranking", "Shortlist or reject", "Application statistics"] },
              { icon: "bi-cpu", color: "#8b5cf6", title: "AI Features", items: ["Resume analysis & scoring", "ATS compatibility check", "Candidate ranking", "Job-resume matching", "Hiring recommendation"] },
            ].map(({ icon, color, title, items }) => (
              <div key={title} className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "22", border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 22, marginBottom: 16 }}>
                      <i className={`bi ${icon}`}></i>
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: "#f1f5f9" }}>{title}</h5>
                    <ul className="list-unstyled">
                      {items.map(item => (
                        <li key={item} className="mb-2 d-flex align-items-center gap-2" style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                          <i className="bi bi-check-circle-fill" style={{ color, fontSize: 12 }}></i>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 0", background: "linear-gradient(135deg, #1e3a5f, #1e293b)" }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ color: "#f1f5f9" }}>Ready to Start?</h2>
          <p className="mb-4" style={{ color: "#94a3b8" }}>Join HireFlow AI — find your dream job or your next hire today.</p>
          <Link to="/register" className="btn btn-primary btn-lg px-5" style={{ borderRadius: 10, fontWeight: 700 }}>
            Get Started Free <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
