import { useNavigate } from "react-router-dom";

const getStatusColor = (type) => {
  const map = { "Full-time": "#2563eb", "Part-time": "#f59e0b", "Internship": "#8b5cf6", "Remote": "#10b981" };
  return map[type] || "#64748b";
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="hf-job-card card mb-3" style={{ cursor: "pointer" }} onClick={() => navigate(`/candidate/jobs/${job._id}`)}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="fw-bold mb-1" style={{ color: "#f1f5f9" }}>{job.title}</h5>
            <p className="mb-0" style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              <i className="bi bi-building me-1"></i>{job.company}
            </p>
          </div>
          {job.jobType && (
            <span style={{ background: getStatusColor(job.jobType) + "22", color: getStatusColor(job.jobType), border: `1px solid ${getStatusColor(job.jobType)}44`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
              {job.jobType}
            </span>
          )}
        </div>

        <div className="d-flex flex-wrap gap-3 mb-3" style={{ fontSize: "0.875rem", color: "#64748b" }}>
          <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
          <span><i className="bi bi-currency-rupee me-1"></i>{job.salary}</span>
          {job.experienceLevel && <span><i className="bi bi-briefcase me-1"></i>{job.experienceLevel}</span>}
        </div>

        {job.description && (
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {job.description}
          </p>
        )}

        <div className="d-flex flex-wrap gap-1 mb-3">
          {job.skills?.slice(0, 5).map((skill, i) => (
            <span key={i} style={{ background: "#172554", color: "#93c5fd", border: "1px solid #1e40af", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 500 }}>{skill}</span>
          ))}
          {job.skills?.length > 5 && <span style={{ color: "#64748b", fontSize: 11 }}>+{job.skills.length - 5} more</span>}
        </div>

        <button className="btn btn-primary btn-sm" style={{ borderRadius: 8, fontWeight: 600 }}
          onClick={(e) => { e.stopPropagation(); navigate(`/candidate/jobs/${job._id}`); }}>
          View Details <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};

export default JobCard;
