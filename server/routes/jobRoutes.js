const express = require("express");

const router = express.Router();

const { createJob, getAllJobs , getSingleJob,getMyJobs, updateJob, deleteJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { recruiterOnly } = require("../middleware/roleMiddleware");

router.post("/create", protect, recruiterOnly, createJob);
router.get("/", getAllJobs);
router.get("/my/jobs", protect, recruiterOnly, getMyJobs);
router.get("/:id",getSingleJob);
router.put( "/:id", protect, recruiterOnly, updateJob);
router.delete( "/:id", protect, recruiterOnly,  deleteJob);
module.exports = router;

