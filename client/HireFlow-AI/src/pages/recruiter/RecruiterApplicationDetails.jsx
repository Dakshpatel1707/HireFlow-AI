import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const RecruiterApplicationDetails = () => {
    const { id } = useParams();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [atsReport, setAtsReport] = useState(null);
    const [atsLoading, setAtsLoading] = useState(false);
    const [atsError, setAtsError] = useState("");

    const [aiAnalysis, setAiAnalysis] = useState(null);
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState("");

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/applications/${id}`
            );

            console.log(
                "Recruiter Application:",
                response.data
            );

            setApplication(
                response.data.application
            );

        } catch (error) {
            console.error(
                "Application Details Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load application."
            );
        } finally {
            setLoading(false);
        }
    };
    const getATSReport = async () => {
        try {
            setAtsLoading(true);
            setAtsError("");

            const response = await api.get(
                `/applications/recruiter-ats/${id}`
            );

            console.log(
                "Recruiter ATS Report:",
                response.data
            );

            setAtsReport(response.data);

        } catch (error) {
            console.error(
                "Recruiter ATS Error:",
                error
            );

            setAtsError(
                error.response?.data?.message ||
                "Failed to generate ATS report."
            );
        } finally {
            setAtsLoading(false);
        }
    };
    const getAIAnalysis = async () => {
    try {
        setAiLoading(true);
        setAiError("");

        const response = await api.get(
            `/applications/ai-analysis/${id}`
        );

        console.log(
            "AI Analysis:",
            response.data
        );

        setAiAnalysis(
            response.data.analysis
        );

    } catch (error) {
        console.error(
            "AI Analysis Error:",
            error
        );

        setAiError(
            error.response?.data?.message ||
            "Failed to generate AI analysis."
        );
    } finally {
        setAiLoading(false);
    }
};

    if (loading) {
        return (
            <div className="container mt-4">
                <h2>Application Details</h2>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                </div>

                <Link
                    to="/recruiter/dashboard"
                    className="btn btn-secondary"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <Link
                to="/recruiter/dashboard"
                className="btn btn-secondary mb-4"
            >
                ← Back to Dashboard
            </Link>

            <h2 className="mb-4">
                Candidate Application
            </h2>

            {/* Candidate Information */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h3>
                        {application.candidate?.name ||
                            "Candidate"}
                    </h3>

                    <p>
                        <strong>Email:</strong>{" "}
                        {application.candidate?.email ||
                            "Not available"}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}

                        <span className="badge bg-warning text-dark">
                            {application.status}
                        </span>
                    </p>

                    <p>
                        <strong>Applied On:</strong>{" "}

                        {new Date(
                            application.createdAt
                        ).toLocaleDateString()}
                    </p>

                </div>

            </div>


            {/* Job Information */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h4>Job Information</h4>

                    <p>
                        <strong>Job:</strong>{" "}
                        {application.job?.title}
                    </p>

                    <p>
                        <strong>Company:</strong>{" "}
                        {application.job?.company}
                    </p>

                    <p>
                        <strong>Location:</strong>{" "}
                        {application.job?.location}
                    </p>

                    <p>
                        <strong>Salary:</strong>{" "}
                        ₹{application.job?.salary}
                    </p>

                </div>

            </div>


            {/* Resume */}

            <div className="card shadow-sm">

                <div className="card-body">

                    <h4>Resume</h4>

                    {application.resume ? (
                        <>
                            <p className="text-success">
                                ✓ Resume uploaded
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    window.open(
                                        `http://localhost:5000/api/applications/download/${application._id}`,
                                        "_blank"
                                    )
                                }
                            >
                                View / Download Resume
                            </button>
                        </>
                    ) : (
                        <p className="text-danger">
                            No resume uploaded.
                        </p>
                    )}

                </div>

            </div>

            {/* ATS Analysis */}

            <div className="card shadow-sm mt-4">

                <div className="card-body">

                    <h4>
                        ATS Analysis
                    </h4>

                    <p>
                        Check how well this candidate's
                        resume matches the job requirements.
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={getATSReport}
                        disabled={atsLoading}
                    >
                        {atsLoading
                            ? "Generating Report..."
                            : "Generate ATS Report"}
                    </button>

                    {atsError && (
                        <div className="alert alert-danger mt-3">
                            {atsError}
                        </div>
                    )}

                    {atsReport && (
                        <div className="mt-4">

                            <h5>
                                ATS Score
                            </h5>

                            <div className="mb-3">

                                <h2>
                                    {atsReport.score}%
                                </h2>

                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${atsReport.score}%`
                                        }}
                                    >
                                        {atsReport.score}%
                                    </div>
                                </div>
                                <br /> <br />
                                <div className="alert alert-info">

                                    <strong>
                                        Recommendation:
                                    </strong>{" "}

                                    {atsReport.score >= 80
                                        ? "Strong candidate match."
                                        : atsReport.score >= 60
                                            ? "Moderate candidate match. Review the resume."
                                            : "Low candidate match. Carefully review before proceeding."}

                                </div>

                            </div>

                            <hr />
                            {/* AI Resume Analysis */}

<div className="card shadow-sm mt-4 mb-5">

    <div className="card-body">

        <h4>
            🤖 AI Resume Analysis
        </h4>

        <p>
            Use AI to analyze this candidate's
            resume against the job requirements.
        </p>

        <button
            className="btn btn-dark"
            onClick={getAIAnalysis}
            disabled={aiLoading}
        >
            {aiLoading
                ? "AI is Analyzing..."
                : "Generate AI Analysis"}
        </button>

        {/* Error */}

        {aiError && (
            <div className="alert alert-danger mt-3">
                {aiError}
            </div>
        )}

        {/* AI Result */}

        {aiAnalysis && (
            <div className="mt-4">

                {/* Score */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            ATS Score
                        </h5>

                        <h1>
                            {aiAnalysis.score}%
                        </h1>

                    </div>
                </div>


                {/* Summary */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            Summary
                        </h5>

                        <p>
                            {aiAnalysis.summary}
                        </p>

                    </div>
                </div>


                {/* Strengths */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            Strengths
                        </h5>

                        {aiAnalysis.strengths?.length > 0 ? (

                            <ul>
                                {aiAnalysis.strengths.map(
                                    (strength, index) => (
                                        <li key={index}>
                                            {strength}
                                        </li>
                                    )
                                )}
                            </ul>

                        ) : (

                            <p>
                                No strengths found.
                            </p>

                        )}

                    </div>
                </div>


                {/* Weaknesses */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            Weaknesses
                        </h5>

                        {aiAnalysis.weaknesses?.length > 0 ? (

                            <ul>
                                {aiAnalysis.weaknesses.map(
                                    (weakness, index) => (
                                        <li key={index}>
                                            {weakness}
                                        </li>
                                    )
                                )}
                            </ul>

                        ) : (

                            <p>
                                No weaknesses found.
                            </p>

                        )}

                    </div>
                </div>


                {/* Matched Skills */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            Matched Skills
                        </h5>

                        {aiAnalysis.matchedSkills?.length > 0 ? (

                            <ul>
                                {aiAnalysis.matchedSkills.map(
                                    (skill, index) => (
                                        <li key={index}>
                                            {skill}
                                        </li>
                                    )
                                )}
                            </ul>

                        ) : (

                            <p>
                                No matching skills found.
                            </p>

                        )}

                    </div>
                </div>


                {/* Missing Skills */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            Missing Skills
                        </h5>

                        {aiAnalysis.missingSkills?.length > 0 ? (

                            <ul>
                                {aiAnalysis.missingSkills.map(
                                    (skill, index) => (
                                        <li key={index}>
                                            {skill}
                                        </li>
                                    )
                                )}
                            </ul>

                        ) : (

                            <p>
                                No missing skills.
                            </p>

                        )}

                    </div>
                </div>


                {/* Experience */}

                <div className="card mb-3">
                    <div className="card-body">

                        <h5>
                            Experience Analysis
                        </h5>

                        <p>
                            {aiAnalysis.experienceAnalysis}
                        </p>

                    </div>
                </div>


                {/* Recommendation */}

                <div className="card">
                    <div className="card-body">

                        <h5>
                            Recommendation
                        </h5>

                        <h4>
                            {aiAnalysis.recommendation}
                        </h4>

                    </div>
                </div>

            </div>
        )}

    </div>

</div>

                            {/* Matched Skills */}

                            <h5>
                                Matched Skills
                            </h5>

                            {atsReport.matchedSkills?.length > 0 ? (

                                <div className="mb-3">

                                    {atsReport.matchedSkills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}
                                                className="badge bg-success me-2 mb-2"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="text-muted">
                                    No matching skills found.
                                </p>

                            )}

                            {/* Missing Skills */}

                            <h5>
                                Missing Skills
                            </h5>

                            {atsReport.missingSkills?.length > 0 ? (

                                <div className="mb-3">

                                    {atsReport.missingSkills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}
                                                className="badge bg-danger me-2 mb-2"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="text-success">
                                    No missing skills.
                                </p>

                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default RecruiterApplicationDetails;



