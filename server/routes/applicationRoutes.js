const express = require("express");

const router = express.Router();

const {
    applyJob,
    getMyApplications,
    getJobApplications,
    getSingleApplication,
    updateApplicationStatus,
    uploadResume,
    getATSReport,
    getRecruiterATSReport,
    getAIResumeAnalysis,
    getAIRankedCandidates,
    getAIJobMatches,
    downloadResume
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");

const { candidateOnly, recruiterOnly } = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post("/apply", protect, candidateOnly, applyJob);

router.get("/my", protect, candidateOnly, getMyApplications);

router.get("/job/:jobId", protect, recruiterOnly, getJobApplications);


// AI job matching MUST be before /:id
router.get(
    "/ai-job-matches",
    protect,
    candidateOnly,
    getAIJobMatches
);


router.get("/:id", protect, recruiterOnly, getSingleApplication);

router.put("/status/:id", protect, recruiterOnly, updateApplicationStatus);

router.put(
    "/upload-resume/:id",
    protect,
    candidateOnly,
    upload.single("resume"),
    uploadResume
);

router.get("/ats/:id", protect, candidateOnly, getATSReport);

router.get(
    "/recruiter-ats/:id",
    protect,
    recruiterOnly,
    getRecruiterATSReport
);

router.get(
    "/ai-analysis/:id",
    protect,
    recruiterOnly,
    getAIResumeAnalysis
);

router.get(
    "/ai-ranking/:jobId",
    protect,
    recruiterOnly,
    getAIRankedCandidates
);

router.get(
    "/download/:id",
    protect,
    recruiterOnly,
    downloadResume
);

module.exports = router;



