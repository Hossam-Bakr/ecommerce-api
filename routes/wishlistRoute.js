const express = require("express");

const router = express.Router();

const {
  addProductToWishList,
  removeProductToWishList,
  getLoggedUserWishList,
} = require("../services/wishlistService");

const authSevice = require("../services/authSevice");

/**
 * @desc    Get all brands / Create new brand
 * @route   GET /api/v1/brands
 * @route   POST /api/v1/brands
 * @access  Public for GET - Private for POST (Admin, Manager)
 */

router.use(authSevice.protect, authSevice.allowedTo("user"));

router.route("/").post(addProductToWishList).get(getLoggedUserWishList);

router.delete("/:productId", removeProductToWishList);

module.exports = router;
