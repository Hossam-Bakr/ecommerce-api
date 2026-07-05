const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("the rating must be not empty ")
    .isFloat({ min: 1, max: 5 })
    .withMessage("the rating must be between 1 and 5 ")
    .custom(async (value, { req }) => {
      // check if the user with id made a review on this product before or not

      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        return Promise.reject(
          new Error("You alraady made a review on this product before "),
        );
      }
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  // check if the review to update belongs to this user or not ?

  check("id")
    .isMongoId()
    .withMessage("invalid review id format ")
    .custom(async (value, { req }) => {
      const review = await Review.findById(value);
      if (!review) {
        return Promise.reject(new Error("there is no review with this id  "));
      }
      if (!review.user._id.equals(req.user._id)) {
        return Promise.reject(
          new Error("you are not allowed to perform this action  "),
        );
      }
    }),

  check("title").optional(),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid review id format ")
    .custom(async (value, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(value);
        if (!review) {
          return Promise.reject(new Error("there is no review with this id  "));
        }
        if (!review.user._id.equals(req.user._id)) {
          return Promise.reject(
            new Error("you are not allowed to perform this action  "),
          );
        }
      }
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review ID Format "),
  validatorMiddleware,
];
