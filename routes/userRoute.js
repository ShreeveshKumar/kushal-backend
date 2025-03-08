const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/auth");

router.post("/deletemyaccount",authMiddleware,userController.deleteaccount);

module.exports = router; 