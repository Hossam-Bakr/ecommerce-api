const Product = require("../models/productModel");
const factory = require("./factoryHandler");

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
