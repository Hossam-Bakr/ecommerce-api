const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const factory = require("./factoryHandler");

/**
 * @desc    Get all reviews with pagination
 * @route   GET /api/v1/reviews
 * @access  Public
 */
exports.getReviews = factory.getAll(Review);

/**
 * @desc    Get specific review by id
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = factory.getOne(Review);

/**
 * @desc    Create new review
 * @route   POST /api/v1/reviews
 * @access  Private
 */
exports.createReview = factory.createOne(Review);

/**
 * @desc    Update specific review by id
 * @route   PUT /api/v1/reviews/:id
 * @access  Private
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @desc    Delete specific review by id
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
exports.deleteReview = factory.deleteOne(Review);

exports.createFilterObj = (req, res, next) => {
  const filterObject = req.params.productId
    ? { product: req.params.productId }
    : {};

  req.filterObject = filterObject;
  next();
};

/**
 * @desc    Set product id in request body for nested reviews creation
 * @route   Middleware for POST /api/v1/products/:productId/reviews
 * @access  Private - Admin, Manager
 */
exports.setProductIdAndUserIdInBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};
