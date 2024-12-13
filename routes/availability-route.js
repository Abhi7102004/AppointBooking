const express = require("express");
const {
  addSlots,
  checkProfessorAvailability,
} = require("../controllers/availability-controller");
const isAuthenticated = require("../middleware/auth-middleware");
const router = express.Router();

router.post("/add-slot", isAuthenticated, addSlots);
router.get(
  "/check-availability/:professor",
  isAuthenticated,
  checkProfessorAvailability
);
module.exports = router;
