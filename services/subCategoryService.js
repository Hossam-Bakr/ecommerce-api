const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./factoryHandler");

/**
 * @desc    Create new subcategory
 * @route   POST /api/v1/subcategories
 * @route   POST /api/v1/categories/:categoryId/subcategories
 * @access  Private - Admin, Manager
 */
exports.createSubCategory = factory.createOne(subCategoryModel);

/**
 * @desc    Get specific subcategory by id
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */
exports.getSubCategory = factory.getOne(subCategoryModel);

/**
 * @desc    Update specific subcategory by id
 * @route   PUT /api/v1/subcategories/:id
 * @access  Private - Admin, Manager
 */
exports.updateSubCategory = factory.updateOne(subCategoryModel);

/**
 * @desc    Delete specific subcategory by id
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private - Admin
 */
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);

/**
 * @desc    Get all subcategories with optional category filter
 * @route   GET /api/v1/subcategories
 * @route   GET /api/v1/categories/:categoryId/subcategories
 * @access  Public
 */
exports.getSubCategories = factory.getAll(subCategoryModel);

/**
 * @desc    Set category id in request body for nested subcategory creation
 * @route   Middleware for POST /api/v1/categories/:categoryId/subcategories
 * @access  Private - Admin, Manager
 */
exports.setCategoryIdInBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

/**
 * @desc    Create filter object for nested subcategory routes
 * @route   Middleware for GET /api/v1/categories/:categoryId/subcategories
 * @access  Public
 */
exports.createFilterObj = (req, res, next) => {
  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};

  req.filterObject = filterObject;
  next();
};
