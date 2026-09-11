const Job = require("../models/Job");
const asyncHandler = require("express-async-handler");

const createJob = asyncHandler(async (req, res) => {

    const {
        title,
        company,
        location,
        salary,
        description,
        skills,
    } = req.body;

    const job = await Job.create({
        title,
        company,
        location,
        salary,
        description,
        skills,
        recruiter: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Job Created Successfully",
        job,
    })

});

const getAllJobs = asyncHandler(async (req, res) => {


    const keyword = req.query.keyword || "";
    const location = req.query.location || "";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const minSalary = Number(req.query.minSalary) || 0;
    const maxSalary = Number(req.query.maxSalary) || Infinity;
   const query = {
    title: {
        $regex: keyword,
        $options: "i",
    },

    location: {
        $regex: location,
        $options: "i",
    },

    salary: {
        $gte: minSalary,
        $lte: maxSalary,
    },
};
    let sortOption = { createdAt: -1 };

    if (req.query.sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    if (req.query.sort === "salary_high") {
        sortOption = { salary: -1 };
    }

    if (req.query.sort === "salary_low") {
        sortOption = { salary: 1 };
    }

    const jobs = await Job.find(query)
        .populate("recruiter", "name companyName")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        jobs,
    });


});

const getSingleJob = asyncHandler(async (req, res) => {


    const job = await Job.findById(req.params.id)
        .populate("recruiter", "name email");

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    res.status(200).json({
        success: true,
        job,
    });

});


const getMyJobs = asyncHandler(async (req, res) => {

    const jobs = await Job.find({
        recruiter: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: jobs.length,
        jobs,
    });

});

const updateJob = asyncHandler(async (req, res) => {

    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    const updatedJob = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Job Updated Successfully",
        updatedJob,
    });


});

const deleteJob = asyncHandler(async (req, res) => {


    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: "Job Not Found",
        });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access Denied",
        });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Job Deleted Successfully",
    });


});


module.exports = {
    createJob,
    getAllJobs,
    getSingleJob,
    getMyJobs,
    updateJob,
    deleteJob,
};

