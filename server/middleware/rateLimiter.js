const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests. Please try again later." },
    // FIX 2: Disable X-Forwarded-For validation — required for Render deployment
    validate: { xForwardedForHeader: false }
});

module.exports = limiter;