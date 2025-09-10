const validate = require('validator');

const validateUserData = (req) => {
    const {firstName,lastName,emailId,password,age,photoURL,about,skills} = req.body;
    if(!firstName || !emailId || !password){
        throw new Error("give more credentials");
    }
    else if(firstName.length < 3 || firstName.length > 35){
        throw new Error("First name should be between 4 to 35 characters");
    }
    else if(lastName && (lastName.length > 35 || lastName.length === 0)){
        throw new Error("Last name should be less than 35 characters");
    }
    else if(!validate.isEmail(emailId)){
        throw new Error("Invalid Email ID");
    }
    else if(!validate.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
    else if(age && age < 18){
        throw new Error("Age should be greater than 18");
    }
    else if(photoURL && !validate.isURL(photoURL)){
        throw new Error("Not a valid URL");
    }
    else if(skills && skills.length > 8){
        throw new Error("Skills cannot be more than 8");
    }
    return true;

};

module.exports = {validateUserData};