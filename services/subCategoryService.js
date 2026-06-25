const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const subCategoryModel = require("../models/subCategoryModel");



// middleware for setting category id to body 

exports.setCategoryIdInBody = (req , res , next )=>{
  if (!req.body.category) {
      req.body.category = req.params.categoryId 
  }
// req.body.category = req.body.category ? req.params.categoryId : req.body.category

  next() ; 
}

//--> desc      create subCategory
//--> route     POST /api/v1/subCategories
//--> access    private
exports.createSubCategory = asyncHandler(async (req, res, next) => {

  const {name,category} = req.body ;
  const subCategory = await subCategoryModel.create({
    name: name,
    slug: slugify(name),
    category , 
  });
  res.status(201).json({ data: subCategory });
});

exports.createFilterObj = (req , res , next ) => {
  const filterObject = req.params.categoryId ? {category : req.params.categoryId } : {} ; 
  req.filterObject = filterObject 
  next()
}

//--> desc      get all  categories with pagination
//--> route     GET /api/v1/categories
//--> access    public
exports.getsubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  
  const subCategories = await subCategoryModel.find(req.filterObject).skip(skip).limit(limit).populate({path:'category' , select : 'name-_id'});
  res.status(200).json({ results: subCategories.length, page, data: subCategories });
});

//--> desc      get specific subCategory
//--> route     GET /api/v1/subCategories/:id
//--> access    public
exports.getsubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id);
  if (!subCategory) {
    return next(new ApiError(`there is no subCategory with this id :${id} `, 404));
  }
  res.status(200).json({ data: subCategory });
});



//--> desc      update specific subCategory
//--> route     PUT /api/v1/subCategories/:id
//--> access    private
exports.updatesubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
   const {name , category} = req.body;
  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id }, // the filter
    { name,category ,  slug: slugify(name) }, // the new data of update
    { new: true }, //options
  );
  if (!subCategory) {
    return next(new ApiError(`there is no subCategory with this id :${id} `, 404));
  }
  res.status(200).json({ data: subCategory });
});

//--> desc      delete specific subCategory
//--> route     DELETE  /api/v1/subCategories/:id
//--> access    private
exports.deletesubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`there is no subCategory with this id :${id} `, 404));
  }
  res.status(204).json();
});
