const jwt = require("jsonwebtoken");
const config = require("../../config/index.config.js");

const generateToken = (user) => {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, verifyToken };
