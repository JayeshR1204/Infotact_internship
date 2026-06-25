const express = require("express");

const router = express.Router();

const {
  createLeaveRequest,
  getMyLeaves,
} = require("../controllers/leaveController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post("/", protect, createLeaveRequest);

router.get("/my-leaves", protect, getMyLeaves);

module.exports = router;
