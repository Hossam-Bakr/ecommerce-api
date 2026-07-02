const express = require("express");

const router = express.Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const { signup, login } = require("../services/authSevice");

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);

module.exports = router;
