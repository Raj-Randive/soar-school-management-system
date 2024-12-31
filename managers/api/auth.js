const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../entities/User.mongoModel.js");
const { generateToken } = require("../token/jwt.js");
const { body } = require("express-validator");

const handleValidationErrors = require("../../mws/__validationErrors.js");

const ResponseDispatcher = require("../response_dispatcher/ResponseDispatcher.manager.js");
const dispatcher = new ResponseDispatcher();

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  handleValidationErrors, // Use middleware here
  async (req, res) => {
    try {
      const { name, email, password, role, school_id } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role, school_id });
      await user.save();

      return dispatcher.dispatch(res, {
        ok: true,
        code: 201,
        message: "User registered successfully",
        data: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors, // Use middleware here
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return dispatcher.dispatch(res, {
          ok: false,
          code: 401,
          message: "Invalid credentials",
        });
      }

      const token = generateToken(user);
      return dispatcher.dispatch(res, {
        ok: true,
        code: 200,
        message: "Login successful",
        data: { token, role: user.role },
      });
    } catch (error) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 500,
        message: "Internal server error",
        errors: [error.message],
      });
    }
  }
);

// Logout
router.post("/logout", async (req, res) => {
  try {
    // Invalidate token on client-side or blacklist token
    return dispatcher.dispatch(res, {
      ok: true,
      code: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 500,
      message: "Internal server error",
      errors: [error.message],
    });
  }
});

module.exports = router;
