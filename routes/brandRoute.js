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
} = require("../services/brandService");


router
  .route("/")
  .get(getBrands)
  .post(createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .post(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
