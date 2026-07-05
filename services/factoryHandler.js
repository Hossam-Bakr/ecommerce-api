const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeature = require("../utils/apiFeatures");

/**
 * @desc    Create a reusable handler to delete one document by id
 * @param   {Object} Model - Mongoose model
 * @returns {Function} Express async middleware
 */
exports.deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`there is no item with this id :${id} `, 404));
    }

    await document.deleteOne();

    res.status(204).json();
  });
};

/**
 * @desc    Create a reusable handler to update one document by id
 * @param   {Object} Model - Mongoose model
 * @returns {Function} Express async middleware
 */
exports.updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(
          `there is no document with this id :${req.params.id} `,
          404,
        ),
      );
    }

    document.save();
    res.status(200).json({ data: document });
  });
};

/**
 * @desc    Create a reusable handler to create one document
 * @param   {Object} Model - Mongoose model
 * @returns {Function} Express async middleware
 */
exports.createOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });
};

/**
 * @desc    Create a reusable handler to get one document by id
 * @param   {Object} Model - Mongoose model
 * @returns {Function} Express async middleware
 */
exports.getOne = (Model, populationOpt) => {
  return asyncHandler(async (req, res, next) => {
    // build query
    let query = Model.findById(req.params.id);
    if (populationOpt) {
      query = Model.findById(req.params.id).populate(populationOpt);
    }
    //execute query
    const document = await query;
    if (!document) {
      return next(
        new ApiError(
          `there is no document with this id :${req.params.id} `,
          404,
        ),
      );
    }

    res.status(200).json({ data: document });
  });
};

/**
 * @desc    Create a reusable handler to get all documents with filtering, sorting, searching, field selection, and pagination
 * @param   {Object} Model - Mongoose model
 * @param   {string} [modelName=""] - Model name used for search features
 * @returns {Function} Express async middleware
 */
exports.getAll = (Model, modelName = "") => {
  return asyncHandler(async (req, res) => {
    // Handle nested route filters such as category or parent resource filtering
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    // Build query with API features
    const countOfDocuments = await Model.countDocuments();
    const ApiFeatureObj = new ApiFeature(Model.find(filter), req.query)
      .paginate(countOfDocuments)
      .filter()
      .select()
      .sort()
      .search(modelName);

    const { paginationResult, mongooseQuery } = ApiFeatureObj;

    // Execute final query
    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
};
