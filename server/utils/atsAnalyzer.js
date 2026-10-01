const pdfParse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Extract Resume Text (supports local path + Cloudinary URL) ──
const extractResumeText = async (filePathOrUrl) => {
    try {
        let dataBuffer;
        if (filePathOrUrl.startsWith("http://") || filePathOrUrl.startsWith("https://")) {
            const https = require("https");
            const http = require("http");
            const protocol = filePathOrUrl.startsWith("https://") ? https : http;
            dataBuffer = await new Promise((resolve, reject) => {
                protocol.get(filePathOrUrl, (response) => {
                    const chunks = [];
                    response.on("data", (chunk) => chunks.push(chunk));
                    response.on("end", () => resolve(Buffer.concat(chunks)));
                    response.on("error", reject);
                });
            });
        } else {
            if (!fs.existsSync(filePathOrUrl)) {
                throw new Error(`Resume file not found at path: ${filePathOrUrl}`);
            }
            dataBuffer = fs.readFileSync(filePathOrUrl);
        }
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text;
    } catch (error) {
        throw new Error(`Failed to extract resume text: ${error.message}`);
    }
};

// ── Basic ATS Score (keyword matching) ──
const calculateATSScore = (resumeText, jobSkills) => {
    if (!resumeText || !jobSkills || jobSkills.length === 0) {
        return { score: 0, matchedSkills: [], missingSkills: jobSkills || [] };
    }
    const resume = resumeText.toLowerCase();
    const matchedSkills = [];
    const missingSkills = [];
    jobSkills.forEach((skill) => {
        if (resume.includes(skill.toLowerCase())) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });
    const score = Math.round((matchedSkills.length / jobSkills.length) * 100);
    return { score, matchedSkills, missingSkills };
};

// ── Gemini AI Resume Analysis ──
const analyzeResumeWithAI = async (resumeText, job) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    // FIX: gemini-3.6-flash does not exist → use gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI recruitment assistant.
Analyze the candidate resume against the provided job.

JOB TITLE: ${job.title}
COMPANY: ${job.company}
JOB DESCRIPTION: ${job.description}
REQUIRED SKILLS: ${(job.skills || []).join(", ")}
CANDIDATE RESUME: ${resumeText}

Return ONLY valid JSON. No markdown. No code fences. Use exactly this structure:
{
    "score": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "matchedSkills": [],
    "missingSkills": [],
    "experienceAnalysis": "",
    "recommendation": ""
}
score: 0-100. recommendation: "Strong Match", "Moderate Match", or "Weak Match"`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        throw new Error(`AI returned invalid JSON: ${cleaned.slice(0, 100)}`);
    }
};

module.exports = { extractResumeText, calculateATSScore, analyzeResumeWithAI };
