const slugify = require("slugify");
const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Too short product description")
    .isLength({ max: 2000 })
    .withMessage("Too long product description"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 1 })
    .withMessage("Product price must be a number greater than or equal 1"),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 1 })
    .withMessage(
      "Price after discount must be a number greater than or equal 1",
    )
    .custom((value, { req }) => {
      if (Number(value) >= Number(req.body.price)) {
        throw new Error(
          "Price after discount must be lower than original price",
        );
      }
      return true;
    }),

  check("availableQuantity")
    .notEmpty()
    .withMessage("Available quantity is required")
    .isInt({ min: 0 })
    .withMessage(
      "Available quantity must be an integer greater than or equal 0",
    ),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold must be an integer greater than or equal 0"),

  check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required")
    .trim(),

  check("imagesOfProduct")
    .optional()
    .isArray()
    .withMessage("Images of product must be an array"),

  check("imagesOfProduct.*")
    .optional()
    .isString()
    .withMessage("Each product image must be a string"),

  check("colors").optional().isArray().withMessage("Colors must be an array"),

  check("colors.*")
    .optional()
    .isString()
    .withMessage("Each color must be a string"),

  check("ratingAvg")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5"),

  check("numberOfRatings")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Number of ratings must be greater than or equal 0"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`There is no category with this id: ${categoryId}`);
      }
      return true;
    }),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array")
    .custom(async (subCategoriesIds) => {
      const results = await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      });

      if (results.length < 1 || results.length !== subCategoriesIds.length) {
        throw new Error(`invalid subcategories ids  `);
      }
    })

    // to sure if the subcategories belongs to the category in body or not
    .custom(async (subCategoriesIds, { req }) => {
      const subs = await SubCategory.find({ category: req.body.category });
      // we want to get array of ids only
      const subCategoriesIdsArr = [];
      subs.forEach((sub) => {
        subCategoriesIdsArr.push(sub._id.toString());
      });
      const isAllSubCatsBelongsToCategory = subCategoriesIds.every((v) =>
        subCategoriesIdsArr.includes(v),
      );
      if (!isAllSubCatsBelongsToCategory) {
        throw new Error(`All SubCategories must belongs to Category  `);
      }
    }),

  check("subCategory.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format"),

  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),

  validatorMiddleware,
];

exports.getProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),

  check("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage("Too short product description")
    .isLength({ max: 2000 })
    .withMessage("Too long product description"),

  check("price")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Product price must be a number greater than or equal 1"),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 1 })
    .withMessage(
      "Price after discount must be a number greater than or equal 1",
    )
    .custom((value, { req }) => {
      if (req.body.price && Number(value) >= Number(req.body.price)) {
        throw new Error(
          "Price after discount must be lower than original price",
        );
      }
      return true;
    }),

  check("availableQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      "Available quantity must be an integer greater than or equal 0",
    ),

  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold must be an integer greater than or equal 0"),

  check("imageCover")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product image cover must not be empty"),

  check("imagesOfProduct")
    .optional()
    .isArray()
    .withMessage("Images of product must be an array"),

  check("imagesOfProduct.*")
    .optional()
    .isString()
    .withMessage("Each product image must be a string"),

  check("colors").optional().isArray().withMessage("Colors must be an array"),

  check("colors.*")
    .optional()
    .isString()
    .withMessage("Each color must be a string"),

  check("ratingAvg")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5"),

  check("numberOfRatings")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Number of ratings must be greater than or equal 0"),

  // check("category")
  //   .optional()
  //   .isMongoId()
  //   .withMessage("Invalid category ID format")
  //   .custom((categoryId) => {
  //     Category.findById(categoryId).then((category) => {
  //       if (!category) {
  //         return Promise.reject(
  //           new Error(`there is no category with this id ${categoryId} `),
  //         );
  //       }
  //     });
  //   })

  // check("subCategories")
  //   .optional()
  //   .isArray()
  //   .withMessage("Subcategories must be an array")
  //   .custom((subCategoriesIds) => {
  //     SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } }).then(
  //       (results) => {
  //         if (
  //           results.length < 1 ||
  //           results.length !== subCategoriesIds.length
  //         ) {
  //           return Promise.reject(new Error("invalid Id of subcategory "));
  //         }
  //       },
  //     );
  //   })
  // to sure if the sub categories belongs to the category in body or not
  //   .custom((subCategoriesIds, { req }) => {
  //     SubCategory.find({ category: req.body.category }).then(
  //       (catSubCategories) => {
  //         console.log(catSubCategories);
  //       },
  //     );
  //   }),

  check("subCategory.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format"),

  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
