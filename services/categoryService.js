const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const factory = require("./factoryHandler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImages");

exports.imageProccess = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuid()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize({ width: 600, height: 600 })
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  // save the image name into db
  req.body.image = filename;
  next();
});

exports.uploadImageMiddleWare = uploadSingleImage("image");
//--> desc      get specific category
//--> route     GET /api/v1/categories/:id
//--> access    public
exports.getCategory = factory.getOne(CategoryModel);

//--> desc      create category
//--> route     POST /api/v1/categories
//--> access    private
exports.createCategory = factory.createOne(CategoryModel);

//--> desc      update specific category
//--> route     PUT /api/v1/categories/:id
//--> access    private
exports.updateCategory = factory.updateOne(CategoryModel);

//--> desc      delete specific category
//--> route     DELETE  /api/v1/categories/:id
//--> access    private

exports.deleteCategory = factory.deleteOne(CategoryModel);

//--> desc      get all  categories with pagination
//--> route     GET /api/v1/categories
//--> access    public
exports.getCategories = factory.getAll(CategoryModel);
