import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const response = await api.get("/applications/my");

            console.log("My Applications:", response.data);

            setApplications(response.data.applications || []);

        } catch (error) {
            console.error("Applications Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <h2>My Applications</h2>
                <p>Loading applications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <h2>My Applications</h2>

                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Applications</h2>

                <Link
                    to="/candidate/dashboard"
                    className="btn btn-secondary"
                >
                    Browse Jobs
                </Link>
            </div>

            {applications.length === 0 ? (
                <div className="alert alert-info">
                    You have not applied for any jobs yet.
                </div>
            ) : (
                <div className="row">

                    {applications.map((application) => (
                        <div
                            className="col-md-6 mb-4"
                            key={application._id}
                        >

                            <div className="card h-100 shadow-sm">

                                <div className="card-body">

                                    <h4 className="card-title">
                                        {application.job?.title}
                                    </h4>

                                    <p className="mb-2">
                                        <strong>Company:</strong>{" "}
                                        {application.job?.company}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Location:</strong>{" "}
                                        {application.job?.location}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Salary:</strong>{" "}
                                        ₹{application.job?.salary}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Status:</strong>{" "}
                                        <span className="badge bg-warning text-dark">
                                            {application.status}
                                        </span>
                                    </p>

                                    <Link
                                        to={`/candidate/applications/${application._id}`}
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default MyApplications;