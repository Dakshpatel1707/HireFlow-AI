const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


const matchResumeWithJob = async (
    resumeText,
    job
) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash"
    });


    const prompt = `
You are an AI recruitment assistant.

Your task is to analyze how well a candidate's resume
matches a particular job.

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

1. Required technical skills
2. Relevant experience
3. Job description match
4. Overall suitability


Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Use exactly this structure:

{
    "matchScore": 0,
    "matchLevel": "",
    "matchedSkills": [],
    "missingSkills": [],
    "reason": ""
}

Rules:

- matchScore must be between 0 and 100.
- matchLevel must be one of:
  "Excellent Match"
  "Good Match"
  "Moderate Match"
  "Weak Match"

- matchedSkills must contain skills from the job
  that are also present in the candidate resume.

- missingSkills must contain important job skills
  that are missing from the candidate resume.

- reason should briefly explain why the candidate
  matches or does not match the job.
`;


    const result = await model.generateContent(prompt);

    const response = result.response.text();


    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();


    return JSON.parse(cleanedResponse);
};


module.exports = {
    matchResumeWithJob,
};