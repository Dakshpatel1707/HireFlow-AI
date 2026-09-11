import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const JobApplications = () => {
    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // AI Ranking
    const [rankedCandidates, setRankedCandidates] = useState([]);
    const [rankingLoading, setRankingLoading] = useState(false);
    const [rankingError, setRankingError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);

    // Get applications when page loads
    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    // Get all applications for this job
    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/applications/job/${jobId}`
            );

            console.log(
                "Job Applications:",
                response.data
            );

            setApplications(
                response.data.applications || []
            );

        } catch (error) {
            console.error(
                "Applications Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    // Download candidate resume
    const downloadResume = async (applicationId) => {
        try {
            const response = await api.get(
                `/applications/download/${applicationId}`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "candidate-resume.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(
                "Resume Download Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to download resume."
            );
        }
    };

    // Update application status
    const updateStatus = async (
        applicationId,
        status
    ) => {
        try {
            setUpdatingId(applicationId);

            const response = await api.put(
                `/applications/status/${applicationId}`,
                {
                    status: status,
                }
            );

            console.log(
                "Status Updated:",
                response.data
            );

            // Update application in frontend
            setApplications(
                (previousApplications) =>
                    previousApplications.map(
                        (application) =>
                            application._id ===
                                applicationId
                                ? {
                                    ...application,
                                    status: status,
                                }
                                : application
                    )
            );

        } catch (error) {
            console.error(
                "Status Update Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // ==========================================
    // AI CANDIDATE RANKING
    // ==========================================

    const getAIRanking = async () => {
    try {
        setRankingLoading(true);
        setRankingError("");

        const response = await api.get(
            `/applications/ai-ranking/${jobId}`
        );

        console.log("AI Ranking:", response.data);

        setRankedCandidates(
            response.data.candidates || []
        );

    } catch (error) {
        console.log(
            "AI Ranking Error:",
            error.response?.data || error.message
        );

        setRankingError(
            error.response?.data?.message ||
            "Failed to generate AI ranking"
        );
    } finally {
        setRankingLoading(false);
    }
};
    const getAISuggestion = (score) => {
        if (score >= 80) {
            return {
                text: "Suggest Shortlist",
                className: "text-success",
            };
        }

        if (score >= 60) {
            return {
                text: "Review Candidate",
                className: "text-warning",
            };
        }

        return {
            text: "Suggest Reject",
            className: "text-danger",
        };
    };
    // Loading
    if (loading) {
        return (
            <div className="container mt-4">
                <h2>Job Applications</h2>
                <p>Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* Back button */}

            <Link
                to="/recruiter/dashboard"
                className="btn btn-secondary mb-4"
            >
                ← Back to Dashboard
            </Link>

            {/* Page title */}

            <h2 className="mb-4">
                Job Applications
            </h2>

            {/* ==========================================
                AI CANDIDATE RANKING BUTTON
            ========================================== */}

            <div className="card shadow-sm mb-4">
                <div className="card-body">

                    <h4>
                        🤖 AI Candidate Ranking
                    </h4>

                    <p className="text-muted">
                        Rank candidates based on
                        their AI resume analysis.
                    </p>

                    <button
                        className="btn btn-dark"
                        onClick={getAIRanking}
                        disabled={rankingLoading}
                    >
                        {rankingLoading
                            ? "Ranking Candidates..."
                            : "Generate AI Ranking"}
                    </button>

                    {rankingError && (
                        <div className="alert alert-danger mt-3">
                            {rankingError}
                        </div>
                    )}

                </div>
            </div>

            {/* ==========================================
                AI RANKED CANDIDATES
            ========================================== */}

            {rankedCandidates.length > 0 && (
                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h4 className="mb-4">
                            🏆 AI Ranked Candidates
                        </h4>

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>
                                    <tr>
                                        <th>
                                            Rank
                                        </th>

                                        <th>
                                            Candidate
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            AI Score
                                        </th>

                                        <th>
                                            Recommendation
                                        </th>

                                        <th>AI Suggestion

                                        </th>

                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {rankedCandidates.map(
                                        (
                                            application,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    application._id
                                                }
                                            >

                                                {/* Rank */}

                                                <td>
                                                    <strong>
                                                        #
                                                        {index +
                                                            1}
                                                    </strong>
                                                </td>

                                                {/* Candidate */}

                                                <td>
                                                    {application
                                                        .candidate
                                                        ?.name ||
                                                        "Candidate"}
                                                </td>

                                                {/* Email */}

                                                <td>
                                                    {application
                                                        .candidate
                                                        ?.email ||
                                                        "Not available"}
                                                </td>

                                                {/* AI Score */}

                                                <td>
                                                    <strong>
                                                        {
                                                            application
                                                                .aiAnalysis
                                                                ?.score
                                                        }
                                                        %
                                                    </strong>
                                                </td>

                                                {/* Recommendation */}

                                                <td>
                                                    {
                                                        application
                                                            .aiAnalysis
                                                            ?.recommendation ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {application.aiAnalysis &&
                                                        application.aiAnalysis.score !== null && (
                                                            <strong
                                                                className={
                                                                    getAISuggestion(
                                                                        application.aiAnalysis.score
                                                                    ).className
                                                                }
                                                            >
                                                                {getAISuggestion(
                                                                    application.aiAnalysis.score
                                                                ).text}
                                                            </strong>
                                                        )}
                                                </td>

                                                {/* View Details */}

                                                <td>
                                                    <Link
                                                        to={`/recruiter/applications/${application._id}`}
                                                        className="btn btn-outline-primary btn-sm"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            )}

            {/* ==========================================
                NORMAL ERROR
            ========================================== */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ==========================================
                NO APPLICATIONS
            ========================================== */}

            {!error &&
                applications.length === 0 && (
                    <div className="alert alert-info">
                        No applications received yet.
                    </div>
                )}

            {/* ==========================================
                APPLICATIONS
            ========================================== */}

            {applications.map(
                (application) => (

                    <div
                        className="card shadow-sm mb-4"
                        key={application._id}
                    >

                        <div className="card-body">

                            {/* Candidate */}

                            <h4>
                                {application
                                    .candidate
                                    ?.name ||
                                    "Candidate"}
                            </h4>

                            {/* Email */}

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {application
                                    .candidate
                                    ?.email ||
                                    "Not available"}
                            </p>

                            {/* Applied date */}

                            <p>
                                <strong>
                                    Applied On:
                                </strong>{" "}
                                {application.createdAt
                                    ? new Date(
                                        application.createdAt
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </p>

                            {/* Resume */}

                            {application.resume && (
                                <div className="mt-3">

                                    <p className="text-success mb-2">
                                        ✓ Resume Uploaded
                                    </p>

                                    <button
                                        className="btn btn-outline-primary me-2"
                                        onClick={() =>
                                            downloadResume(
                                                application._id
                                            )
                                        }
                                    >
                                        Download Resume
                                    </button>

                                </div>
                            )}

                            {/* Current Status */}

                            <p className="mt-3">

                                <strong>
                                    Current Status:
                                </strong>{" "}
                                {/* AI Recommendation */}

                                {application.aiAnalysis &&
                                    application.aiAnalysis.score !== null && (
                                        <div className="alert alert-light border mt-3">

                                            <strong>
                                                🤖 AI Recommendation:
                                            </strong>

                                            <div className="mt-2">

                                                <span className="me-3">
                                                    Score:
                                                    <strong className="ms-1">
                                                        {application.aiAnalysis.score}%
                                                    </strong>
                                                </span>

                                                <span>
                                                    Recommendation:
                                                    <strong className="ms-1">
                                                        {application.aiAnalysis.recommendation}
                                                    </strong>
                                                </span>

                                            </div>

                                        </div>
                                    )}
                                <span
                                    className={`badge ${application.status === "Accepted"
                                        ? "bg-success"
                                        : application.status === "Rejected"
                                            ? "bg-danger"
                                            : application.status === "Shortlisted"
                                                ? "bg-primary"
                                                : "bg-warning text-dark"
                                        }`}
                                >
                                    {application.status}
                                </span>

                            </p>

                            {/* View Details */}

                            <div className="mt-3">

                                <Link
                                    to={`/recruiter/applications/${application._id}`}
                                    className="btn btn-outline-primary me-2"
                                >
                                    View Details
                                </Link>

                            </div>

                            {/* Status buttons */}

                            <div className="mt-3">

                                <strong>
                                    Update Status:
                                </strong>

                                <div className="mt-2">

                                    {/* Pending */}

                                    <button
                                        className="btn btn-warning me-2"
                                        disabled={
                                            updatingId ===
                                            application._id
                                        }
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "Pending"
                                            )
                                        }
                                    >
                                        Pending
                                    </button>

                                    {/* Shortlist */}

                                    <button
                                        className="btn btn-primary me-2"
                                        disabled={
                                            updatingId === application._id
                                        }
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "Shortlisted"
                                            )
                                        }
                                    >
                                        Shortlist
                                    </button>

                                    {/* Reject */}

                                    <button
                                        className="btn btn-danger"
                                        disabled={
                                            updatingId ===
                                            application._id
                                        }
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "Rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )
            )}

        </div>
    );
};

export default JobApplications;