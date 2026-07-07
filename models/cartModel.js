const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

cartSchema.pre(/^find/, function () {
  this.populate({
    path: "cartItems.product",
    select: "title imageCover price quantity",
  });
});

module.exports = mongoose.model("Cart", cartSchema);
