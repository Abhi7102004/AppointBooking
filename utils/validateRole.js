const userModel = require("../models/user-model");

const validateRole = async (roleSaved, role) => {
  if (roleSaved !== role) {
    return res.status(403).json({
      message: "Access Denied",
    });
  }
};
const getRole = async (userId) => {
  const user = await userModel.findById(userId);
  return user?.role;
};
module.exports = { validateRole, getRole };
