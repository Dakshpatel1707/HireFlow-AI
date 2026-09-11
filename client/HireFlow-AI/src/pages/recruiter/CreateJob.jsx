import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateJob = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        skills: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setMessage("");
            setError("");

            const response = await api.post("/jobs/create", {
                    title: formData.title,
                    company: formData.company,
                    location: formData.location,
                    salary: Number(formData.salary),
                    description: formData.description,
                    skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter((skill) => skill !== ""),
                }
            );

            console.log(
                "Job Created:",
                response.data
            );

            setMessage(
                "Job created successfully!"
            );

            setTimeout(() => {
                navigate("/recruiter/dashboard");
            }, 1000);

        } catch (error) {

            console.error(
                "Create Job Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create job."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="container mt-5">

            <div className="card shadow-sm">

                <div className="card-body p-4">

                    <h2 className="mb-4">
                        Create New Job
                    </h2>


                    {message && (
                        <div className="alert alert-success">
                            {message}
                        </div>
                    )}


                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}


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
                                placeholder="e.g. MERN Stack Developer"
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
                                placeholder="e.g. ABC Technologies"
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
                                placeholder="e.g. Ahmedabad"
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
                                placeholder="e.g. 50000"
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
                                placeholder="Enter job description..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Skills */}

                        <div className="mb-4">

                            <label className="form-label">
                                Required Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                className="form-control"
                                placeholder="React, Node.js, MongoDB, Express"
                                value={formData.skills}
                                onChange={handleChange}
                                required
                            />

                            <small className="text-muted">
                                Separate skills using commas.
                            </small>

                        </div>


                        {/* Buttons */}

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Job..."
                                : "Create Job"
                            }

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

                    </form>

                </div>

            </div>

        </div>

    );

};

export default CreateJob;