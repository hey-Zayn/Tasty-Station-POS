const express = require("express");
const router = express.Router();
const { createTable, getTables, updateTable, deleteTable } = require("../controllers/table.controller");
const { protectedRoute, isAdmin } = require("../middlewares/auth.middleware");

// All routes protected by Auth and Admin (for now)
router.use(protectedRoute);

router.get("/", getTables); // Waiters might need this later, but protected for now
router.post("/", isAdmin, createTable);
router.put("/:id", isAdmin, updateTable);
router.delete("/:id", isAdmin, deleteTable);

module.exports = router;
