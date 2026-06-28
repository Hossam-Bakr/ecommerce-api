const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./factoryHandler");

//--> desc      create subCategory
//--> route     POST /api/v1/subCategories
//--> access    private
exports.createSubCategory = factory.createOne(subCategoryModel);

//--> desc      get specific subCategory
//--> route     GET /api/v1/subCategories/:id
//--> access    public
exports.getsubCategory = factory.getOne(subCategoryModel);

//--> desc      update specific subCategory
//--> route     PUT /api/v1/subCategories/:id
//--> access    private
exports.updatesubCategory = factory.updateOne(subCategoryModel);

//--> desc      delete specific subCategory
//--> route     DELETE  /api/v1/subCategories/:id
//--> access    private

exports.deletesubCategory = factory.deleteOne(subCategoryModel);

//--> desc      get all  categories with pagination
//--> route     GET /api/v1/categories
//--> access    public
exports.getsubCategories = factory.getAll(subCategoryModel);

//   middleware for setting category id to body for create subcategory based on category
// route /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdInBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// Nested Route
// GET /api/v1/categories/:categoryId/subcategories/
exports.createFilterObj = (req, res, next) => {
  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};
  req.filterObject = filterObject;
  next();
};
