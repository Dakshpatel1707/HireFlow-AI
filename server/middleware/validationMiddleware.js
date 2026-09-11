const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = {
  registerValidation,
};