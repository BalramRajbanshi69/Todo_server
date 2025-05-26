require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();

const DBConnection = require("./DB/db");
DBConnection();
const PORT = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("Hello world!");
})


// api
app.use("/api/auth",require("./routes/Auth"));
app.use("/api/task",require("./routes/Task_route"));




app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
    
})