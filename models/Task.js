const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required:true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      
    }
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("task", taskSchema);
module.exports = TaskModel;
