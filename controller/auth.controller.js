const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
//register user
exports.registerUser = async(req,res)=>{
    try {
        const {name,email,password,confirmPassword} = req.body;
        if(!name || !email || !password || !confirmPassword){
           return res.status(400).json({
                message:"All fields are required!"
            })
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                message:"User with that email already registered!"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                message:"Credentials doesnot match!"
            })
        }

         // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRegistered = await User.create({
            name,
            email,
            password:hashedPassword
        })
        res.status(200).json({
            message:"User registered successfully",
            data:userRegistered
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal Server Error!"
        })   
        
    }
}



// login user
exports.loginUser = async(req,res)=>{
    try {

        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"All fields required!"
            })
        }

        const userExist = await User.findOne({email});
        if(!userExist){
            return res.status(400).json({
                message:"User with that email not found"
            })
        }
        
        const isPasswordValid = await bcrypt.compare(password,userExist.password)
        if(!isPasswordValid){
           return res.status(400).json({
                message:"Invalid credentials"
            })
        }
            
        const token = jwt.sign({id:userExist._id},JWT_SECRET,{expiresIn:"1d"})
        // console.log(token);
            
        
         res.status(200).json({
            message:"User loggedin successfully",
            data:userExist,
            token:token
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal Server Error!"
        })   
    }
}
