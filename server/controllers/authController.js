const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const registerUser = asyncHandler(async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

        name,
        email,
        password: hashedPassword,
        role,

    });

    res.status(201).json({

        success: true,
        message: "User Registered Successfully",
        user,

    });

});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password",
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user,
    });
});

const getProfile = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
        success: true,
        message: "Profile Fetched Successfully",
        user,
    });

});


module.exports = {

    registerUser,
    loginUser,
    getProfile,
};