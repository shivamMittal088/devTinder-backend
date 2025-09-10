const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/UserModel");

const app = express();

app.use(express.json()); // without this line req.body will be undefined.
// it is a middleware which will parse the json data and put it in req.body .

// signup API creation .
app.post("/signup", async (req, res) => {
  // sending data from postman to the database .
  // dynamic way to enter data into database .

  console.log(req.body);

  // creating new instance of the userModel .
  const user = new UserModel(req.body);
  await user.save();
  res.send("Data received");

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
app.get("/user", async (req, res) => {
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
app.get("/feed" , async(req,res)=>{
    try{
        const users = await UserModel.find(
            {}
        )
        if(users === 0){
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
app.delete("/deleteById", async(req,res)=>{
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
app.patch("/updateUser",async(req,res)=>{
    const id = req.body._id;
    const updatedData = req.body;

    try{
        const user = await UserModel.findByIdAndUpdate(id,updatedData,
            {returnDocument : "after"} // it will return the updated document.
            );
        if(!user){
            res.status(404).send("User not found");
        }
        console.log(user);
        res.send("User updated successfully");
    }
    catch(err){
        res.status(500).send("Error in updating user",err);
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
