const express = require("express");

const router = express.Router();

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");

const authSevice = require("../services/authSevice");

router
  .route("/")
  .post(authSevice.protect, authSevice.allowedTo("user"), addAddress)
  .get(
    authSevice.protect,
    authSevice.allowedTo("user"),
    getLoggedUserAddresses,
  );

router
  .route("/:addressId")
  .delete(authSevice.protect, authSevice.allowedTo("user"), removeAddress);

module.exports = router;
