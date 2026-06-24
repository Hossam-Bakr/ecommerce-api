const mongoose = require("mongoose");

// 1- create schema of the category
const CategorySchema = mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "The category name is required !"],
      minlength: [3, "Category name is too short ! "],
      maxlength: [32, "Category name must be less that 32 letter !"],
      unique: [true, "Category name must be uniqe !"],
    },
    slug: {
      type: "String",
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);
// 2- create model of the category
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
