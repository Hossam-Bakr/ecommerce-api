const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdInBody,
} = require("../services/reviewService");
const authSevice = require("../services/authSevice");

/**
 * @desc    Get all reviews / Create new review
 * @route   GET /api/v1/reviews
 * @route   POST /api/v1/reviews
 * @access  Public for GET - Private for POST - users
 */
router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authSevice.protect,
    authSevice.allowedTo("user"),
    setProductIdAndUserIdInBody,
    createReviewValidator,
    createReview,
  );

/**
 * @desc    Get, update, or delete specific review
 * @route   GET /api/v1/reviews/:id
 * @route   PUT /api/v1/reviews/:id
 * @route   DELETE /api/v1/reviews/:id
 * @access  Public for user (own review only) - manager - admin
 */
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authSevice.protect,
    authSevice.allowedTo("user"),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authSevice.protect,
    authSevice.allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
