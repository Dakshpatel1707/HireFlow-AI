const pdfParse = require("pdf-parse");
const fs = require("fs");

const {
    GoogleGenerativeAI
} = require("@google/generative-ai");


// ===============================
// Gemini AI Setup
// ===============================

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


// ===============================
// Extract Resume Text
// ===============================

const extractResumeText = async (filePath) => {

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    return pdfData.text;
};


// ===============================
// Basic ATS Score
// ===============================

const calculateATSScore = (
    resumeText,
    jobSkills
) => {

    const resume = resumeText.toLowerCase();

    const matchedSkills = [];

    const missingSkills = [];


    jobSkills.forEach((skill) => {

        if (
            resume.includes(
                skill.toLowerCase()
            )
        ) {

            matchedSkills.push(skill);

        } else {

            missingSkills.push(skill);

        }

    });


    const score = jobSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length /
                jobSkills.length) * 100
        );


    return {
        score,
        matchedSkills,
        missingSkills,
    };
};


// ===============================
// Gemini AI Resume Analysis
// ===============================

const analyzeResumeWithAI = async (
    resumeText,
    job
) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash"
    });


    const prompt = `

You are an AI recruitment assistant.

Analyze the candidate resume against
the provided job.

JOB TITLE:
${job.title}

COMPANY:
${job.company}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS:
${job.skills.join(", ")}


CANDIDATE RESUME:
${resumeText}


Analyze the candidate based on:

1. Overall resume match
2. Technical skills
3. Missing skills
4. Candidate strengths
5. Candidate weaknesses
6. Relevant experience
7. Overall hiring recommendation


Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Use exactly this structure:

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

The score must be between 0 and 100.

The recommendation should be one of:

"Strong Match"
"Moderate Match"
"Weak Match"

`;


    const result =
        await model.generateContent(
            prompt
        );


    const response =
        result.response.text();


    // Remove accidental markdown
    // if Gemini returns ```json
    const cleanedResponse =
        response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


    const analysis =
        JSON.parse(cleanedResponse);


    return analysis;
};


// ===============================
// Export
// ===============================

module.exports = {

    extractResumeText,

    calculateATSScore,

    analyzeResumeWithAI,

};