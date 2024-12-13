const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const generateJWTToken = require("../utils/generateJWTToken");
const tokenBlacklistModel = require("../models/token-blacklist-model");
const { validateRole } = require("../utils/validateRole");
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are necessary",
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 characters long",
        success: false,
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    validateRole(user.role, role);
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = generateJWTToken(user._id);
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await tokenBlacklistModel.create({
      token,
      user: req.userId,
    });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { login, signup, logout };
