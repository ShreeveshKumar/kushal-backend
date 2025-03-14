const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/forgot-password", authController.forgotpassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/validate", authController.validateUser);


module.exports = router;