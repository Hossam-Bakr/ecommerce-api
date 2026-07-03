const express = require("express");

const router = express.Router();
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  imageProccess,
} = require("../services/productService");

const authSevice = require("../services/authSevice");

/**
 * @desc    Get all products / Create new product
 * @route   GET /api/v1/products
 * @route   POST /api/v1/products
 * @access  Public for GET - Private for POST (Admin, Manager)
 */
router
  .route("/")
  .get(getProducts)
  .post(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    uploadProductImages,
    imageProccess,
    createProductValidator,
    createProduct,
  );

/**
 * @desc    Get, update, or delete specific product
 * @route   GET /api/v1/products/:id
 * @route   PUT /api/v1/products/:id
 * @route   DELETE /api/v1/products/:id
 * @access  Public for GET - Private for PUT/DELETE (Admin, Manager)
 */
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    uploadProductImages,
    imageProccess,
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;
