import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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
            setError("");
            setMessage("");

            const response = await api.post("/auth/register", formData);

            console.log("Register Response:", response.data);

            setMessage("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Registration Error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-6 col-lg-5">

                    <div className="card shadow border-0">

                        <div className="card-body p-4 p-md-5">

                            {/* Heading */}
                            <div className="text-center mb-4">

                                <h2 className="fw-bold">
                                    Create Account
                                </h2>

                                <p className="text-muted">
                                    Join HireFlow AI today
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

                            <form onSubmit={handleSubmit}>

                                {/* Name */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* Email */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* Password */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* Role */}
                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Register As
                                    </label>

                                    <select
                                        name="role"
                                        className="form-select"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="candidate">
                                            Candidate
                                        </option>

                                        <option value="recruiter">
                                            Recruiter
                                        </option>

                                    </select>

                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>

                            </form>

                            {/* Login Link */}
                            <div className="text-center mt-4">

                                <p className="text-muted mb-0">
                                    Already have an account?{" "}

                                    <Link
                                        to="/login"
                                        className="text-decoration-none fw-semibold"
                                    >
                                        Login
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;