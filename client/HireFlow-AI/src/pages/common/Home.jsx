import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>

            {/* Hero Section */}
            <section className="bg-light py-5">
                <div className="container py-5">

                    <div className="row align-items-center">

                        {/* Left Side */}
                        <div className="col-lg-7">

                            <span className="badge bg-primary mb-3 px-3 py-2">
                                AI-Powered Recruitment Platform
                            </span>

                            <h1 className="display-4 fw-bold mb-3">
                                Find the Right Job.
                                <br />
                                Hire the Right Talent.
                            </h1>

                            <p className="lead text-muted mb-4">
                                HireFlow AI connects candidates with
                                opportunities and helps recruiters find
                                the best candidates using AI-powered
                                resume analysis and job matching.
                            </p>

                            <div>

                                <Link
                                    to="/candidate/dashboard"
                                    className="btn btn-primary btn-lg me-3"
                                >
                                    Find Jobs
                                </Link>

                                {user?.role === "recruiter" ? (
                                    <Link
                                        to="/recruiter/jobs/create"
                                        className="btn btn-outline-dark btn-lg"
                                    >
                                        Post a Job
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="btn btn-outline-dark btn-lg"
                                    >
                                        Post a Job
                                    </Link>
                                )}

                            </div>

                        </div>

                        {/* Right Side */}
                        <div className="col-lg-5 mt-5 mt-lg-0">

                            <div className="card shadow border-0">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold mb-4">
                                        Why HireFlow AI?
                                    </h4>

                                    <div className="mb-4">
                                        <h6 className="fw-bold">
                                            🤖 AI Resume Analysis
                                        </h6>

                                        <p className="text-muted mb-0">
                                            Analyze resumes and understand
                                            candidate strengths, weaknesses
                                            and skill matches.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="fw-bold">
                                            🎯 Smart Job Matching
                                        </h6>

                                        <p className="text-muted mb-0">
                                            Match candidate resumes with
                                            suitable job opportunities.
                                        </p>
                                    </div>

                                    <div>
                                        <h6 className="fw-bold">
                                            📊 ATS Scoring
                                        </h6>

                                        <p className="text-muted mb-0">
                                            Evaluate resumes using an
                                            Applicant Tracking System score.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* Features Section */}
            <section className="py-5">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            Everything You Need
                        </h2>

                        <p className="text-muted">
                            A simple platform for candidates and recruiters.
                        </p>

                    </div>


                    <div className="row">

                        {/* Candidate */}
                        <div className="col-md-4 mb-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold mb-3">
                                        👨‍💼 For Candidates
                                    </h4>

                                    <ul className="text-muted">

                                        <li className="mb-2">
                                            Search for jobs
                                        </li>

                                        <li className="mb-2">
                                            Apply with your resume
                                        </li>

                                        <li className="mb-2">
                                            Get ATS resume analysis
                                        </li>

                                        <li className="mb-2">
                                            Find AI recommended jobs
                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>


                        {/* Recruiter */}
                        <div className="col-md-4 mb-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold mb-3">
                                        🏢 For Recruiters
                                    </h4>

                                    <ul className="text-muted">

                                        <li className="mb-2">
                                            Post job opportunities
                                        </li>

                                        <li className="mb-2">
                                            Manage posted jobs
                                        </li>

                                        <li className="mb-2">
                                            Review applications
                                        </li>

                                        <li className="mb-2">
                                            Shortlist candidates
                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>


                        {/* AI */}
                        <div className="col-md-4 mb-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold mb-3">
                                        🤖 AI Features
                                    </h4>

                                    <ul className="text-muted">

                                        <li className="mb-2">
                                            Resume analysis
                                        </li>

                                        <li className="mb-2">
                                            ATS scoring
                                        </li>

                                        <li className="mb-2">
                                            Candidate ranking
                                        </li>

                                        <li className="mb-2">
                                            Job matching
                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* Call To Action */}
            <section className="bg-dark text-white py-5">

                <div className="container text-center">

                    <h2 className="fw-bold mb-3">
                        Start Your Recruitment Journey
                    </h2>

                    <p className="text-light mb-4">
                        Find opportunities or discover the right talent
                        with HireFlow AI.
                    </p>

                    <Link
                        to="/register"
                        className="btn btn-primary btn-lg"
                    >
                        Get Started
                    </Link>

                </div>

            </section>

        </div>
    );
};

export default Home;