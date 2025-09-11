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


const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const profileRouter = require("./routes/profileRouter");
const connectionRequestRouter = require("./routes/connectionRequestRouter");

app.use("/",authRouter);
app.use("/",userRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);







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









 



app.post("/sendConnectionRequest" , auth , async(req,res)=>{
    const {fromUserId , toUserId} = req.body;
    try{
        const fromUser = await UserModel.findById(fromUserId);
        const toUser = await UserModel.findById(toUserId);

        if(!fromUser || !toUser){
            return res.status(404).send("User not found");
        }

        // check if the connection request is already sent.

    }catch(err){
        res.status(500).send("Error in sending connection request",err);
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
