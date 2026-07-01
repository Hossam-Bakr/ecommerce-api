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

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    imageProccess,
    createProductValidator,
    createProduct,
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    imageProccess,
    updateProductValidator,
    updateProduct,
  )
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
