const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @param {string} role - User Role (Admin, HR, Employee)
 * @returns {string} JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;
