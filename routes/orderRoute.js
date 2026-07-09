const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  createCheckoutSession,
} = require("../services/orderService");

const authService = require("../services/authSevice"); // exports protect, allowedTo

const router = express.Router();

router.get(
  "/create-checkout-session/:cartId",
  authService.protect,
  authService.allowedTo("user"),
  createCheckoutSession,
);
// All order routes require a logged-in user
router.use(authService.protect);

router.post("/:cartId", authService.allowedTo("user"), createCashOrder);

router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders,
);

router.get(
  "/:id",
  authService.allowedTo("user", "admin", "manager"),
  findSpecificOrder,
);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid,
);

router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

module.exports = router;
