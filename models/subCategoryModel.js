const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "the subCategory name  must be unique "],
      minLength: [2, "Too short subCategory name "],
      maxLength: [32, "Too long subCategory name "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "The subcategory must be belongs to part category "],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subcategory", subCategorySchema);
