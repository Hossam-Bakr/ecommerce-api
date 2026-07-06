const mongoose = require("mongoose");
const Product = require("../models/productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      minlength: [3, "Too short review title"],
      maxlength: [200, "Too long review title"],
    },
    rating: {
      type: Number,
      required: [true, "Review rating is required"],
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be below or equal 5"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    // parent refernce (one to many relationship )
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name" });
});

// reviewSchema.pre(/^find/, function () {
//   this.populate({ path: "user", select: "name" }).populate({
//     path: "product",
//     select: "title imageCover price",
//   });
// });

reviewSchema.statics.calcAvgRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numberOfRatings: result[0].ratingQuantity,
      ratingAvg: result[0].avgRatings,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      numberOfRatings: 0,
      ratingAvg: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRatingAndQuantity(this.product);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAvgRatingAndQuantity(this.product);
  },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
