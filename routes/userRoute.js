const express = require("express");

const router = express.Router();
const authSevice = require("../services/authSevice");

const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  uploadImageMiddleWare,
  imageProccess,
  changeUserPassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deActivateLoggedUser,
} = require("../services/userService");

/**
 * @desc    Protect all user routes
 * @route   /api/v1/users/*
 * @access  Private - Logged in users only
 */
router.use(authSevice.protect);

/**
 * @desc    Get current logged user data
 * @route   GET /api/v1/users/getMe
 * @access  Private - Logged in users
 */
router.get("/getMe", getLoggedUserData, getUser);

/**
 * @desc    Change current logged user password
 * @route   PUT /api/v1/users/changeMyPassword
 * @access  Private - Logged in users
 */
router.put("/changeMyPassword", changeLoggedUserPassword);

/**
 * @desc    Update current logged user data
 * @route   PUT /api/v1/users/updateMe
 * @access  Private - Logged in users
 */
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);

/**
 * @desc    Deactivate current logged user profile
 * @route   PUT /api/v1/users/deActiveMyProfile
 * @access  Private - Logged in users
 */
router.put("/deActiveMyProfile", deActivateLoggedUser);

/**
 * @desc    Restrict following routes to admin and manager
 * @route   /api/v1/users/*
 * @access  Private - Admin, Manager
 */
router.use(authSevice.allowedTo("admin", "manager"));

/**
 * @desc    Get all users / Create new user
 * @route   GET /api/v1/users
 * @route   POST /api/v1/users
 * @access  Private - GET for Admin/Manager, POST for Admin only
 */
router
  .route("/")
  .get(getUsers)
  .post(
    authSevice.allowedTo("admin"),
    uploadImageMiddleWare,
    imageProccess,
    createUserValidator,
    createUser,
  );

/**
 * @desc    Get, update, or delete specific user
 * @route   GET /api/v1/users/:id
 * @route   PUT /api/v1/users/:id
 * @route   DELETE /api/v1/users/:id
 * @access  Private - Admin, Manager
 */
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadImageMiddleWare, imageProccess, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

/**
 * @desc    Change specific user password
 * @route   PUT /api/v1/users/changePassword/:id
 * @access  Private - Admin, Manager
 */
router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
