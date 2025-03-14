const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");
const authMiddleware = require("../middleware/auth");

router.post("/schedule-task", authMiddleware, taskController.scheduleTask);
router.get("/get-washer", taskController.getWashers);
router.post("/user/post-task", authMiddleware, taskController.postTask);
router.get("/user/get-tasks", authMiddleware, taskController.getUserTasks);

module.exports = router;
