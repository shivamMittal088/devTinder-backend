const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/UserModel");
const {validateUserData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {auth} = require("./middlewares/auth");


const app = express();

app.use(cookieParser()); // parse the cookie without it req.cookies will be undefined.
app.use(express.json()); // without this line req.body will be undefined.
// it is a middleware which will parse the json data and put it in req.body .

// signup API creation .
app.post("/signup", async (req, res) => {
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

// Get /user by email API creation .
app.get("/user", auth , async (req, res) => {
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


// Get /feed API creation .
app.get("/feed" , auth , async(req,res)=>{
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


// deleteByID API creation .
app.delete("/deleteById", auth , async(req,res)=>{
    const id = req.body._id;
    try{
        const user = await UserModel.findByIdAndDelete(id);
        if(!user){
            res.status(404).send("User not found");
    }
        res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("Error in deleting user",err);
    }
})


// update the data of the user using patch API .
app.patch("/updateUser/:userId" , auth , async(req,res)=>{
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


// login API creation .
app.post("/login" , async(req,res)=>{
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


// Profile API creation .
app.get("/profile" ,async(req,res)=>{
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
 



connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log(`Error in connecting to database`, err);
  });

// we will first connect to database and then start the server.
// because if database is not connected and server is started then our application will not make api calls to database and it will give error.
