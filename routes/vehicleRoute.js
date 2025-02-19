const express = require("express");
const router = express.Router();
const vehicleController = require("../controller/vehicleController");
const authMiddleware = require("../middleware/auth");

router.post("/addvehicle", authMiddleware, vehicleController.addvehicle);
router.get("/getvehicle", authMiddleware, vehicleController.viewvehicle);


module.exports = router;



