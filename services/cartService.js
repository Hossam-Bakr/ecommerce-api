const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/ApiError");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  return totalPrice;
};

const calcTotalPriceAfterDiscount = (cart, coupon) => {
  const totalPrice = calcTotalPrice(cart);

  if (!coupon) {
    return totalPrice;
  }

  return (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2);
};

/**
 * @desc    Add product to logged user cart
 * @route   POST /api/v1/cart
 * @access  Private - User
 */
exports.addTocart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("there is no product with this id", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
      totalPrice: product.price,
      totalPriceAfterDiscount: product.price,
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId &&
        String(item.color || "") === String(color || ""),
    );

    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }

    cart.totalPrice = calcTotalPrice(cart);
    cart.totalPriceAfterDiscount = undefined;
    await cart.save();
  }

  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "product added successfully to cart",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Get logged user shopping cart
 * @route   GET /api/v1/cart
 * @access  Private - User
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("there is no cart for this user", 404));
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Remove specific cart item
 * @route   DELETE /api/v1/cart/:itemId
 * @access  Private - User
 */
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true },
  );

  if (!cart) {
    return next(new ApiError("there is no cart for this user", 404));
  }

  cart.totalPrice = calcTotalPrice(cart);
  cart.totalPriceAfterDiscount = undefined;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Clear logged user shopping cart
 * @route   DELETE /api/v1/cart
 * @access  Private - User
 */
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

/**
 * @desc    Update specific cart item quantity
 * @route   PUT /api/v1/cart/:itemId
 * @access  Private - User
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("there is no cart for this user", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId,
  );

  if (itemIndex === -1) {
    return next(new ApiError("there is no cart item with this id", 404));
  }

  cart.cartItems[itemIndex].quantity = req.body.quantity;

  cart.totalPrice = calcTotalPrice(cart);
  cart.totalPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Apply coupon on logged user cart
 * @route   PUT /api/v1/cart/applyCoupon
 * @access  Private - User
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("coupon is invalid or expired", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("there is no cart for this user", 404));
  }

  cart.totalPrice = calcTotalPrice(cart);
  cart.totalPriceAfterDiscount = calcTotalPriceAfterDiscount(cart, coupon);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
