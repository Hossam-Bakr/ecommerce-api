const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("./factoryHandler");
const ApiError = require("../utils/ApiError");
const multer = require("multer");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middlewares/uploadImages");

/**
 * @desc    Upload product cover image and gallery images
 * @route   Middleware for product create/update routes
 * @access  Private - Admin, Manager
 */
exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "imagesOfProduct", maxCount: 8 },
]);

/**
 * @desc    Resize and save uploaded product images
 * @route   Middleware for product create/update routes
 * @access  Private - Admin, Manager
 */
exports.imageProccess = asyncHandler(async (req, res, next) => {
  const imageCoverFileName = `Product-${uuid()}-${Date.now()}-cover.jpeg`;

  if (req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .toFormat("jpeg")
      .resize({ width: 2000, height: 1333 })
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image cover name into request body to store it in database
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.imagesOfProduct) {
    let listOfImagesOfProduct = [];

    await Promise.all(
      req.files.imagesOfProduct.map(async (imageInArr, index) => {
        const imageName = `Product-${uuid()}-${Date.now()}-${index}.jpeg`;

        await sharp(imageInArr.buffer)
          .toFormat("jpeg")
          .resize({ width: 2000, height: 1333 })
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);

        listOfImagesOfProduct.push(imageName);
      }),
    );

    req.body.imagesOfProduct = listOfImagesOfProduct;
  }

  next();
});

/**
 * @desc    Get specific product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = factory.getOne(Product, "reviews");

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @access  Private - Admin, Manager
 */
exports.createProduct = factory.createOne(Product);

/**
 * @desc    Update specific product by id
 * @route   PUT /api/v1/products/:id
 * @access  Private - Admin, Manager
 */
exports.updateProduct = factory.updateOne(Product);

/**
 * @desc    Delete specific product by id
 * @route   DELETE /api/v1/products/:id
 * @access  Private - Admin, Manager
 */
exports.deleteProduct = factory.deleteOne(Product);

/**
 * @desc    Get all products with pagination
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = factory.getAll(Product, "products");
