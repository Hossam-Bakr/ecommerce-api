const express = require("express");

const router = express.Router({mergeParams : true});
const { createSubCategory, getsubCategory, getsubCategories, updatesubCategory, deletesubCategory, setCategoryIdInBody , createFilterObj } = require("../services/subCategoryService");
const { createSubCategoryValidator, getSubCategoryValidator, deleteSubCategoryValidator, updateSubCategoryValidator } = require("../utils/validators/subCategoryValidator");

router
  .route("/").post(setCategoryIdInBody , createSubCategoryValidator ,  createSubCategory).get(createFilterObj , getsubCategories)
router
  .route('/:id').get(getSubCategoryValidator , getsubCategory).put(updateSubCategoryValidator , updatesubCategory).delete( deleteSubCategoryValidator , deletesubCategory)

module.exports = router;
