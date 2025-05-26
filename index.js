require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();

const DBConnection = require("./DB/db");
DBConnection();
const PORT = process.env.PORT || 5000;



// middleware
app.use(cors({
  origin: [
    'https://todo-task-app-indol.vercel.app',
    'http://localhost:5173',
    'http://localhost:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'auth-token', 'Authorization'],
  exposedHeaders: ['auth-token'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("Hello world!");
})


// api
app.use("/api/auth",require("./routes/Auth"));
app.use("/api/task",require("./routes/Task_route"));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!' 
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
    
})