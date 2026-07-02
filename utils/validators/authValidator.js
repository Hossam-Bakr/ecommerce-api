const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("The user name is required !")
    .isLength({ min: 2, max: 20 })
    .withMessage("name must be between 2 and 20 characters ")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("The email is required !")
    .isEmail()
    .withMessage("Invalid email address ")
    .custom(async (value) => {
      const User = require("../../models/userModel");
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject(new Error("This email is already in use "));
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("The password is required !")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters ")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new Error("Password confirmation does not match password ");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required !"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("The email is required !")
    .isEmail()
    .withMessage("Invalid email address "),

  check("password")
    .notEmpty()
    .withMessage("The password is required !")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters "),

  validatorMiddleware,
];
