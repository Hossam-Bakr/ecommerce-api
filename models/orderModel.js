const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Order item must belong to a product"],
        },
        quantity: {
          type: Number,
          required: [true, "Order item quantity is required"],
          default: 1,
        },
        color: String,
        price: {
          type: Number,
          required: [true, "Order item price is required"],
        },
      },
    ],

    shippingAddress: {
      details: {
        type: String,
        required: [true, "Address details are required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      postalCode: {
        type: String,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    totalOrderPrice: {
      type: Number,
      required: [true, "Total order price is required"],
    },

    totalOrderPriceAfterDiscount: Number,

    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true },
);

orderSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name email profileImg",
  }).populate({
    path: "cartItems.product",
    select: "title imageCover ratingsAverage",
  });
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
