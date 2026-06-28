const CategoryModel = require("../models/categoryModel");
const factory = require("./factoryHandler");

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
