const express = require("express");

const router = express.Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authSevice");

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
router.post("/signup", signupValidator, signup);

/**
 * @desc    Login user and return JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
router.post("/login", loginValidator, login);

/**
 * @desc    Send password reset code to user email
 * @route   POST /api/v1/auth/forgotPassword
 * @access  Public
 */
router.post("/forgotPassword", forgotPassword);

/**
 * @desc    Verify password reset code
 * @route   POST /api/v1/auth/verifyResetCode
 * @access  Public
 */
router.post("/verifyResetCode", verifyPassResetCode);

/**
 * @desc    Reset user password after code verification
 * @route   PUT /api/v1/auth/resetPassword
 * @access  Public
 */
router.put("/resetPassword", resetPassword);

module.exports = router;
