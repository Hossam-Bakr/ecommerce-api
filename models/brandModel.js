const mongoose = require("mongoose");

// 1- create schema of the brand
const brandSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "The brand name is required !"],
      minlength: [3, "brand name is too short ! "],
      maxlength: [32, "brand name must be less that 32 letter !"],
      unique: [true, "brand name must be uniqe !"],
    },
    slug: {
      type: "String",
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);
module.exports= mongoose.model("brand", brandSchema);

