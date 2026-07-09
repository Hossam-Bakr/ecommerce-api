const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./factoryHandler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

/**
 * @desc    Create cash order
 * @route   POST /api/v1/orders/:cartId
 * @access  Protected/User
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingCost = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) Get order price depend on cart price (check if coupon applied)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingCost;

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
    taxPrice,
    shippingCost,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

/**
 * @desc    Create cash order
 * @route   POST /api/v1/orders/create-checkout-session/:cartId
 * @access  Protected/User
 */
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingCost = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) Get order price depend on cart price (check if coupon applied)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingCost;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100, // Stripe wants the smallest currency unit (piastres)
          product_data: {
            name: `order for ${req.user.name}`, // must be a string, not the ObjectId
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    client_reference_id: req.params.cartId,
    customer_email: req.user.email,
    metadata: { shippingAddress: JSON.stringify(req.body.shippingAddress) },
  });

  res.status(200).json({ status: "success", session });
});

/**
 * @desc    Filter orders for logged user (user only sees their own orders)
 *          Used as middleware before findAllOrders — admins/managers see everything
 */
exports.filterOrderForLoggedUser = (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Protected/User-Admin-Manager
 */
exports.findAllOrders = factory.getAll(Order);

/**
 * @desc    Get single order
 * @route   GET /api/v1/orders/:id
 * @access  Protected/User-Admin-Manager
 */
exports.findSpecificOrder = factory.getOne(Order);

/**
 * @desc    Update order paid status to true
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Protected/Admin-Manager
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

/**
 * @desc    Update order delivered status to true
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Protected/Admin-Manager
 */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});
