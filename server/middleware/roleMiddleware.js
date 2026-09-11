const recruiterOnly = (req, res, next) => {

    if (req.user.role !== "recruiter") {

        return res.status(403).json({
            success: false,
            message: "Access Denied. Recruiters Only.",
        });

    }

    next();

};
const candidateOnly = (req, res, next) => {

    if (req.user.role !== "candidate") {
        return res.status(403).json({
            success: false,
            message: "Candidate Access Only",
        });
    }

    next();
};
module.exports = {
    recruiterOnly,
    candidateOnly,
};