const express = require("express");
const backlogController = require("../controllers/backlogController");

const router = express.Router();

router.get("/backlog", backlogController.getBacklog);
router.post("/backlog", backlogController.createBacklog);
router.put("/backlog/add-task/:taskId", backlogController.addTaskToBacklog);

module.exports = router;
