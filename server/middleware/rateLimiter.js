const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests. Please try again later." },
    // FIX: This tells express-rate-limit to trust the proxy header
    // Required when deployed on Render, Railway, Heroku etc.
    validate: { xForwardedForHeader: false }
});

module.exports = limiter;