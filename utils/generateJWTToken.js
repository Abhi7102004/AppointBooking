const jwt = require("jsonwebtoken");

const generateJWTToken = (user) => {
  try {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};
module.exports = generateJWTToken;
