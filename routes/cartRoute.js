const express = require("express");

const router = express.Router();

const { addTocart, getLoggedUserCart } = require("../services/cartService");

const authSevice = require("../services/authSevice");

router.use(authSevice.protect, authSevice.allowedTo("user"));

router.route("/").post(addTocart).get(getLoggedUserCart);

module.exports = router;
