const express = require("express");
const router = express.Router();
const { login, signup, logout } = require("../controllers/user-controller");
const isAuthenticated = require("../middleware/auth-middleware");

router.post("/signup", signup);
router.post("/login", login);
router.put("/logout",isAuthenticated,logout);

module.exports = router;
