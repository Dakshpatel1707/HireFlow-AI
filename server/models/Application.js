const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resume: {
            type: String,
            default: "",
        },

       status: {
    type: String,
    enum: [
        "Pending",
        "Shortlisted",
        "Accepted",
        "Rejected"
    ],
    default: "Pending",
},
        aiAnalysis: {
    score: {
        type: Number,
        default: null,
    },

    summary: {
        type: String,
        default: "",
    },

    strengths: {
        type: [String],
        default: [],
    },

    weaknesses: {
        type: [String],
        default: [],
    },

    matchedSkills: {
        type: [String],
        default: [],
    },

    missingSkills: {
        type: [String],
        default: [],
    },

    experienceAnalysis: {
        type: String,
        default: "",
    },

    recommendation: {
        type: String,
        default: "",
    },
},
    },
    
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Application", applicationSchema);