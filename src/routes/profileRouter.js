const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const { auth } = require("../middlewares/auth");


const profileRouter = express.Router();

// Profile API creation .
profileRouter.get("/profile/view" ,async(req,res)=>{
    // get the cookie 
    const token = req.cookies?.auth_token;
    if(!token){
        return res.status(401).send("Unauthorized");
    }

    try{
        // validate the user using the token.
        const decoded = await jwt.verify(token,"DEV@TINDER$123");   
        // if token is valid then decoded will contain the payload of the token.
        // if token is invalid then it will throw an error.
        
        const userId = decoded._id;
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).send("User not found");
        }
        return res.send(user);
    }catch(err){
        return res.status(401).send("Invalid token");
    }
})


// update the data of the user using patch API .
profileRouter.patch("/profile/edit/:userId" , auth , async(req,res)=>{
    const id = req.params?.userId;
    const updatedData = req.body;

    try{
        const ALLOWED_UPDATES = ["firstName","lastName","password","age","photoURL","about","skills","gender"];
        const requestedUpdates = Object.keys(updatedData);
        const isValidOperation = requestedUpdates.every((update)=>{
            return ALLOWED_UPDATES.includes(update);
        })

        if(!isValidOperation){
            return res.status(400).send(
                {
                    error: "Invalid updates!",
                    code: "INVALID_UPDATES",
                    suggestion: `You can update only the following fields: ${ALLOWED_UPDATES.join(", ")}`
                }
            );
        }

        if(updatedData?.skills && updatedData?.skills.length > 8){
            return res.status(400).send(
                {
                    error: "Skills cannot be more than 8",
                    code: "SKILLS_LIMIT_EXCEEDED",
                    suggestion: "Please reduce the number of skills to 8 or fewer."
                }
            );
        }

        // we have send not string but an object of field in case of error 
        // because we want to give more information about the error to the user and 
        // it might be possible that in some case the user expected json object in response but we are sending string in case of error which is hard to parse than json object.

        const user = await UserModel.findByIdAndUpdate(id,updatedData,
            {returnDocument : "after" , // it will return the updated document.
            runValidators : true }
            );
        if(!user){
            return res.status(404).send("User not found");
        }else{
            console.log(user);
            return res.send("User updated successfully");
        }
        
    }
    catch(err){
        res.status(500).send("Error in updating user", +err);
    }
})