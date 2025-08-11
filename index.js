require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();

const DBConnection = require("./DB/db");
DBConnection();
const PORT = process.env.PORT || 5000;



// middleware
app.use(cors({
    origin:["https://todo-task-app-indol.vercel.app","http://localhost:5173"],
    methods:["GET","POST","PATCH","PUT","DELETE"],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("Hello world!");
})


const authRoute = require("./routes/Auth")
const taskRoute = require("./routes/Task_route")

// api
app.use("/api/auth",authRoute);
app.use("/api/task",taskRoute);




app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
    
})