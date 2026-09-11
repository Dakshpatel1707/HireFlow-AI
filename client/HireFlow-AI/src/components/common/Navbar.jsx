import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Navbar = () => {

    const { user, logoutUser } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link
                    to="/"
                    className="navbar-brand"
                >
                    HireFlow AI
                </Link>

                <div className="d-flex align-items-center">

                    <Link
                        to="/"
                        className="nav-link text-white me-3"
                    >
                        Home
                    </Link>

                    {user && (
                        <Link
                            to={
                                user.role === "recruiter"
                                    ? "/recruiter/dashboard"
                                    : "/candidate/dashboard"
                            }
                            className="nav-link text-white me-3"
                        >
                            Dashboard
                        </Link>
                    )}

                    {/* My Applications - Candidate Only */}
                    {user?.role === "candidate" && (
                        <Link
                            to="/candidate/applications"
                            className="nav-link text-white me-3"
                        >
                            My Applications
                        </Link>
                    )}

                    {user ? (
                        <button
                            className="btn btn-danger"
                            onClick={logoutUser}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="btn btn-outline-light me-2"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="btn btn-primary"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
};

export default Navbar;