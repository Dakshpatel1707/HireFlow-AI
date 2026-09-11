import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Application statistics
    const [totalApplications, setTotalApplications] = useState(0);
    const [totalShortlisted, setTotalShortlisted] = useState(0);
    const [totalRejected, setTotalRejected] = useState(0);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/jobs/my/jobs");

            console.log("My Jobs Response:", response.data);

            const recruiterJobs = response.data.jobs || [];

            setJobs(recruiterJobs);

            // Get application statistics
            await fetchApplicationStatistics(recruiterJobs);

        } catch (error) {
            console.error("Recruiter Jobs Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load your jobs."
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch applications for all recruiter jobs
    const fetchApplicationStatistics = async (recruiterJobs) => {
        try {
            let applicationsCount = 0;
            let shortlistedCount = 0;
            let rejectedCount = 0;

            for (const job of recruiterJobs) {
                try {
                    const response = await api.get(
                        `/applications/job/${job._id}`
                    );

                    const applications =
                        response.data.applications || [];

                    applicationsCount += applications.length;

                    applications.forEach((application) => {
                        if (application.status === "Shortlisted") {
                            shortlistedCount++;
                        }

                        if (application.status === "Rejected") {
                            rejectedCount++;
                        }
                    });

                } catch (error) {
                    // If one job has no applications,
                    // continue checking other jobs.
                    console.log(
                        `No applications found for job ${job._id}`
                    );
                }
            }

            setTotalApplications(applicationsCount);
            setTotalShortlisted(shortlistedCount);
            setTotalRejected(rejectedCount);

        } catch (error) {
            console.error(
                "Application Statistics Error:",
                error
            );
        }
    };

    // Delete job
    const handleDeleteJob = async (jobId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/jobs/${jobId}`);

            // Remove deleted job from frontend
            const remainingJobs = jobs.filter(
                (job) => job._id !== jobId
            );

            setJobs(remainingJobs);

            // Refresh statistics
            await fetchApplicationStatistics(remainingJobs);

        } catch (error) {
            console.error("Delete Job Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job."
            );
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="container mt-5">
                <h2>Recruiter Dashboard</h2>

                <p className="text-muted">
                    Loading your jobs...
                </p>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold">
                        Recruiter Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your posted jobs and applications.
                    </p>
                </div>

                <Link
                    to="/recruiter/jobs/create"
                    className="btn btn-success"
                >
                    + Post New Job
                </Link>

            </div>

            {/* Statistics */}
            <div className="row mb-4">

                {/* Total Jobs */}
                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Jobs
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {jobs.length}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Total Applications */}
                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Applications
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {totalApplications}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Shortlisted */}
                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Shortlisted
                            </h6>

                            <h2 className="fw-bold text-primary mb-0">
                                {totalShortlisted}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Rejected */}
                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Rejected
                            </h6>

                            <h2 className="fw-bold text-danger mb-0">
                                {totalRejected}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* No Jobs */}
            {!error && jobs.length === 0 && (
                <div className="alert alert-info">
                    You have not posted any jobs yet.
                </div>
            )}

            {/* Job Cards */}
            <div className="row">

                {jobs.map((job) => (

                    <div
                        className="col-lg-6 mb-4"
                        key={job._id}
                    >

                        <div className="card shadow-sm border-0 h-100">

                            <div className="card-body d-flex flex-column">

                                {/* Job Header */}
                                <div className="mb-3">

                                    <h4 className="fw-bold mb-2">
                                        {job.title}
                                    </h4>

                                    <p className="text-muted mb-1">
                                        <strong>
                                            {job.company}
                                        </strong>
                                    </p>

                                    <p className="text-muted mb-1">
                                        📍 {job.location}
                                    </p>

                                    <p className="text-success fw-semibold mb-0">
                                        ₹{job.salary}
                                    </p>

                                </div>

                                <hr />

                                {/* Description */}
                                <div className="mb-3">

                                    <h6 className="fw-bold">
                                        Job Description
                                    </h6>

                                    <p className="text-muted">
                                        {job.description}
                                    </p>

                                </div>

                                {/* Skills */}
                                {job.skills &&
                                    job.skills.length > 0 && (

                                        <div className="mb-4">

                                            <h6 className="fw-bold mb-2">
                                                Required Skills
                                            </h6>

                                            <div>

                                                {job.skills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                            className="badge bg-primary me-2 mb-2"
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>
                                    )}

                                {/* Buttons */}
                                <div className="mt-auto">

                                    <Link
                                        to={`/recruiter/jobs/${job._id}/applications`}
                                        className="btn btn-primary me-2"
                                    >
                                        View Applications
                                    </Link>

                                    <Link
                                        to={`/recruiter/jobs/${job._id}/edit`}
                                        className="btn btn-warning me-2"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleDeleteJob(job._id)
                                        }
                                    >
                                        Delete
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