const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getProfile} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {registerValidation,} = require("../middleware/validationMiddleware");

router.post("/register",registerValidation,registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,getProfile);
module.exports = router;