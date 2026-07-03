const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const factory = require("./factoryHandler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImages");

/**
 * @desc    Upload single category image
 * @route   Middleware for category create/update routes
 * @access  Private - Admin, Manager
 */
exports.uploadImageMiddleWare = uploadSingleImage("image");

/**
 * @desc    Resize and save uploaded category image
 * @route   Middleware for category create/update routes
 * @access  Private - Admin, Manager
 */
exports.imageProccess = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuid()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .resize({ width: 600, height: 600 })
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    // Save image name into request body to store it in database
    req.body.image = filename;
  }

  next();
});

/**
 * @desc    Get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = factory.getOne(CategoryModel);

/**
 * @desc    Create new category
 * @route   POST /api/v1/categories
 * @access  Private - Admin, Manager
 */
exports.createCategory = factory.createOne(CategoryModel);

/**
 * @desc    Update specific category by id
 * @route   PUT /api/v1/categories/:id
 * @access  Private - Admin, Manager
 */
exports.updateCategory = factory.updateOne(CategoryModel);

/**
 * @desc    Delete specific category by id
 * @route   DELETE /api/v1/categories/:id
 * @access  Private - Admin
 */
exports.deleteCategory = factory.deleteOne(CategoryModel);

/**
 * @desc    Get all categories with pagination
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = factory.getAll(CategoryModel);
