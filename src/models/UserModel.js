const mongoose = require('mongoose');
const validate = require('validator');

 const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength :3,
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
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("Invalid Email ID");
            }
        }
    },


    password : {
        type : String,
        required : true,
        minlength : 8,
        validate(value){
            if(!validate.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },


    age : {
        type : Number,
        min : 18,
    },


    photoURL : {
        type : String,
        validate(value){
            if(!validate.isURL(value)){
                throw new Error("Not a valid URL");
                }
            },
        },


    about : {
        type : String,
        default : "Hey there! I am using DevTinder",
        maxlength : 250,
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