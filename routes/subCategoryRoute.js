const express = require("express");

const router = express.Router({ mergeParams: true });
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdInBody,
  createFilterObj,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authSevice = require("../services/authSevice");

/**
 * @desc    Get all subcategories / Create new subcategory
 * @route   GET /api/v1/subcategories
 * @route   POST /api/v1/subcategories
 * @route   GET /api/v1/categories/:categoryId/subcategories
 * @route   POST /api/v1/categories/:categoryId/subcategories
 * @access  Public for GET - Private for POST (Admin, Manager)
 */
router
  .route("/")
  .post(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    setCategoryIdInBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFilterObj, getSubCategories);

/**
 * @desc    Get, update, or delete specific subcategory
 * @route   GET /api/v1/subcategories/:id
 * @route   PUT /api/v1/subcategories/:id
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Public for GET - Private for PUT (Admin, Manager) - Private for DELETE (Admin)
 */
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    authSevice.protect,
    authSevice.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;
