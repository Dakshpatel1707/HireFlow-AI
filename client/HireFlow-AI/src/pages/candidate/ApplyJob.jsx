import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
        setMessage("Please select your resume.");
        return;
    }

    try {
        setLoading(true);
        setMessage("");

        // 1. Create application
        const response = await api.post(
            "/applications/apply",
            {
                jobId: id,
            }
        );

        console.log("Application Created:", response.data);

        const applicationId = response.data.application._id;

        // 2. Upload resume
        const formData = new FormData();

        formData.append("resume", resume);

        const resumeResponse = await api.put(
            `/applications/upload-resume/${applicationId}`,
            formData
        );

        console.log(
            "Resume Uploaded:",
            resumeResponse.data
        );

        setMessage("Application submitted successfully!");

    } catch (error) {
        console.error("Application Error:", error);

        setMessage(
            error.response?.data?.message ||
            "Failed to submit application."
        );

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="container mt-5">
            <button
                className="btn btn-secondary mt-3"
               onClick={() =>
    navigate(`/jobs/${id}`)
}
            >
                ← Back to Job
            </button> <br /> <br />
            <h2>Apply for Job</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">
                        Upload Resume
                    </label>

                    <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            setResume(e.target.files[0])
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Application"}
                </button>

            </form>

            {message && (
                <p className="mt-3">
                    {message}
                </p>
            )}



        </div>
    );
};

export default ApplyJob;