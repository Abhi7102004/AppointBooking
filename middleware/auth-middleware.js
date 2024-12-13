const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/token-blacklist-model");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }
    const token = authHeader.split(" ")[1];
    const isBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token has been blacklisted",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid Token",
      success: false,
    });
  }
};

module.exports=isAuthenticated;
