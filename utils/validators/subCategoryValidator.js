const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory ID Format "),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("The subCategory name is required !")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between 3 and 32 characters ")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("SubCategory must be belongs to parent Category ")
    .isMongoId()
    .withMessage("invalid subCategory id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format "),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format "),
  validatorMiddleware,
];
