const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImages");

/**
 * @desc    Upload single brand image
 * @route   Middleware for brand create/update routes
 * @access  Private - Admin, Manager
 */
exports.uploadImageMiddleWare = uploadSingleImage("image");

/**
 * @desc    Resize and save uploaded brand image
 * @route   Middleware for brand create/update routes
 * @access  Private - Admin, Manager
 */
exports.imageProccess = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${uuid()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize({ width: 600, height: 600 })
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  // Save image name into request body to store it in database
  req.body.image = filename;
  next();
});

/**
 * @desc    Get all brands with pagination
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getBrands = factory.getAll(Brand);

/**
 * @desc    Get specific brand by id
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getBrand = factory.getOne(Brand);

/**
 * @desc    Create new brand
 * @route   POST /api/v1/brands
 * @access  Private - Admin, Manager
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @desc    Update specific brand by id
 * @route   PUT /api/v1/brands/:id
 * @access  Private - Admin, Manager
 */
exports.updateBrand = factory.updateOne(Brand);

/**
 * @desc    Delete specific brand by id
 * @route   DELETE /api/v1/brands/:id
 * @access  Private - Admin
 */
exports.deleteBrand = factory.deleteOne(Brand);
