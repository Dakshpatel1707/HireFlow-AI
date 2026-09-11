import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        skills: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch existing job
    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/jobs/${id}`);

            const job = response.data.job;

            setFormData({
                title: job.title || "",
                company: job.company || "",
                location: job.location || "",
                salary: job.salary || "",
                description: job.description || "",
                skills: job.skills ? job.skills.join(", ") : "",
            });

        } catch (error) {
            console.error("Fetch Job Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load job."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit updated job
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const updatedJob = {
                title: formData.title,
                company: formData.company,
                location: formData.location,
                salary: Number(formData.salary),
                description: formData.description,
                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== ""),
            };

            const response = await api.put(
                `/jobs/${id}`,
                updatedJob
            );

            console.log("Updated Job:", response.data);

            setMessage("Job updated successfully!");

            // Go back to recruiter dashboard
            setTimeout(() => {
                navigate("/recruiter/dashboard");
            }, 1000);

        } catch (error) {
            console.error("Update Job Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update job."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h3>Loading job...</h3>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}
            <div className="mb-4">
                <h2>Edit Job</h2>

                <p className="text-muted">
                    Update the details of your posted job.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Success */}
            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {/* Form */}
            <div className="card shadow-sm">
                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        {/* Job Title */}
                        <div className="mb-3">
                            <label className="form-label">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Company */}
                        <div className="mb-3">
                            <label className="form-label">
                                Company
                            </label>

                            <input
                                type="text"
                                name="company"
                                className="form-control"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Location */}
                        <div className="mb-3">
                            <label className="form-label">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                className="form-control"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Salary */}
                        <div className="mb-3">
                            <label className="form-label">
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                className="form-control"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">
                                Job Description
                            </label>

                            <textarea
                                name="description"
                                className="form-control"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Skills */}
                        <div className="mb-3">
                            <label className="form-label">
                                Required Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                className="form-control"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                            />

                            <small className="text-muted">
                                Separate skills using commas.
                            </small>
                        </div>

                        {/* Buttons */}
                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Job"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/recruiter/dashboard")
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            </div>

        </div>
    );
};

export default EditJob;