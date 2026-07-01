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

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// this working on findOne , findAll and  update
brandSchema.post("init", function (doc) {
  setImageUrl(doc);
});
// this working create
brandSchema.post("save", function (doc) {
  setImageUrl(doc);
});

module.exports = mongoose.model("Brand", brandSchema);
