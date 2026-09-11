import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import JobCard from "../../components/candidate/JobCard";


const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [matchingLoading, setMatchingLoading] = useState(false);
    const [matchingError, setMatchingError] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs");

                console.log("Jobs Response:", response.data);

                setJobs(response.data.jobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const findMatchingJobs = async () => {

        try {

            setMatchingLoading(true);
            setMatchingError("");

            const response = await api.get(
                "/applications/ai-job-matches"
            );

            console.log("AI Job Matches:", response.data);
            console.log("Matched Jobs Array:", response.data.jobs);

            setMatchedJobs(response.data.jobs || []);
            console.log(
                "Number of matched jobs:",
                response.data.jobs?.length
            );

        } catch (error) {

            console.log(
                "AI Job Matching Error:",
                error.response?.data || error.message
            );

            setMatchingError(
                error.response?.data?.message ||
                "Failed to find matching jobs"
            );

        } finally {

            setMatchingLoading(false);

        }
    };

    if (loading) {
        return <h3 className="text-center mt-5">Loading jobs...</h3>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                Available Jobs
            </h2>

            {jobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                jobs.map((job) => (
                    <JobCard
                        key={job._id}
                        job={job}
                    />
                ))
            )}

            <div className="mb-4">

                <button
                    className="btn btn-dark"
                    onClick={findMatchingJobs}
                    disabled={matchingLoading}
                >
                    {matchingLoading
                        ? "Finding Matches..."
                        : "🤖 Find Matching Jobs"}
                </button>

            </div>
            {matchingError && (
                <div className="alert alert-danger">
                    {matchingError}
                </div>
            )}

            {matchedJobs.length > 0 && (
                <div className="mt-5">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>
                            <h3 className="mb-1">
                                🤖 AI Recommended Jobs
                            </h3>

                            <p className="text-muted mb-0">
                                Jobs ranked according to your resume
                            </p>
                        </div>

                        <span className="badge bg-dark fs-6">
                            {matchedJobs.length} Matches
                        </span>

                    </div>


                    <div className="row">

                        {matchedJobs.map((item) => (

                            <div
                                className="col-md-6 mb-4"
                                key={item.job._id}
                            >

                                <div className="card shadow-sm h-100 border-0">

                                    <div className="card-body p-4">


                                        {/* Job Title */}

                                        <div className="d-flex justify-content-between align-items-start">

                                            <div>

                                                <h5 className="card-title mb-1">
                                                    {item.job.title}
                                                </h5>

                                                <p className="text-muted mb-2">
                                                    {item.job.company}
                                                </p>

                                            </div>


                                            {/* Match Score */}

                                            <span className="badge bg-success fs-6">

                                                {item.match.matchScore}%

                                            </span>

                                        </div>


                                        <hr />


                                        {/* Job Information */}

                                        <p className="mb-2">

                                            📍 {item.job.location}

                                        </p>

                                        <p className="mb-3">

                                            💰 ₹{item.job.salary}

                                        </p>


                                        {/* Match Level */}

                                        <div className="mb-3">

                                            <strong>
                                                AI Match:
                                            </strong>

                                            <span className="badge bg-primary ms-2">

                                                {item.match.matchLevel}

                                            </span>

                                        </div>


                                        {/* Progress Bar */}

                                        <div className="progress mb-3">

                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${item.match.matchScore}%`
                                                }}
                                            >

                                                {item.match.matchScore}%

                                            </div>

                                        </div>


                                        {/* AI Reason */}

                                        <p className="mb-3">

                                            <strong>
                                                AI Analysis:
                                            </strong>

                                            <br />

                                            <span className="text-muted">
                                                {item.match.reason}
                                            </span>

                                        </p>


                                        {/* Matched Skills */}

                                        <div className="mb-3">

                                            <strong>
                                                Matched Skills
                                            </strong>

                                            <div className="mt-2">

                                                {(item.match.matchedSkills || []).map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                            className="badge bg-success me-1 mb-1"
                                                        >
                                                            ✓ {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* Missing Skills */}

                                        <div className="mb-4">

                                            <strong>
                                                Skills to Improve
                                            </strong>

                                            <div className="mt-2">

                                                {(item.match.missingSkills || []).map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                            className="badge bg-danger me-1 mb-1"
                                                        >
                                                            ✕ {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* View Job Button */}

                                        <button
                                            className="btn btn-dark w-100"
                                            onClick={() =>
                                                navigate(`/jobs/${item.job._id}`)
                                            }
                                        >
                                            View Job & Apply
                                        </button>


                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;