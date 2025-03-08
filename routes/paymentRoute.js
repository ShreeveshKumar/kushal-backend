const express = require("express"); 
const router = express.Router(); 
const paymentController = require("../controller/paymentController"); 


router.post("/pay/verify",paymentController.createCoupon); 



module.exports = router; 
