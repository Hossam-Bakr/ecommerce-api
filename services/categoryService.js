const CategoryModel = require("../Models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

//--> desc      get all  categories with pagination
//--> route     GET /api/v1/categories
//--> access    public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

//--> desc      get specific category
//--> route     GET /api/v1/categories/:id
//--> access    public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`there is no category with this id :${id} `, 404));
  }
  res.status(200).json({ data: category });
});

//--> desc      create category
//--> route     POST /api/v1/categories
//--> access    private
exports.createCategory = asyncHandler(async (req, res, next) => {
  name = req.body.name;
  const category = await CategoryModel.create({
    name: name,
    slug: slugify(name),
  });
  res.status(201).json({ data: category });
});

//--> desc      update specific category
//--> route     PUT /api/v1/categories/:id
//--> access    private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name;
  const category = await CategoryModel.findOneAndUpdate(
    { _id: id }, // the filter
    { name, slug: slugify(name) }, // the new data of update
    { new: true }, //options
  );
  if (!category) {
    return next(new ApiError(`there is no category with this id :${id} `, 404));
  }
  res.status(200).json({ data: category });
});

//--> desc      delete specific category
//--> route     DELETE  /api/v1/categories/:id
//--> access    private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`there is no category with this id :${id} `, 404));
  }
  res.status(204).json();
});
