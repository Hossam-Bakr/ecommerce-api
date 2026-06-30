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

router
  .route("/")
  .get(getBrands)
  .post(
    uploadImageMiddleWare,
    imageProccess,
    createBrandValidator,
    createBrand,
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadImageMiddleWare, imageProccess, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
