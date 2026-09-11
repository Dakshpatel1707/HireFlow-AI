import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import api from "../../services/api";

function Login() {

    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log(response.data);

            // Store user + token
            loginUser(
                response.data.user,
                response.data.token
            );

            // Redirect according to role
            if (response.data.user.role === "candidate") {
                navigate("/candidate/dashboard");
            }
            else if (response.data.user.role === "recruiter") {
                navigate("/recruiter/dashboard");
            }

        } catch (error) {

            console.log(
                error.response?.data?.message || "Login failed"
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
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
                                    Welcome Back
                                </h2>

                                <p className="text-muted">
                                    Login to your HireFlow AI account
                                </p>

                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* Email */}
                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                {/* Password */}
                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Logging in..."
                                        : "Login"}
                                </button>

                            </form>

                            {/* Register Link */}
                            <div className="text-center mt-4">

                                <p className="text-muted mb-0">
                                    Don't have an account?{" "}

                                    <Link
                                        to="/register"
                                        className="text-decoration-none fw-semibold"
                                    >
                                        Create Account
                                    </Link>

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;