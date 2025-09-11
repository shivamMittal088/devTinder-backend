const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUserData } = require("../utils/validation");;
const UserModel = require("../models/UserModel");
const {auth} = require("../middlewares/auth");



const authRouter = express.Router();

// signup API creation .
authRouter.post("/signup", async (req, res) => {
  // sending data from postman to the database .
  // dynamic way to enter data into database .

//   console.log(req.body);

  
  try{
    // validate the user data before creating user .
    validateUserData(req);

    const {firstName,lastName,emailId,password,age,photoURL,about,gender,skills} = req.body;

    const passwordHash = await bcrypt.hash(password,10)


    // creating new instance of the userModel .
    const user = new UserModel(
        {
            firstName ,  // shorthand property names in object literal.
            lastName,
            emailId,
            password : passwordHash,
            age,
            photoURL,
            about,
            gender,
            skills,
        }
    );


    await user.save();
    res.send("Data received");
    }catch(err){
        return res.status(400).send(
        {
            error: err.message,
            code: "INVALID_USER_DATA",
            suggestion: "Please provide valid user data."
        }
    );
  }

  // creating user to the database .
  // static way to enter data into database .
  //   const userObj = {
  //     firstName: "Shivam",
  //     lastName: "Mittal",
  //     emailId: "shivam@gmail.com",
  //     password: "shivam@123",
  //     age: 21,
  //   };

  //   try {
  //     const user = new UserModel(userObj);
  //     await user.save();
  //     res.send("User created successfully");
  //   } catch (err) {
  //     res.status(500).send(`Error in creating user`,err);
  //   }
});

// login API creation .
authRouter.post("/login" , async(req,res)=>{
    const { emailId , password }  = req.body;

    try{
        const user = await UserModel.findOne(
            {emailId : emailId}
        )

        if(!user){
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password,user.password);

        // valid login credentials.
        if(isMatch){

            // creating a jwt token and sending it to the user in cookie.
            const token = await jwt.sign(
                { _id : user._id }
                , "DEV@TINDER$123"  // SECRET KEY ---> should be long and complex.
                // stored only inside server .
                // , { expiresIn : "1h" }  // token will expire in 1 hour.
            )   

            // attaching the token in cookie.
            res.cookie("auth_token",token);

            return res.send("User logged in successfully");
        }

        return res.status(400).send("Invalid credentials");

    }catch(err){
        res.status(500).send("Error in logging in user", + err.message);
    }
})