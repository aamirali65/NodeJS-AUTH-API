import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

mongoose
  .connect(`mongodb://127.0.0.1:27017/auth`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB connected successfuly"))
  .catch((error) => console.log(error));

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

// Model code
const User = mongoose.model("User", {
  Username: String,
  Email: String,
  Password: String,
});

// JWT key
const secretKey = "jwttokenkey";

// Register Routes
app.post("/register", async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;
    const user = new User({ Username, Email, Password });
    await user.save();
    res.status(200).json({
      message: "User Register Successfuly",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login Routes
app.post("/login",async(req,res)=>{
    try {
        const {Email,Password} = req.body;
        const user = await User.findOne({Email});
        if(!user){
            res.status(400).json({message:"User not found"});
            return;
        };
        const token = jwt.sign({Email:user.Email},secretKey,{expiresIn:"1h"});
        res.json({token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Login Failed"})
    }
})


// Port listen on
app.listen(port,()=>{
    console.log(`this Port is running on http://localhost:${port}/`)
})