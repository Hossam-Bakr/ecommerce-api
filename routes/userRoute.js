const express = require("express");

const router = express.Router();
const {
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
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
} = require("../services/userService");

router
  .route("/")
  .get(getUsers)
  .post(uploadImageMiddleWare, imageProccess, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadImageMiddleWare, imageProccess, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

// change user password
router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);
module.exports = router;
