const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Route
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      return res.status(401).json({
        message: "Token not found",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

// Role Authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
