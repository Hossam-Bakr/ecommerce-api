const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  return totalPrice;
};

exports.addTocart = asyncHandler(async (req, res, next) => {
  // get the cart related to user
  let { productId, color } = req.body;

  // if no cart for this user found , create one with the product
  let product = await Product.findById(productId);
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
      totalPrice: product.price,
      totalPriceAfterDiscount: product.price,
      user: req.user._id,
    });
  }
  // if there is a cart update it
  else {
    // check if the product is exist in cart ==> if yes update quantity or push it
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );
    console.log(productIndex);
    if (productIndex >= 0) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "product added successfully to cart ",
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user ", 404));
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
