const express = require("express");
const cors = require("cors");

const limiter = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());


//Rate Limiter
app.use(limiter);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);



app.get("/", (req, res) => {
    res.json({
        message: "Welcome to HireFlow AI Backend"
    });
});

app.use(errorHandler);

module.exports = app;