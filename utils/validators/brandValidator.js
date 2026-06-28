const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID Format "),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("The brand name is required !")
    .isLength({ min: 3, max: 32 })
    .withMessage("name must be between 3 and 32 characters ")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id format "),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id format "),
  validatorMiddleware,
];
