const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 4,
        maxlength : 35,
    },
    lastName : {
        type : String,
        maxlength : 35,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 8,

    },
    age : {
        type : Number,
        min : 18,
    },
    photoURL : {
        type : String,
    },
    about : {
        type : String,
        default : "Hey there! I am using DevTinder",
    },
    skills : {
        type : [String],  // array of strings.
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Not a valid Gender");
            }
        },
    }
 },
 {timestamps : true} // it will create createdAt and updatedAt fields automatically.
)

 const UserModel = mongoose.model("User",userSchema);
 // generally model first character is capital and rest small.

 module.exports = UserModel;

 // schema tells about the fields in the collection and their types.