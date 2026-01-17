const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, getOrderStats, updateOrderStatus } = require("../controllers/order.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

router.use(protectedRoute);

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/stats", getOrderStats);
router.patch("/:id/status", updateOrderStatus);
router.get("/:id", getOrderById);

module.exports = router;
