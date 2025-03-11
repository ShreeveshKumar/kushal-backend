const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/ratingController");
const authMiddleware = require("../middleware/auth");

router.post("/app-rating", authMiddleware, feedbackController.apprating);
router.post("/washer-feedback", authMiddleware, feedbackController.washerfeedback);

module.exports = router;
