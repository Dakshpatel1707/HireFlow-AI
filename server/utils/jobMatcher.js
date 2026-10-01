const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const matchResumeWithJob = async (resumeText, job) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    // FIX: gemini-3.6-flash does not exist → use gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI recruitment assistant.
Analyze how well a candidate's resume matches this job.

JOB TITLE: ${job.title}
COMPANY: ${job.company}
JOB DESCRIPTION: ${job.description}
REQUIRED SKILLS: ${(job.skills || []).join(", ")}
CANDIDATE RESUME: ${resumeText}

Return ONLY valid JSON. No markdown. No code fences. Use exactly this structure:
{
    "matchScore": 0,
    "matchLevel": "",
    "matchedSkills": [],
    "missingSkills": [],
    "reason": ""
}
matchScore: 0-100. matchLevel: "Excellent Match", "Good Match", "Moderate Match", or "Weak Match"`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        throw new Error(`AI returned invalid JSON: ${cleaned.slice(0, 100)}`);
    }
};

module.exports = { matchResumeWithJob };
