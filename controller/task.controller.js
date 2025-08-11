const Task = require("../models/Task");

exports.addTask = async (req, res) => {
    try {
      const {title,description } = req.body;      
      if (!title|| !description) {
        return res.status(400).json({ error: "Please fill all the fields" });
      }
      const task = await Task.create({
        user: req.user.id,
        title,
        description
      });

     
      res
        .status(201)
        .json({ message: "Task added successfully", data: task });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }


  exports.getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user");    
    res.status(200).json({
        message:"All task fetched",
        data:tasks
    });
  } catch (error) {
    res.status(500).send("internal server error");
  }
}


exports.getTaskById = async(req,res)=>{
  try {
    const id = req.params.id;
    const task = await Task.findById(id)
    res.status(200).json({
      message:"Id with task fetched",
      data:task
    })
  } catch (error) {
        res.status(500).send("internal server error");
  }
}

exports.getUserTask = async (req, res) => {
  try {
    const userId = req.user.id
    // console.log(userId);
    
    const tasks = await Task.find({ user:userId }).populate("user");
    // console.log(tasks);
    
    res.status(200).json({
        message:"User tasks fetched",
        data:tasks
    });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      }
      }


  exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const {title, description } = req.body;
    if (!title || !description ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const newTask = {};
    if (title) newTask.title = title;
    if (description) newTask.description = description;
    
    let task = await Task.findByIdAndUpdate(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (!task.user || task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    task = await Task.findByIdAndUpdate(
      id,
      { $set: newTask },
      { new: true }
    );
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}    


exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    let task = await Task.findByIdAndDelete(id);
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
}