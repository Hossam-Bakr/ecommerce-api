const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the coupon name is required "],
      unique: [true, "the coupon name must be unique "],
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, "the expire date is required "],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount value is required "],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
