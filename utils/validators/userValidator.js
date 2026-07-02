const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format "),
  validatorMiddleware,
];

exports.createUserValidator = [
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

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA numbers "),

  check("profileImg").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format "),

  check("name")
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage("name must be between 2 and 20 characters ")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .optional()
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

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA numbers "),

  check("profileImg").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format "),

  check("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password "),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirmation "),

  check("password")
    .notEmpty()
    .withMessage("You must enter a new password ")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters ")
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id ");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password ");
      }

      if (value !== req.body.passwordConfirm) {
        throw new Error("Password confirmation does not match password ");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format "),
  validatorMiddleware,
];
