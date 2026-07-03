const LeaveRequest = require("../models/LeaveRequest");
const Leave = require("../models/Leave");
exports.createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({
      employee: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
