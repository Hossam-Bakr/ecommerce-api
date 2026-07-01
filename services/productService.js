const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("./factoryHandler");
const ApiError = require("../utils/ApiError");
const multer = require("multer");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middlewares/uploadImages");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "imagesOfProduct", maxCount: 8 },
]);

exports.imageProccess = asyncHandler(async (req, res, next) => {
  const imageCoverFileName = `Product-${uuid()}-${Date.now()}-cover.jpeg`;
  if (req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .toFormat("jpeg")
      .resize({ width: 2000, height: 1333 })
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    // save the image name into db
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

//--> desc      get specific product
//--> route     GET /api/v1/products/:id
//--> access    public
exports.getProduct = factory.getOne(Product);

//--> desc      create product
//--> route     POST /api/v1/products
//--> access    private
exports.createProduct = factory.createOne(Product);

//--> desc      update specific product
//--> route     PUT /api/v1/products/:id
//--> access    private
exports.updateProduct = factory.updateOne(Product);

//--> desc      delete specific product
//--> route     DELETE  /api/v1/products/:id
//--> access    private
exports.deleteProduct = factory.deleteOne(Product);

//--> desc      get all  products  with pagination
//--> route     GET /api/v1/products
//--> access    public
exports.getProducts = factory.getAll(Product, "products");
