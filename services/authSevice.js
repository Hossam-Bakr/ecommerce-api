const crypto = require("crypto");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const sendEmail = require("../utils/sendEmail");
const buildEmailMessage = require("../utils/buildEmailMessage");
const createToken = require("../utils/createToken");

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

/**
 * @desc    Login user and return JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new Error(new ApiError("invalid email or password !", 401));
  }

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

/**
 * @desc    Protect routes and verify authenticated user
 * @route   Middleware
 * @access  Private
 */
exports.protect = asyncHandler(async (req, res, next) => {
  // Check if authorization header exists and extract bearer token
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new ApiError(
        "your are not logged in , please login to can access this route ",
      ),
    );
  }

  // Verify token signature and expiration
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if user related to this token still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("this token belongs to user does not longer exists  ", 401),
    );
  }

  // Check if password was changed after token was issued
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (passwordChangedAtTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password , please login again ",
          401,
        ),
      );
    }
  }

  req.user = currentUser;
  next();
});

/**
 * @desc    Restrict route access by user roles
 * @route   Middleware
 * @access  Private
 */
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you are not allowed to access this route "));
    }
    next();
  });

/**
 * @desc    Generate and send password reset code to user email
 * @route   POST /api/v1/auth/forgotPassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Check if user exists by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with this email ${req.body.email}`),
    );
  }

  // Generate random 6-digit reset code and store hashed value in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.hashedResetCode = hashedResetCode;
  user.resetCodeExpireDate = Date.now() + 10 * 60 * 1000;
  user.resetCodeVerified = false;
  user.save();

  // Send plain reset code to user email
  const message = buildEmailMessage(user, resetCode);

  try {
    await sendEmail({
      email: user.email,
      subject: "your password Reset code (valid for 10 minutes  ) ",
      message,
    });
  } catch (error) {
    user.hashedResetCode = undefined;
    user.resetCodeExpireDate = undefined;
    user.resetCodeVerified = undefined;
    await user.save();
    return next(new ApiError("there is a problem in sending email "));
  }

  res.status(200).json({
    status: "success",
    message: "you recieved a reset code , check your email messages ",
  });
});

/**
 * @desc    Verify password reset code
 * @route   POST /api/v1/auth/verifyResetCode
 * @access  Public
 */
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    hashedResetCode,
    resetCodeExpireDate: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("invalid or expired reset code "));
  }

  user.resetCodeVerified = true;
  user.save();

  res.status(200).json({ status: "success" });
});

/**
 * @desc    Reset user password after reset code verification
 * @route   PUT /api/v1/auth/resetPassword
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Check user existence by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`there is no user with email ${req.body.email} `));
  }

  // Ensure reset code has been verified before allowing password reset
  if (!user.resetCodeVerified) {
    return next(
      new ApiError(
        `password reset code not verified , please verify it and try again `,
      ),
    );
  }

  user.password = req.body.newPassword;
  user.hashedResetCode = undefined;
  user.resetCodeExpireDate = undefined;
  user.resetCodeVerified = undefined;
  user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
