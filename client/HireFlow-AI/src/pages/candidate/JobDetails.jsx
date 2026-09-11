import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);

                console.log("Job Details:", response.data);

                setJob(response.data.job);
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <h3 className="text-center mt-5">
                Loading job...
            </h3>
        );
    }

    if (!job) {
        return (
            <div className="container mt-5">
                <h3>Job Not Found</h3>

                <button
                    className="btn btn-secondary mt-3"
                    onClick={() => navigate("/candidate/dashboard")}
                >
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            <button
                className="btn btn-secondary mb-4"
                onClick={() => navigate("/candidate/dashboard")}
            >
                ← Back to Jobs
            </button>

            <div className="card shadow-sm">
                <div className="card-body">

                    <h2>{job.title}</h2>

                    <h5 className="text-muted">
                        {job.company}
                    </h5>

                    <hr />

                    <p>
                        <strong>Location:</strong>{" "}
                        {job.location}
                    </p>

                    <p>
                        <strong>Salary:</strong>{" "}
                        ₹{job.salary}
                    </p>

                    <h5 className="mt-4">
                        Job Description
                    </h5>

                    <p>
                        {job.description}
                    </p>

                    <h5 className="mt-4">
                        Required Skills
                    </h5>

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
                        className="btn btn-success mt-4"
                        onClick={() =>
                            navigate(`/candidate/jobs/${job._id}/apply`)
                        }
                    >
                        Apply Now
                    </button>

                </div>
            </div>

        </div>
    );
};

export default JobDetails;