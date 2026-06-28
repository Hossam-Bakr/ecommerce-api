const Brand = require("../models/brandModel");
const factory = require("./factoryHandler");

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
