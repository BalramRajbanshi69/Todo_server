const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const DBConnection = ()=>{
    mongoose.connect(MONGO_URL).then(()=>{
        console.log("MongoDB connected successfully");
        
    })
}

module.exports = DBConnection;