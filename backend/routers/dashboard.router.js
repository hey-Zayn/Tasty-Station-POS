const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

router.get("/summary", protectedRoute, isAdmin, dashboardController.getDashboardOverview);

module.exports = router;
