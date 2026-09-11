import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const ApplicationDetails = () => {
    const { id } = useParams();

    // Store application information
    const [application, setApplication] = useState(null);

    // Store ATS report
    const [atsReport, setAtsReport] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [atsLoading, setAtsLoading] = useState(false);

    // Error states
    const [error, setError] = useState("");
    const [atsError, setAtsError] = useState("");

    // Run when application ID changes
    useEffect(() => {
        fetchApplication();
    }, [id]);

    // Get candidate application
    const fetchApplication = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/applications/my");

            console.log(
                "Applications Response:",
                response.data
            );

            const applications =
                response.data.applications || [];

            // Find current application
            const foundApplication = applications.find(
                (item) => item._id === id
            );

            if (!foundApplication) {
                setError("Application not found.");
                return;
            }

            setApplication(foundApplication);

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

    // Get ATS Report
    const getATSReport = async () => {
        try {
            setAtsLoading(true);
            setAtsError("");

            const response = await api.get(
                `/applications/ats/${id}`
            );

            console.log(
                "ATS Response:",
                response.data
            );

            setAtsReport(response.data);

        } catch (error) {
            console.error(
                "ATS Error:",
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

    // Loading screen
    if (loading) {
        return (
            <div className="container mt-4">

                <h2>Application Details</h2>

                <p>
                    Loading application...
                </p>

            </div>
        );
    }

    // Error screen
    if (error) {
        return (
            <div className="container mt-4">

                <div className="alert alert-danger">
                    {error}
                </div>

                <Link
                    to="/candidate/applications"
                    className="btn btn-secondary"
                >
                    Back to Applications
                </Link>

            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* Back button */}

            <Link
                to="/candidate/applications"
                className="btn btn-secondary mb-4"
            >
                ← Back to Applications
            </Link>

            <h2 className="mb-4">
                Application Details
            </h2>


            {/* =========================
                JOB INFORMATION
            ========================= */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h3>
                        {application.job?.title}
                    </h3>

                    <p>
                        <strong>
                            Company:
                        </strong>{" "}
                        {application.job?.company}
                    </p>

                    <p>
                        <strong>
                            Location:
                        </strong>{" "}
                        {application.job?.location}
                    </p>

                    <p>
                        <strong>
                            Salary:
                        </strong>{" "}
                        ₹{application.job?.salary}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>{" "}

                        <span className="badge bg-warning text-dark">
                            {application.status}
                        </span>

                    </p>

                    <p>
                        <strong>
                            Applied On:
                        </strong>{" "}

                        {new Date(
                            application.createdAt
                        ).toLocaleDateString()}

                    </p>

                </div>

            </div>


            {/* =========================
                RESUME INFORMATION
            ========================= */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h4>
                        Resume
                    </h4>

                    {application.resume ? (

                        <p className="text-success">
                            ✓ Resume uploaded
                        </p>

                    ) : (

                        <p className="text-danger">
                            No resume uploaded
                        </p>

                    )}

                </div>

            </div>


            {/* =========================
                ATS SECTION
            ========================= */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h4>
                        AI / ATS Analysis
                    </h4>

                    <p>
                        Check how well your resume
                        matches this job.
                    </p>


                    {/* ATS BUTTON */}

                    <button
                        className="btn btn-primary"
                        onClick={getATSReport}
                        disabled={atsLoading}
                    >

                        {atsLoading
                            ? "Generating Report..."
                            : "Get ATS Report"}

                    </button>


                    {/* ATS ERROR */}

                    {atsError && (

                        <div className="alert alert-danger mt-3">
                            {atsError}
                        </div>

                    )}


                    {/* ATS RESULT */}

                    {atsReport && (

                        <div className="card mt-4">

                            <div className="card-body">

                                <h5>
                                    ATS Report
                                </h5>

                                <pre>
                                    {JSON.stringify(
                                        atsReport,
                                        null,
                                        2
                                    )}
                                </pre>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default ApplicationDetails;