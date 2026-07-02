const express = require("express");
const router = express.Router();

const {
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get("/profile/me", protect, getMyProfile);

router.get("/", protect, authorize("Admin"), getEmployees);

router.get("/:id", protect, authorize("Admin"), getEmployeeById);

router.put("/:id", protect, authorize("Admin"), updateEmployee);

router.delete("/:id", protect, authorize("Admin"), deleteEmployee);

module.exports = router;
