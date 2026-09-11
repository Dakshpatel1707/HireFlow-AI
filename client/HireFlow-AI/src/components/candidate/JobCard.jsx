import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {

    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/candidate/jobs/${job._id}`);
    };

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">

                <h4 className="card-title">
                    {job.title}
                </h4>

                <h6 className="text-muted">
                    {job.company}
                </h6>

                <p className="mb-1">
                    📍 {job.location}
                </p>

                <p className="mb-1">
                    💰 ₹{job.salary}
                </p>

                <p className="mt-2">
                    {job.description}
                </p>

                <div>
                    {job.skills?.map((skill, index) => (
                        <span
                            key={index}
                            className="badge bg-primary me-2"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                <button
                    className="btn btn-primary mt-3"
                    onClick={handleViewDetails}
                >
                    View Details
                </button>

            </div>
        </div>
    );
};

export default JobCard;