import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import NotFound from "./pages/common/NotFound";
import Navbar from "./components/common/Navbar";
import JobDetails from "./pages/candidate/JobDetails";
import ApplyJob from "./pages/candidate/ApplyJob";
import MyApplications from "./pages/candidate/MyApplications";
import ApplicationDetails from "./pages/candidate/ApplicationDetails";
import JobApplications from "./pages/recruiter/JobApplications";
import RecruiterApplicationDetails
  from "./pages/recruiter/RecruiterApplicationDetails";
import CreateJob from "./pages/recruiter/CreateJob";
import EditJob from "./pages/recruiter/EditJob";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />

        <Route
          path="/candidate/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/candidate/applications"
          element={<MyApplications />}
        />

        <Route
          path="/candidate/jobs/:id/apply"
          element={<ApplyJob />}
        />

        <Route
          path="/candidate/applications/:id"
          element={<ApplicationDetails />}
        />
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/jobs/create"
          element={<CreateJob />}
        />

        <Route
          path="/recruiter/jobs/:id/edit"
          element={<EditJob />}
        />

        <Route
          path="/recruiter/jobs/:jobId/applications"
          element={<JobApplications />}
        />

        <Route
          path="/recruiter/applications/:id"
          element={<RecruiterApplicationDetails />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/candidate/jobs/:id/apply"
          element={<ApplyJob />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;