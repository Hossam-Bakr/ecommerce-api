const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadSingleImage");

exports.imageProccess = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${uuid()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize({ width: 600, height: 600 })
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  // save the image name into db
  req.body.image = filename;
  next();
});

exports.uploadImageMiddleWare = uploadSingleImage("image");

//--> desc      get all  Brands with pagination
//--> route     GET /api/v1/Brands
//--> access    public
exports.getBrands = factory.getAll(Brand);

//--> desc      get specific brand
//--> route     GET /api/v1/Brands/:id
//--> access    public
exports.getBrand = factory.getOne(Brand);

//--> desc      create brand
//--> route     POST /api/v1/brands
//--> access    private
exports.createBrand = factory.createOne(Brand);

//--> desc      update specific brand
//--> route     PUT /api/v1/Brands/:id
//--> access    private

exports.updateBrand = factory.updateOne(Brand);

//--> desc      delete specific brand
//--> route     DELETE  /api/v1/Brands/:id
//--> access    private
exports.deleteBrand = factory.deleteOne(Brand);
