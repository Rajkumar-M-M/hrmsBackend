import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Wrong password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT,
      { expiresIn: "10d" }
    );

    // Send response
    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);
    // Check if headers already sent
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Server Error: " + error.message,
      });
    }
  }
};

// Token Verification Controller
const verify = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export { login, verify };
