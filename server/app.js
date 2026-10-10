const express = require("express");
const cors = require("cors");
const path = require("path");

const limiter = require("./middleware/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// FIX: Trust Render's proxy — fixes ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate Limiter
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "HireFlow AI Backend Running ✅", status: "ok" });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;