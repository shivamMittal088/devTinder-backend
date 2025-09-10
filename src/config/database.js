const mongoose = require('mongoose');


const connectDB = async ()=>{
    // returns a promise .
    await mongoose.connect(
        "mongodb+srv://Shivam:MyPassword12345@namastenode.1ozmfux.mongodb.net/devTinder"
        // witout devTinder it is a collection which contains all the databases but we want to connect to a particular database which is devTinder hence we specify it.
    );
}


module.exports = connectDB;