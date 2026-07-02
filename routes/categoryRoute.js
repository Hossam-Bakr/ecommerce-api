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
const AuthSevice = require("../services/authSevice");

router.use("/:categoryId/subcategories/", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    AuthSevice.protect,
    uploadImageMiddleWare,
    imageProccess,
    createCategoryValidator,
    createCategory,
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadImageMiddleWare,
    imageProccess,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
