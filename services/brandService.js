const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Brand = require("../models/brandModel");

//--> desc      get all  Brands with pagination
//--> route     GET /api/v1/Brands
//--> access    public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

//--> desc      get specific brand
//--> route     GET /api/v1/Brands/:id
//--> access    public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`there is no brand with this id :${id} `, 404));
  }
  res.status(200).json({ data: brand });
});

//--> desc      create brand
//--> route     POST /api/v1/brands
//--> access    private
exports.createBrand = asyncHandler(async (req, res, next) => {
  const {name} = req.body;
  const brand = await Brand.create({
    name: name,
    slug: slugify(name),
  });
  res.status(201).json({ data: brand });
});

//--> desc      update specific brand
//--> route     PUT /api/v1/Brands/:id
//--> access    private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
   const {name} = req.body;
  const brand = await Brand.findOneAndUpdate(
    { _id: id }, // the filter
    { name, slug: slugify(name) }, // the new data of update
    { new: true }, //options
  );
  if (!brand) {
    return next(new ApiError(`there is no brand with this id :${id} `, 404));
  }
  res.status(200).json({ data: brand });
});

//--> desc      delete specific brand
//--> route     DELETE  /api/v1/Brands/:id
//--> access    private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`there is no brand with this id :${id} `, 404));
  }
  res.status(204).json();
});
