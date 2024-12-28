const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../entities/User.mongoModel.js");
const { generateToken } = require("../token/jwt.js");
const ResponseDispatcher = require("../response_dispatcher/responseDispatcher.manager.js");

const router = express.Router();
const dispatcher = new ResponseDispatcher();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, school_id } = req.body;

    if (!name || !email || !password || !role) {
      return dispatcher.dispatch(res, {
        ok: false,
        code: 400,
        message: "All fields are required",
      });
    }

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
});

// Login
router.post("/login", async (req, res) => {
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
});

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
