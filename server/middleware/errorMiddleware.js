const errorHandler = (err, req, res, next) => {
    console.error("Server Error:", err.message);

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File too large. Maximum size is 5MB." });
    }

    // Multer file type error
    if (err.message && err.message.includes("Only PDF")) {
        return res.status(400).json({ success: false, message: err.message });
    }

    // MongoDB duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(400).json({ success: false, message: `${field} already exists.` });
    }

    // MongoDB validation
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: messages.join(". ") });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }

    // MongoDB invalid ID
    if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: "Invalid ID format." });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
