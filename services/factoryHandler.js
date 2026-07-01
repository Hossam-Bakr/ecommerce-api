const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeature = require("../utils/apiFeatures");

exports.deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndDelete(id);

    if (!documents) {
      return next(new ApiError(`there is no item  with this id :${id} `, 404));
    }
    res.status(204).json();
  });
};

exports.updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, //options
    );
    if (!document) {
      return next(
        new ApiError(`there is no document with this id :${id} `, 404),
      );
    }
    res.status(200).json({ data: document });
  });
};

exports.createOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });
};

exports.getOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`there is no document with this id :${id} `, 404),
      );
    }
    res.status(200).json({ data: document });
  });
};

exports.getAll = (Model, modelName = "") => {
  return asyncHandler(async (req, res) => {
    // handle the nested route
    let filterByCategory = {};
    if (req.filterObject) {
      filterByCategory = req.filterObject;
    }
    console.log(req.query.keyword);
    // build query
    const countOfDocuments = await Model.countDocuments();
    const ApiFeatureObj = new ApiFeature(
      Model.find(filterByCategory),
      req.query,
    )
      .paginate(countOfDocuments)
      .filter()
      .select()
      .sort()
      .search(modelName);
    // .populate({ path: "category", select: "name -_id" })
    const { paginationResult, mongooseQuery } = ApiFeatureObj;
    // excute the query
    let documents = await mongooseQuery;
    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
};
