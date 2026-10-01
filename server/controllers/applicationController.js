const path = require("path");
const fs = require("fs");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { extractResumeText, calculateATSScore, analyzeResumeWithAI } = require("../utils/atsAnalyzer");
const { matchResumeWithJob } = require("../utils/jobMatcher");
const asyncHandler = require("express-async-handler");

// ── Apply to Job ──
const applyJob = asyncHandler(async (req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
        return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.status === "closed") {
        return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
    }

    const alreadyApplied = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (alreadyApplied) {
        return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    const application = await Application.create({ job: jobId, candidate: req.user._id });

    res.status(201).json({ success: true, message: "Application submitted successfully", application });
});

// ── Get My Applications (Candidate) ──
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ candidate: req.user._id })
        .populate("job")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
});

// ── Get Job Applications (Recruiter) ──
const getJobApplications = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    const applications = await Application.find({ job: req.params.jobId })
        .populate("candidate", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
});

// ── Get Single Application (Recruiter) ──
const getSingleApplication = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id)
        .populate("candidate", "name email")
        .populate("job");

    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    res.status(200).json({ success: true, application });
});

// ── Update Application Status (Recruiter) ──
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const validStatuses = ["Pending", "Shortlisted", "Accepted", "Rejected"];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, message: "Application status updated", application });
});

// ── Upload Resume (Candidate) ──
const uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Please upload a PDF resume" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. This is not your application." });
    }

    // Delete old resume file if exists
    if (application.resume) {
        const oldPath = path.join(__dirname, "..", "uploads", application.resume);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }

    application.resume = req.file.filename;
    await application.save();

    res.status(200).json({ success: true, message: "Resume uploaded successfully", application });
});

// ── Get ATS Report (Candidate) ──
const getATSReport = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. This is not your application." });
    }

    if (!application.resume) {
        return res.status(400).json({ success: false, message: "Please upload your resume first before generating ATS report." });
    }

    if (!application.job || !application.job.skills) {
        return res.status(400).json({ success: false, message: "Job skills not found. Cannot generate ATS report." });
    }

    // FIX: check file exists before reading
    const resumePath = path.join(__dirname, "..", "uploads", application.resume);
    if (!fs.existsSync(resumePath)) {
        return res.status(404).json({ success: false, message: "Resume file not found on server. Please re-upload your resume." });
    }

    const resumeText = await extractResumeText(resumePath);
    const result = calculateATSScore(resumeText, application.job.skills);

    res.status(200).json({ success: true, score: result.score, matchedSkills: result.matchedSkills, missingSkills: result.missingSkills });
});

// ── Get Recruiter ATS Report ──
const getRecruiterATSReport = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    if (!application.resume) {
        return res.status(400).json({ success: false, message: "Candidate has not uploaded a resume yet." });
    }

    // FIX: check file exists
    const resumePath = path.join(__dirname, "..", "uploads", application.resume);
    if (!fs.existsSync(resumePath)) {
        return res.status(404).json({ success: false, message: "Resume file not found on server. Candidate may need to re-upload." });
    }

    const resumeText = await extractResumeText(resumePath);
    const result = calculateATSScore(resumeText, application.job.skills);

    res.status(200).json({ success: true, score: result.score, matchedSkills: result.matchedSkills, missingSkills: result.missingSkills });
});

// ── AI Resume Analysis (Recruiter) ──
const getAIResumeAnalysis = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    if (!application.resume) {
        return res.status(400).json({ success: false, message: "Candidate has not uploaded a resume yet." });
    }

    // FIX: check file exists before AI analysis
    const resumePath = path.join(__dirname, "..", "uploads", application.resume);
    if (!fs.existsSync(resumePath)) {
        return res.status(404).json({ success: false, message: "Resume file not found on server. Candidate may need to re-upload." });
    }

    const resumeText = await extractResumeText(resumePath);
    const aiResult = await analyzeResumeWithAI(resumeText, application.job);

    application.aiAnalysis = aiResult;
    await application.save();

    res.status(200).json({ success: true, applicationId: application._id, analysis: aiResult });
});

// ── AI Ranked Candidates (Recruiter) ──
const getAIRankedCandidates = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    const applications = await Application.find({ job: jobId })
        .populate("candidate", "name email")
        .populate("job");

    if (applications.length === 0) {
        return res.status(404).json({ success: false, message: "No applications found for this job yet." });
    }

    // Sort by AI score — only those who have been analyzed
    const rankedCandidates = applications
        .filter((app) => app.aiAnalysis && app.aiAnalysis.score !== null)
        .sort((a, b) => b.aiAnalysis.score - a.aiAnalysis.score);

    if (rankedCandidates.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No candidates have been AI-analyzed yet. Open individual applications and click Generate AI Analysis first.",
        });
    }

    res.status(200).json({ success: true, count: rankedCandidates.length, candidates: rankedCandidates });
});

// ── AI Job Matches (Candidate) ──
const getAIJobMatches = asyncHandler(async (req, res) => {
    const candidateId = req.user._id;

    const applications = await Application.find({ candidate: candidateId });

    if (applications.length === 0) {
        return res.status(400).json({
            success: false,
            message: "You have not applied to any jobs yet. Apply to at least one job and upload your resume first.",
        });
    }

    const applicationWithResume = applications.find((app) => app.resume);
    if (!applicationWithResume) {
        return res.status(400).json({
            success: false,
            message: "Please upload your resume in one of your applications first.",
        });
    }

    // FIX: check file exists
    const resumePath = path.join(__dirname, "..", "uploads", applicationWithResume.resume);
    if (!fs.existsSync(resumePath)) {
        return res.status(404).json({
            success: false,
            message: "Resume file not found on server. Please re-upload your resume.",
        });
    }

    const resumeText = await extractResumeText(resumePath);

    const jobs = await Job.find({ status: { $ne: "closed" } });
    if (jobs.length === 0) {
        return res.status(404).json({ success: false, message: "No active jobs available to match." });
    }

    const matchedJobs = [];
    for (const job of jobs) {
        try {
            const matchResult = await matchResumeWithJob(resumeText, job);
            matchedJobs.push({ job, match: matchResult });
        } catch (err) {
            console.error(`Match failed for job ${job._id}:`, err.message);
        }
    }

    matchedJobs.sort((a, b) => b.match.matchScore - a.match.matchScore);

    res.status(200).json({ success: true, count: matchedJobs.length, jobs: matchedJobs });
});

// ── Download Resume (Recruiter) ──
const downloadResume = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied. You do not own this job." });
    }

    if (!application.resume) {
        return res.status(400).json({ success: false, message: "Candidate has not uploaded a resume yet." });
    }

    // FIX: check file exists before download
    const filePath = path.join(__dirname, "..", "uploads", application.resume);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: "Resume file not found on server. This happens when the server restarts (Render free tier). Candidate needs to re-upload.",
        });
    }

    res.download(filePath, `resume-${application.candidate}.pdf`);
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
