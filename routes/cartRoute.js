const express = require("express");

const router = express.Router();

const {
  addTocart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const authSevice = require("../services/authSevice");

router.use(authSevice.protect, authSevice.allowedTo("user"));

/**
 * @desc    Apply coupon on cart
 * @route   PUT /api/v1/cart/applyCoupon
 * @access  Private - User
 */
router.put("/applyCoupon", applyCoupon);

/**
 * @desc    Add product to cart / Get logged user cart / Clear cart
 * @route   POST /api/v1/cart
 * @route   GET /api/v1/cart
 * @route   DELETE /api/v1/cart
 * @access  Private - User
 */
router
  .route("/")
  .post(addTocart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);

/**
 * @desc    Update cart item quantity / Remove specific cart item
 * @route   PUT /api/v1/cart/:itemId
 * @route   DELETE /api/v1/cart/:itemId
 * @access  Private - User
 */
router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
