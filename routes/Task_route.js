const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const FetchUser = require("../middleware/FetchUser");
const TaskModel = require("../models/Task");


// create or add products
router.post(
  "/addtask",
  FetchUser,
  body("title", "Enter a valid title").isLength({ min: 3 }),
  body("description", "Enter a valid description").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const {title,description } = req.body;
      if (!title|| !description) {
        return res.status(400).json({ error: "Please fill all the fields" });
      }
      const task = await TaskModel.create({
        user: req.user.id,
        title,
        description
      });
      const saveTask = await task.save();
      res
        .status(201)
        .json({ message: "Task added successfully", task: saveTask });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


// get user-specific tasks
router.get("/getusertask", FetchUser, async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user.id });
    res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      }
      }
      );

// get all tasks 
router.get("/getalltasks", FetchUser, async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery
      ? {
          title: {
            $regex: req.query.searchQuery,
            $options: "i",
          },
        }
      : {};
    const task = await TaskModel.find({ ...searchQuery });
    res.json(task);
  } catch (error) {
    res.status(500).send("internal server error");
  }
});





// update task
router.put("/updatetask/:id", FetchUser, async (req, res) => {
  try {
    const id = req.params.id;
    const {title, description } = req.body;
    if (!title || !description ) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const newTask = {};
    if (title) newTask.title = title;
    if (description) newTask.description = description;
    
    let task = await TaskModel.findByIdAndUpdate(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (!task.user || task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    task = await TaskModel.findByIdAndUpdate(
      id,
      { $set: newTask },
      { new: true }
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete product
router.delete("/deletetask/:id", FetchUser, async (req, res) => {
  try {
    const id = req.params.id;
    let task = await TaskModel.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (!task.user || task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
