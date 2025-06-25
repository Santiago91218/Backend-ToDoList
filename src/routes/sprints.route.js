const express = require("express");
const router = express.Router();
const sprintController = require("../controllers/sprintController");

router.get("/sprints", sprintController.getAllSprints);
router.get("/sprints/:id", sprintController.getSprintById);
router.post("/sprints", sprintController.createSprint);
router.put("/sprints/:id", sprintController.updateSprint);
router.put("/sprints/:id/add-task/:taskId", sprintController.addTaskToSprint);
router.put(
  "/sprints/:id/move-task-backlog/:taskId",
  sprintController.moveTaskToBacklog
);
router.delete("/sprints/:id", sprintController.deleteSprint);

module.exports = router;
