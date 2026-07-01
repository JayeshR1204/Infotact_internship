const User = require("../models/User");

// GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
