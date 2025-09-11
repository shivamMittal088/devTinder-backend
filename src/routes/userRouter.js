const express = require("express");
const { auth } = require("../middlewares/auth");
const UserModel = require("../models/UserModel");


const userRouter = express.Router();

// Get /feed API creation .
userRouter.get("/user/feed" , auth , async(req,res)=>{
    try{
        const users = await UserModel.find(
            {}
        )
        if(users.length === 0){
            res.status(404).send("No users found");
        }else{
            res.send(users);
        }
    }
    catch(err){
        res.status(500).send("Error in fetching users",err);
    }
})


// Get /user by email API creation .
userRouter.get("/user/email", auth , async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await UserModel.find(
      // returns an array of users matching the criteria.
      { emailId: email }
    );
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Error in fetching user", err);
  }
});