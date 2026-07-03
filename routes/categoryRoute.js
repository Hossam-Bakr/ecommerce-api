const express = require("express");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  uploadImageMiddleWare,
  imageProccess,
} = require("../services/categoryService");

const authSevice = require("../services/authSevice");

/**
 * @desc    Mount subcategory routes under category resource
 * @route   /api/v1/categories/:categoryId/subcategories
 * @access  Mixed - depends on subcategory route handlers
 */
router.use("/:categoryId/subcategories", subCategoryRoute);

/**
 * @desc    Get all categories / Create new category
 * @route   GET /api/v1/categories
 * @route   POST /api/v1/categories
 * @access  Public for GET - Private for POST (Admin, Manager)
 */
router
  .route("/")
  .get(getCategories)
  .post(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    uploadImageMiddleWare,
    imageProccess,
    createCategoryValidator,
    createCategory,
  );

/**
 * @desc    Get, update, or delete specific category
 * @route   GET /api/v1/categories/:id
 * @route   PUT /api/v1/categories/:id
 * @route   DELETE /api/v1/categories/:id
 * @access  Public for GET - Private for PUT (Admin, Manager) - Private for DELETE (Admin)
 */
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    uploadImageMiddleWare,
    imageProccess,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    authSevice.protect,
    authSevice.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory,
  );

module.exports = router;
