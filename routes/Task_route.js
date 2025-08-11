const express = require("express");
const FetchUser = require("../middleware/FetchUser");
const { getAllTask, addTask, getUserTask, updateTask, deleteTask, getTaskById } = require("../controller/task.controller");
const router = express.Router();

router.route("/")
.get(getAllTask)
.post(FetchUser,addTask)

router.route("/getUserTask").get(FetchUser,getUserTask)
router.route("/:id")
.get(getTaskById)
.patch(FetchUser,updateTask)
.delete(FetchUser,deleteTask)

module.exports = router;
