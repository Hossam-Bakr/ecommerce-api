const express = require("express");

const router = express.Router();
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadImageMiddleWare,
  imageProccess,
} = require("../services/brandService");

const authSevice = require("../services/authSevice");

/**
 * @desc    Get all brands / Create new brand
 * @route   GET /api/v1/brands
 * @route   POST /api/v1/brands
 * @access  Public for GET - Private for POST (Admin, Manager)
 */
router
  .route("/")
  .get(getBrands)
  .post(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    uploadImageMiddleWare,
    imageProccess,
    createBrandValidator,
    createBrand,
  );

/**
 * @desc    Get, update, or delete specific brand
 * @route   GET /api/v1/brands/:id
 * @route   PUT /api/v1/brands/:id
 * @route   DELETE /api/v1/brands/:id
 * @access  Public for GET - Private for PUT (Admin, Manager) - Private for DELETE (Admin)
 */
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authSevice.protect,
    authSevice.allowedTo("admin", "manager"),
    uploadImageMiddleWare,
    imageProccess,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    authSevice.protect,
    authSevice.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand,
  );

module.exports = router;
