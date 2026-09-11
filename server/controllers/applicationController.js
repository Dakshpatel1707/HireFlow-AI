const Application = require("../models/Application");
const Job = require("../models/Job");
const {
    extractResumeText,
    calculateATSScore,
    analyzeResumeWithAI,
} = require("../utils/atsAnalyzer");
const {
    matchResumeWithJob,
} = require("../utils/jobMatcher");
const asyncHandler = require("express-async-handler");
const applyJob = (async (req, res) => {


    const { jobId } = req.body;

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    // Check already applied
    const alreadyApplied = await Application.findOne({
        job: jobId,
        candidate: req.user._id,
    });

    if (alreadyApplied) {
        return res.status(400).json({
            success: false,
            message: "You have already applied for this job",
        });
    }

    // Create application
    const application = await Application.create({
        job: jobId,
        candidate: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Application Submitted Successfully",
        application,
    });


});

const getMyApplications = asyncHandler(async (req, res) => {


    const applications = await Application.find({
        candidate: req.user._id,
    })
        .populate("job")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications,
    });


});

const getJobApplications = asyncHandler(async (req, res) => {


    const job = await Job.findById(req.params.jobId);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    const applications = await Application.find({
        job: req.params.jobId,
    })
        .populate("candidate", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications,
    });


});
const getSingleApplication = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id)
        .populate("candidate", "name email")
        .populate("job");

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    // Check that this recruiter owns the job
    if (
        application.job.recruiter.toString() !==
        req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    res.status(200).json({
        success: true,
        application,
    });
});


const updateApplicationStatus = asyncHandler(async (req, res) => {

    const { status } = req.body;

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    // Check ownership
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    // Validate status
   if (!["Pending", "Shortlisted", "Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({
        success: false,
        message: "Invalid status",
    });
}

    application.status = status;

    await application.save();

    res.status(200).json({
        success: true,
        message: "Application Status Updated",
        application,
    });


});

const uploadResume = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id);

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    // Only owner can upload resume
    if (application.candidate.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    application.resume = req.file.filename;

    await application.save();

    res.status(200).json({
        success: true,
        message: "Resume Uploaded Successfully",
        application,
    });


});

const getATSReport = asyncHandler(async (req, res) => {


    const application = await Application.findById(req.params.id)
        .populate("job");

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    const resumePath = `uploads/${application.resume}`;

    const resumeText = await extractResumeText(resumePath);

    const result = calculateATSScore(
        resumeText,
        application.job.skills
    );

    res.status(200).json({
        success: true,
        score: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
    });


});

const getRecruiterATSReport = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id)
        .populate("job");

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    // Check recruiter owns this job
    if (
        application.job.recruiter.toString() !==
        req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    // Check resume exists
    if (!application.resume) {
        return res.status(400).json({
            success: false,
            message: "Candidate has not uploaded a resume.",
        });
    }

    const resumePath = `uploads/${application.resume}`;

    const resumeText =
        await extractResumeText(resumePath);

    const result = calculateATSScore(
        resumeText,
        application.job.skills
    );

    res.status(200).json({
        success: true,
        score: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
    });
});

const getAIResumeAnalysis = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id)
        .populate("job");

    // Check application
    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    // Check recruiter ownership
    if (
        application.job.recruiter.toString() !==
        req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    // Check resume
    if (!application.resume) {
        return res.status(400).json({
            success: false,
            message: "Candidate has not uploaded a resume.",
        });
    }

    // Resume path
    const resumePath = `uploads/${application.resume}`;

    // Extract resume text
    const resumeText =
        await extractResumeText(resumePath);

    // Generate AI analysis
    const aiResult =
        await analyzeResumeWithAI(
            resumeText,
            application.job
        );

    // Save AI analysis in MongoDB
    application.aiAnalysis = aiResult;

    await application.save();

    // Send response
    res.status(200).json({
        success: true,
        applicationId: application._id,
        analysis: aiResult,
    });
});


const getAIRankedCandidates = asyncHandler(async (req, res) => {

    const { jobId } = req.params;

    // Find all applications for this job
    const applications = await Application.find({
        job: jobId,
    })
        .populate("candidate", "name email")
        .populate("job");

    // Check whether job exists
    if (applications.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No applications found for this job.",
        });
    }

    // Check recruiter ownership
    const job = applications[0].job;

    if (
        job.recruiter.toString() !==
        req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    // Sort candidates by AI score
    const rankedCandidates = applications
        .filter(
            (application) =>
                application.aiAnalysis &&
                application.aiAnalysis.score !== null
        )
        .sort(
            (a, b) =>
                b.aiAnalysis.score -
                a.aiAnalysis.score
        );

    res.status(200).json({
        success: true,
        count: rankedCandidates.length,
        candidates: rankedCandidates,
    });
});

const getAIJobMatches = asyncHandler(async (req, res) => {

    const candidateId = req.user._id;


    // Find candidate's applications
    const applications = await Application.find({
        candidate: candidateId,
    });

    if (applications.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No applications found for this candidate.",
        });
    }


    // Find an application that has a resume
    const applicationWithResume = applications.find(
        (application) => application.resume
    );

    if (!applicationWithResume) {
        return res.status(400).json({
            success: false,
            message: "Please upload a resume first.",
        });
    }


    // Resume file path
    const resumePath =
        `uploads/${applicationWithResume.resume}`;


    // Extract resume text
    const resumeText =
        await extractResumeText(resumePath);


    // Get all available jobs
    const jobs = await Job.find();


    if (jobs.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No jobs available.",
        });
    }


    // Match resume with every job
    const matchedJobs = [];

    for (const job of jobs) {

        const matchResult =
            await matchResumeWithJob(
                resumeText,
                job
            );

        matchedJobs.push({
            job: job,
            match: matchResult,
        });
    }


    // Sort highest score first
    matchedJobs.sort(
        (a, b) =>
            b.match.matchScore -
            a.match.matchScore
    );


    res.status(200).json({
        success: true,
        count: matchedJobs.length,
        jobs: matchedJobs,
    });
});


const path = require("path");

const downloadResume = asyncHandler(async (req, res) => {


    const application = await Application.findById(req.params.id)
        .populate("job");

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application Not Found",
        });
    }

    // Only recruiter who owns the job can download
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        application.resume
    );

    res.download(filePath);


});

module.exports = {
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
    downloadResume,
};