const express = require("express");
const isAuthenticated = require("../middleware/auth-middleware");
const { bookSlot, pendingRequests, activeRequests, respondToStudentRequest, cancelSlot } = require("../controllers/appoinment-controller");
const router = express.Router();

router.post("/book-slot", isAuthenticated, bookSlot);
router.get("/pending-requests", isAuthenticated, pendingRequests);
router.get("/active-requests", isAuthenticated, activeRequests);
router.post("/requests/:requestId/respond", isAuthenticated, respondToStudentRequest);
router.put("/cancel-slot/:slotId", isAuthenticated, cancelSlot);

module.exports = router;
