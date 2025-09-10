const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
    },
    password : {
        type : String,
    },
    age : {
        type : Number
    },
 })

 const UserModel = mongoose.model("User",userSchema);
 // generally model first character is capital and rest small.

 module.exports = UserModel;

 // schema tells about the fields in the collection and their types.